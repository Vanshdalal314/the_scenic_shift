import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  const { slug } = await params;
  const { title, description } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("albums")
    .update({ title, description, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req, { params }) {
  const { slug } = await params;

  // Block deletion if the album still has photos in it
  const { count, error: countError } = await supabaseAdmin
    .from("photos")
    .select("*", { count: "exact", head: true })
    .eq("album", slug);

  if (countError)
    return NextResponse.json({ error: countError.message }, { status: 500 });

  if (count > 0) {
    return NextResponse.json(
      {
        error: `Album still has ${count} photo(s)/video(s). Delete them first.`,
      },
      { status: 400 },
    );
  }

  const { error } = await supabaseAdmin
    .from("albums")
    .delete()
    .eq("slug", slug);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
