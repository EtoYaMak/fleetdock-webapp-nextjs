import { NextResponse, NextRequest } from "next/server";
import type { CreateBidDTO } from "@/types/bids";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get bid data from request
    const bidData: CreateBidDTO = await request.json();

    // Insert the bid
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .insert({
        ...bidData,
        trucker_id: user.id,
      })
      .select()
      .single();

    if (bidError) {
      return NextResponse.json({ error: bidError.message }, { status: 400 });
    }

    return NextResponse.json(bid);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get load_id from query params
    const { searchParams } = new URL(request.url);
    const load_id = searchParams.get("load_id");

    if (!load_id) {
      return NextResponse.json({ bids: [] });
    }

    // First, verify the load belongs to the broker
    const { data: load, error: loadError } = await supabase
      .from("loads")
      .select("broker_id")
      .eq("id", load_id)
      .single();

    if (loadError || load?.broker_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to view these bids" },
        { status: 403 }
      );
    }

    // Fetch bids for the specified load
    const { data: bids, error: bidsError } = await supabase
      .from("bids")
      .select(
        `
        id,
        load_id,
        trucker_id,
        bid_amount,
        bid_status,
        created_at,
        updated_at
      `
      )
      .eq("load_id", load_id)
      .order("created_at", { ascending: false });

    if (bidsError) {
      return NextResponse.json({ error: bidsError.message }, { status: 400 });
    }

    return NextResponse.json({ bids: bids || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
