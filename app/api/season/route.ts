import { NextResponse } from "next/server";

/**
 * Extract seasons from HTML
 * Matches:
 * <a data-id="95956" ...>Season 1</a>
 */
function extractSeasons(html: string) {
  const regex = /<a\s+data-id="(\d+)"[^>]*>(.*?)<\/a>/g;

  const seasons = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    seasons.push({
      id: match[1],
      title: match[2].trim(),
    });
  }

  return seasons;
}

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

    const url = `https://hurawatchzz.tv/ajax/season/list/${id}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://hurawatchzz.tv/",
        "Accept": "text/html,*/*",
      },
    });

    const html = await response.text();

    // Parse seasons
    const seasons = extractSeasons(html);

    return NextResponse.json({ seasons });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
