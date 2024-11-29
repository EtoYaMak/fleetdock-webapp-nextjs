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

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Insert the vehicle
    const { data: vehicle, error } = await supabase
      .from("vehicles")
      .insert({
        profile_id: user.id,
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
      return NextResponse.json(
        { error: "Failed to register vehicle" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get vehicles for the current user's profile
    const { data: vehicles, error } = await supabase
      .from("vehicles")
      .select(
        `
        *,
        vehicle_types (
          name,
          capacity
        )
      `
      )
      .eq("profile_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch vehicles" },
        { status: 500 }
      );
    }

    return NextResponse.json({ vehicles });
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("id");

    if (!vehicleId) {
      return NextResponse.json(
        { error: "Vehicle ID is required" },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", vehicleId);
    if (error) {
      return NextResponse.json(
        { error: "Failed to delete vehicle" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
