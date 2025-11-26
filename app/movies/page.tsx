"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { fetchMovies, getMoviesBatch, Movie } from "@/lib/movie-service"


export default function MoviesPage() {
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("movies")

  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState("")
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 30

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const movies = await fetchMovies()
        console.log("[v0] All movies fetched:", movies.length)
        setAllMovies(movies)

        // Load first batch
        const firstBatch = getMoviesBatch(movies, 0, ITEMS_PER_PAGE)
        setDisplayedMovies(firstBatch)
        setPage(1)
        setError("")
      } catch (err) {
        console.error("Error loading movies:", err)
        setError("Failed to load movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  const loadMoreMovies = useCallback(() => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)

    // Simulate network delay
    setTimeout(() => {
      const nextBatch = getMoviesBatch(allMovies, page, ITEMS_PER_PAGE)

      if (nextBatch.length === 0) {
        setHasMore(false)
      } else {
        setDisplayedMovies((prev) => [...prev, ...nextBatch])
        setPage((prev) => prev + 1)
      }

      setLoadingMore(false)
    }, 300)
  }, [page, allMovies, loadingMore, hasMore])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          loadMoreMovies()
        }
      },
      { threshold: 0.1 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loadMoreMovies, loadingMore, hasMore])

  const filteredMovies = useMemo(() => {
    return displayedMovies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [searchQuery, displayedMovies])
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">All Movies</h1>

        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
                    <h3 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
                    <p className="text-xs text-gray-300">{movie.year}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded">
                    {movie.quality}
                  </div>
                </div>
              </Link>
            ))}
            {hasMore && (
              <div
                ref={observerTarget}
                className="col-span-full flex items-center justify-center py-10"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading more...
                  </div>
                ) : (
                  <div className="h-5"></div>
                )}
              </div>
            )}


            {!hasMore && displayedMovies.length > 0 && (
              <div className="w-full flex items-center justify-center py-12">
                <div className="text-muted-foreground">No more movies to load</div>
              </div>
            )}


          </div>
        )}


      </main >
    </div >
  )
}
