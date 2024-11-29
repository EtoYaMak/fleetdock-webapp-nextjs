import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: loadTypes, error } = await supabase
      .from('load_types')
      .select('*')
      .order('name');

    if (error) throw error;

    return NextResponse.json({ loadTypes });
  } catch (error) {
    console.error('Error fetching load types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch load types' },
      { status: 500 }
    );
  }
} 