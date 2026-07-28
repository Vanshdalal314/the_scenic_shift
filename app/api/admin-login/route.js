import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  if (!checkRateLimit(ip, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429 },
    );
  }

  const { password } = await req.json();

  if (password === process.env.ADMIN_PASSWORD) {
    const res = NextResponse.json({ success: true });
    res.cookies.set("admin_auth", process.env.ADMIN_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
