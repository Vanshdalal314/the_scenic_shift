import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { album, src, public_id, resource_type, caption } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("photos")
    .insert([{ album, src, public_id, resource_type, caption }])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function GET() {
  // Public read — anon key is fine here since RLS allows SELECT for everyone
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
