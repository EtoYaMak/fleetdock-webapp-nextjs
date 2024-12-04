/* create table
  public.bids (
    id uuid not null default gen_random_uuid (),
    load_id uuid not null,
    trucker_id uuid not null,
    bid_amount numeric not null,
    bid_status text null default 'pending'::text,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint bids_pkey primary key (id),
    constraint bids_load_id_fkey foreign key (load_id) references loads (id) on delete cascade,
    constraint bids_trucker_id_fkey foreign key (trucker_id) references profiles (id) on delete cascade
  ) tablespace pg_default;

create trigger auto_reject_bids
after
update on bids for each row
execute function reject_other_bids_on_accept ();

create trigger fixed_rate_assignment
after insert
or
update on bids for each row
execute function handle_fixed_rate_assignment (); */

import { TruckerProfile } from "./profile";

export type Bid = {
  id: string;
  load_id: string;
  trucker_id: string;
  bid_amount: number;
  bid_status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
};

export type BidWithProfile = Bid & {
  trucker_profile: TruckerProfile;
};

interface BidContextType {
  bids: Bid[];
  fetchBids: () => Promise<void>;
}
