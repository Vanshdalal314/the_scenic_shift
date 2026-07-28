import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAuthed } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { photo_id } = await req.json();

  const { error } = await supabaseAdmin
    .from("albums")
    .update({ cover_photo_id: photo_id })
    .eq("slug", slug);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
