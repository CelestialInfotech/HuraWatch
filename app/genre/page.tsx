"use client"

import Header from "@/components/header"
import { fetchMovies, Movie } from "@/lib/movie-service"
import Link from "next/link"
import { useEffect, useState } from "react"


export default function GenrePage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("")
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  //   // Load movies
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const movies = await fetchMovies()
        setAllMovies(movies)
        if (movies.length > 0) setSelectedGenre(movies[0].genre[0] || "")
      } catch (err) {
        console.error("Failed to load movies")
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])
  const genres = Array.from(new Set(allMovies.flatMap((m) => m.genre)))
  const filteredMovies = allMovies.filter((m) => {
    if (!selectedGenre) return true;

    if (!m.genre) return false;

    const genres = Array.isArray(m.genre) ? m.genre : [m.genre];

    return genres.includes(selectedGenre);
  });



  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
  //       </div>
  //     </div>
  //   )
  // }
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          </div>
        </div>
      ) : (<main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Browse by Genre</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-2">

            <h3 className="font-semibold text-lg mb-4">Genres</h3>
            <div className="flex flex-col gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`text-left px-4 py-2 rounded hover:bg-white hover:text-black transition-colors ${genre === selectedGenre ? "bg-accent text-white font-bold" : ""
                    }`}
                >
                  {genre}{" "}
                  <span className="text-xs ml-2 hover:text-black">
                    ({allMovies.filter((m) => {
                      if (!m.genre) return false;
                      const genres = Array.isArray(m.genre) ? m.genre : [m.genre];
                      return genres.includes(genre);
                    }).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-2xl font-bold mb-6">{selectedGenre} Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => (
                <Link
                  href={`/movie/${slugify(movie.title)}`}
                  onClick={() =>
                    sessionStorage.setItem("selectedMovie", JSON.stringify(movie))
                  }
                >
                  {/* // <Link key={movie.movie_id} href={`/movie/${movie.movie_id}`}> */}
                  <div className="relative group overflow-hidden rounded-lg aspect-[2/3]">
                    <img
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>)}
    </div>
  )
}
