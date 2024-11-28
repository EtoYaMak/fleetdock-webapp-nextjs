import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    const {
      vehicle_type_id,
      license_plate,
      manufacturer,
      model,
      year,
      insurance_expiry,
      last_maintenance_date,
      next_maintenance_date,
    } = data;

    // Get the current user's profile
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Insert the vehicle
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .insert({
        profile_id: session.user.id,
        vehicle_type_id,
        license_plate,
        manufacturer,
        model,
        year,
        insurance_expiry,
        last_maintenance_date,
        next_maintenance_date,
      })
      .select()
      .single();

    if (error) {
      console.error("Error registering vehicle:", error);
      return NextResponse.json(
        { error: "Failed to register vehicle" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    console.error("Vehicle registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
} 