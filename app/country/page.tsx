"use client"

import Header from "@/components/header"
import { fetchMovies, Movie } from "@/lib/movie-service"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CountryPage() {
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        const movies = await fetchMovies()
        setAllMovies(movies)
      } catch (err) {
        console.error("Failed to load movies")
      } finally {
        setLoading(false)
      }
    }
    loadMovies()
  }, [])

  // Extract all countries safely
  const COUNTRIES = Array.from(
    new Set(
      allMovies.flatMap((m) =>
        Array.isArray(m.country)
          ? m.country
          : m.country
            ? [m.country]
            : [] // fallback if missing
      )
    )
  )

  // Count movies by country safely
  const getMoviesCount = (country: string) =>
    allMovies.filter((movie) =>
      Array.isArray(movie.country)
        ? movie.country.includes(country)
        : movie.country === country
    ).length


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
        <h1 className="text-4xl font-bold mb-8">Browse by Country</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {COUNTRIES.map((country) => (
            <Link key={country} href={`/country/${encodeURIComponent(country)}`}>
              <div className="p-6 bg-card rounded-lg hover:bg-card/80 transition-colors cursor-pointer border border-border hover:border-accent">
                <h3 className="text-lg font-semibold">{country}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {getMoviesCount(country)} Movies
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>)}
    </div>
  )
}
