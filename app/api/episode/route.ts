import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const res = await fetch(`https://hurawatchzz.tv/ajax/episode/list/${id}`, {
    headers: { "X-Requested-With": "XMLHttpRequest" }
  });

  const data = await res.text();
  return NextResponse.json({ data });
}
