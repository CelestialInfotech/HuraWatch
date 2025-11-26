"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import TrendingSection from "@/components/trending-section"
import { Button } from "@/components/ui/button"
import { fetchMovies, getMoviesBatch, type Movie } from "@/lib/movie-service"
import router, { useRouter } from "next/router"

export default function Home() {
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

  // const getMovieLink = (movie: Movie) => {
  //   const movieDataEncoded = encodeURIComponent(JSON.stringify(movie))
  //   return `/movie/${movie.movie_id}?data=${movieDataEncoded}`
  // }
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-');

  // const getMovieLink = (movie: Movie) => {
  //   const slug = slugify(movie.title);
  //   const movieDataEncoded = encodeURIComponent(JSON.stringify(movie));
  //   return `/movie/${slug}?data=${movieDataEncoded}`;
  // };
  const handleClick = (movie: Movie) => {
    sessionStorage.setItem("selectedMovie", JSON.stringify(movie));
    router.push(`/movie/${slugify(movie.title)}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />

      <main className="container mx-auto px-4 py-12">
        {/* <TrendingSection /> */}

        <section className="my-12">

          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">Trending</h2>
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab("movies")}
                className={
                  activeTab === "movies" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }
                size="sm"
              >
                Movies
              </Button>
              <Button
                onClick={() => setActiveTab("tv")}
                className={
                  activeTab === "tv" ? "bg-accent text-accent-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                }
                size="sm"
              >
                TV Shows
              </Button>
            </div>
          </div>

          {error && <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-8">{error}</div>}

          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              </div>
            </div>
          ) : filteredMovies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredMovies.map((movie) => (
                  <Link
                    href={`/movie/${slugify(movie.title)}`}
                    onClick={() =>
                      sessionStorage.setItem("selectedMovie", JSON.stringify(movie))
                    }
                  >
                      {/* // <Link key={movie.movie_id} href={getMovieLink(movie)}> */}
                      {/* <Link key={movie.movie_id} href={`/movie/${movie.movie_id}`}> */}
                      <div className="relative group overflow-hidden rounded-lg aspect-[2/3]">
                        <img
                          src={movie.image || "/placeholder.svg?height=400&width=250&query=movie poster"}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                          <h3 className="text-sm font-semibold text-white line-clamp-2">{movie.title}</h3>
                          <p className="text-xs text-gray-300">
                            {movie.year} • {movie.duration}
                          </p>
                          {movie.genre && movie.genre.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">{movie.genre.slice(0, 2).join(", ")}</p>
                          )}
                        </div>
                        <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded">
                          {movie.quality}
                        </div>
                      </div>
                    </Link>
                ))}
                  </div>

              { hasMore && (
                    <div ref={observerTarget} className="flex items-center justify-center py-12">
                      {loadingMore && <div className="text-muted-foreground">Loading more movies...</div>}
                    </div>
                  )}

                {!hasMore && displayedMovies.length > 0 && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">No more movies to load</div>
                  </div>
                )}
              </>
              ) : (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">No movies found matching your search.</div>
              </div>
          )}
            </section>
      </main>
    </div>
  )
}
