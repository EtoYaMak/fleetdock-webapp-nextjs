import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { LoadFormData } from "@/types/load";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const data: LoadFormData = await request.json();

    // Get the user's ID from the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: load, error } = await supabase
      .from("loads")
      .insert({
        ...data,
        broker_id: user.id,
        status: "posted",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ load });
  } catch (error) {
    console.error("Error creating load:", error);
    return NextResponse.json(
      { error: "Failed to create load" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: loads, error } = await supabase
      .from('loads')
      .select('*')
      .eq('broker_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ loads });
  } catch (error) {
    console.error('Error fetching loads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loads' },
      { status: 500 }
    );
  }
} 