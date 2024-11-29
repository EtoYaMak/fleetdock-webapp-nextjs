import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('broker_businesses')
      .select('*')
      .eq('profile_id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ business: data });
  } catch (error) {
    console.error('Error fetching broker business:', error);
    return NextResponse.json(
      { error: 'Failed to fetch broker business details' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if business exists
    const { data: existingBusiness } = await supabase
      .from('broker_businesses')
      .select('id')
      .eq('profile_id', user.id)
      .single();

    let result;
    if (existingBusiness) {
      // Update
      result = await supabase
        .from('broker_businesses')
        .update(data)
        .eq('profile_id', user.id)
        .select()
        .single();
    } else {
      // Insert
      result = await supabase
        .from('broker_businesses')
        .insert({ ...data, profile_id: user.id })
        .select()
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ business: result.data });
  } catch (error) {
    console.error('Error updating broker business:', error);
    return NextResponse.json(
      { error: 'Failed to update broker business' },
      { status: 500 }
    );
  }
} 