import React from "react";
import { User } from "@/types/auth";
const TruckerDashboard = ({ user }: { user: User }) => {
  return <div>{user.full_name} Dashboard</div>;
};

export default TruckerDashboard;
