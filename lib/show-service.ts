export interface TvShow {
  title: string
  url: string
  image: string
  dimage: string
  quality: string
  type: string
  season: string
  episode: string
  duration: string
  title_detail: string
  score: number
  like: number
  dislike: number
  description: string
  country: string[]
  genre: string[]
  production: string[]
  casts: string[]
  released: string
  movie_id: string
  servers?: Array<{
    server_name: string
    link_id: string
    source: {
      type: string
      link: string
    }
  }>
}

const TVSHOW_API = "https://raw.githubusercontent.com/CelestialInfotech/HurawatchAPI/refs/heads/main/tvshows.json"

export async function fetchShows(): Promise<TvShow[]> {
  try {
    const response = await fetch(TVSHOW_API, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    if (!response.ok) {
      throw new Error("Failed to fetch tvshowa")
    }
    const data = await response.json()
    console.log("[v0] Fetched tvshowa count:", data.length)
    return data
  } catch (error) {
    console.error("Error fetching tvshowa:", error)
    return []
  }
}

export function getTop15TvShows(tvshowa: TvShow[]): TvShow[] {
  return tvshowa.slice(0, 15)
}

export function getTvShowsBatch(tvshowa: TvShow[], page: number, itemsPerPage = 30): TvShow[] {
  const startIndex = page * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return tvshowa.slice(startIndex, endIndex)
}
