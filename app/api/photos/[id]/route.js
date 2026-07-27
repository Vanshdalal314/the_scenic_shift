import cloudinary from "@/lib/cloudinary";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
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

export async function PATCH(req, { params }) {
  const { id } = await params;
  const { location } = await req.json();

  const { error } = await supabaseAdmin
    .from("photos")
    .update({ location })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
