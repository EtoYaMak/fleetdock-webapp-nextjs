import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: vehicleTypes, error } = await supabase
      .from("vehicle_types")
      .select("*")
      .order("name");

    if (error) {
      throw error;
    }

    return NextResponse.json(vehicleTypes);
  } catch (error) {
    console.error("Error fetching vehicle types:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle types" },
      { status: 500 }
    );
  }
}
