import { cookies } from "next/headers";

export async function isAuthed() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin_auth")?.value;
  return auth === process.env.ADMIN_PASSWORD;
}