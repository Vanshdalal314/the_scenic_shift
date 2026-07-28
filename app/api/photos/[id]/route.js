import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { isAuthed } from "@/lib/checkAdminAuth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const { error } = await supabaseAdmin
    .from("photos")
    .update(body)
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req, { params }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: photo } = await supabaseAdmin
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();

  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await cloudinary.uploader.destroy(photo.public_id, {
    resource_type: photo.resource_type,
  });

  const { error } = await supabaseAdmin.from("photos").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
