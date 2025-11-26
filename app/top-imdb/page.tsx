"use client"

import Header from "@/components/header"
import Link from "next/link"

const TOP_IMDB_MOVIES = [
  { id: 1, title: "One Battle After Another", imdb: 8.5, year: 2025, image: "/placeholder.svg?height=300&width=200" },
  { id: 2, title: "A Legend", imdb: 8.2, year: 2024, image: "/placeholder.svg?height=300&width=200" },
  { id: 3, title: "War of the Worlds", imdb: 8.0, year: 2025, image: "/placeholder.svg?height=300&width=200" },
  { id: 4, title: "The Prosecutor", imdb: 7.8, year: 2024, image: "/placeholder.svg?height=300&width=200" },
  { id: 5, title: "Operation Blood Hunt", imdb: 7.5, year: 2024, image: "/placeholder.svg?height=300&width=200" },
  { id: 6, title: "Playdate", imdb: 7.3, year: 2025, image: "/placeholder.svg?height=300&width=200" },
]

export default function TopIMDBPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">Top IMDB Rated</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {TOP_IMDB_MOVIES.map((movie, idx) => (
            <Link key={movie.id} href={`/movie/${movie.id}`}>
              <div className="relative group">
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold z-10">
                  {idx + 1}
                </div>
                <div className="overflow-hidden rounded-lg aspect-[2/3]">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <h3 className="text-sm font-semibold text-white">{movie.title}</h3>
                    <p className="text-xs text-yellow-400">★ {movie.imdb}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
