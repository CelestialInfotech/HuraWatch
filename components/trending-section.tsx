"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchMovies, type Movie } from "@/lib/movie-service"

const TRENDING_TV = [
  {
    id: 7,
    title: "Predator: Badlands",
    year: 2025,
    duration: "107m",
    quality: "CAM",
    image: "/predator-badlands.jpg",
  },
  {
    id: 8,
    title: "Stand Your Ground",
    year: 2025,
    duration: "100m",
    quality: "CAM",
    image: "/drama-stand.jpg",
  },
]

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState("movies")
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const allMovies = await fetchMovies()
        // Get first 6 movies for trending section
        setMovies(allMovies.slice(0, 6))
      } catch (err) {
        console.error("Error loading movies:", err)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    loadMovies()
  }, [])

  const items = activeTab === "movies" ? movies : TRENDING_TV.slice(0, 2)

  return (
    <section className="my-12 pt-20">
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

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading trending movies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Link key={item.id} href={`/movie/${item.id}`}>
              <div className="relative group overflow-hidden rounded-lg aspect-[2/3]">
                <img
                  src={item.image || "/placeholder.svg?height=400&width=250&query=movie poster"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-2">{item.title}</h3>
                  <p className="text-xs text-gray-300">
                    {item.year} • {item.duration}
                  </p>
                </div>
                <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                  {item.quality}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
