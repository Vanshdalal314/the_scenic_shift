import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAuthed } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { album, src, public_id, resource_type, caption, location } =
    await req.json();

  const { data, error } = await supabaseAdmin
    .from("photos")
    .insert([{ album, src, public_id, resource_type, caption, location }])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  await supabaseAdmin
    .from("albums")
    .update({ updated_at: new Date().toISOString() })
    .eq("slug", album);

  return NextResponse.json({ data });
}

export async function GET() {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}
