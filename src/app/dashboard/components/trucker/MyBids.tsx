import React, { memo } from "react";
import PendingBids from "./PendingBids";
import AcceptedBids from "./AcceptedBids";
import RejectedBids from "./RejectedBids";

const MyBids = memo(() => {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
      <div className="space-y-6">
        <PendingBids />
        <AcceptedBids />
        <RejectedBids />
      </div>
    </section>
  );
});

MyBids.displayName = "MyBids";
export default memo(MyBids);
