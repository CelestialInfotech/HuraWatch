export interface Movie {
  title: string
  url: string
  image: string
  dimage: string
  quality: string
  type: string
  year: string
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

const MOVIES_API = "https://raw.githubusercontent.com/CelestialInfotech/HurawatchAPI/refs/heads/main/movies.json"

export async function fetchMovies(): Promise<Movie[]> {
  try {
    const response = await fetch(MOVIES_API, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })
    if (!response.ok) {
      throw new Error("Failed to fetch movies")
    }
    const data = await response.json()
    console.log("[v0] Fetched movies count:", data.length)
    return data
  } catch (error) {
    console.error("Error fetching movies:", error)
    return []
  }
}

export function getTop15Movies(movies: Movie[]): Movie[] {
  return movies.slice(0, 15)
}

export function getMoviesBatch(movies: Movie[], page: number, itemsPerPage = 30): Movie[] {
  const startIndex = page * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return movies.slice(startIndex, endIndex)
}
