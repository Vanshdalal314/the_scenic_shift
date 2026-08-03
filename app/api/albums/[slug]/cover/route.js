import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAuthed } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { photo_id, cover_image_url } = await req.json();

  const updates = {};
  if (photo_id !== undefined) {
    updates.cover_photo_id = photo_id;
    updates.cover_image_url = null; // clear dedicated cover if pinning an existing photo instead
  }
  if (cover_image_url !== undefined) {
    updates.cover_image_url = cover_image_url;
    updates.cover_photo_id = null; // clear pinned photo if uploading a dedicated cover instead
  }

  const { error } = await supabaseAdmin
    .from("albums")
    .update(updates)
    .eq("slug", slug);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
