import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ?id= parameter" },
        { status: 400 }
      );
    }

    const url = `https://hurawatchzz.tv/ajax/season/episodes/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://hurawatchzz.tv/",
        "Accept": "text/html,*/*"
      }
    });

    const html = await response.text();

    const episodes = extractEpisodes(html);
    return NextResponse.json({ episodes });

  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to fetch episodes", details: err.message },
      { status: 500 }
    );
  }
}

function extractEpisodes(html: string) {
  const regex = /data-id="(\d+)"[\s\S]*?<strong>(Eps\s*\d+):<\/strong>\s*([^<]+)</g;

  const episodes = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    episodes.push({
      ep: match[2],          // "Eps 1"
      id: match[1],          // "1623868"
      title: match[3].trim() // "Episode #1.1"
    });
  }

  return episodes;
}
