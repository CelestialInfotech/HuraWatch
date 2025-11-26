"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { SearchIcon } from "lucide-react"
import Header from "@/components/header"
import MovieCard from "@/components/movie-card"
import { fetchMovies, Movie } from "@/lib/movie-service"
import Link from "next/link"

export default function SearchClient() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterGenre, setFilterGenre] = useState<string>("")
    const [filterQuality, setFilterQuality] = useState<string>("")
    const [filterYear, setFilterYear] = useState<string>("")
    const [allMovies, setAllMovies] = useState<Movie[]>([])
    const [visibleMovies, setVisibleMovies] = useState<Movie[]>([])

    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const [error, setError] = useState("")
    const observerRef = useRef<HTMLDivElement | null>(null)

    const PAGE_SIZE = 40 // how many movies load per scroll

    /** Load full movie list once */
    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true)
                const movies = await fetchMovies()
                setAllMovies(movies)

                // First batch of movies
                setVisibleMovies(movies.slice(0, PAGE_SIZE))

            } catch (err) {
                setError("Failed to load movies.")
            } finally {
                setLoading(false)
            }
        }

        loadMovies()
    }, [])

    /** Apply filters */
    const filteredMovies = useMemo(() => {
        return allMovies.filter((movie) => {
            const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesGenre =
                !filterGenre ||
                movie.genre.some((g) =>
                    g.toLowerCase().includes(filterGenre.toLowerCase())
                )

            const matchesQuality = !filterQuality || movie.quality === filterQuality
            const matchesYear = !filterYear || movie.year.toString() === filterYear

            return matchesSearch && matchesGenre && matchesQuality && matchesYear
        })
    }, [searchQuery, filterGenre, filterQuality, filterYear, allMovies])

    /** Reset visible movies when filter/search changes */
    useEffect(() => {
        setVisibleMovies(filteredMovies.slice(0, PAGE_SIZE))
    }, [filteredMovies])

    /** Infinite scroll observer */
    useEffect(() => {
        if (!observerRef.current) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore()
            }
        })

        observer.observe(observerRef.current)
        return () => observer.disconnect()
    }, [filteredMovies, visibleMovies])

    /** Add next batch */
    const loadMore = () => {
        if (loadingMore) return

        if (visibleMovies.length >= filteredMovies.length) return

        setLoadingMore(true)

        setTimeout(() => {
            const nextMovies = filteredMovies.slice(
                visibleMovies.length,
                visibleMovies.length + PAGE_SIZE
            )
            setVisibleMovies((prev) => [...prev, ...nextMovies])
            setLoadingMore(false)
        }, 300) // smooth load animation
    }

    const genres = Array.from(new Set(allMovies.flatMap((m) => m.genre)))
    const qualities = Array.from(new Set(allMovies.map((m) => m.quality)))
    const years = Array.from(
        new Set(allMovies.map((m) => Number(m.year)))
    )
        .filter((y) => !isNaN(y))
        .sort((a, b) => b - a)
    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl font-bold mb-8">Search Movies & TV Shows</h1>

                {/* Search input */}
                <div className="relative mb-8">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-card rounded-lg border"
                        placeholder="Search..."
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="px-4 py-2 bg-card rounded-lg border">
                        <option value="">All Genres</option>
                        {genres.map((g) => <option key={g}>{g}</option>)}
                    </select>

                    <select value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)} className="px-4 py-2 bg-card rounded-lg border">
                        <option value="">All Qualities</option>
                        {qualities.map((q) => <option key={q}>{q}</option>)}
                    </select>

                    <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="px-4 py-2 bg-card rounded-lg border">
                        <option value="">All Years</option>
                        {years.map((y) => <option key={y}>{y}</option>)}
                    </select>

                    <button
                        onClick={() => {
                            setSearchQuery("")
                            setFilterGenre("")
                            setFilterQuality("")
                            setFilterYear("")
                        }}
                        className="px-4 py-2 bg-accent text-white rounded-lg"
                    >
                        Clear Filters
                    </button>
                </div>

                <p className="text-muted-foreground mb-8">
                    Found {filteredMovies.length} result(s)
                </p>

                {/* Results grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {visibleMovies.map((movie) => (
                        // <MovieCard
                        //     id={""}
                        //     key={movie.movie_id}
                        //     {...movie}
                        //     // isFavorite={true}
                        //     // onRemoveFavorite={() => { }}
                        // />
                        <Link
                            href={`/movie/${slugify(movie.title)}`}
                            onClick={() =>
                                sessionStorage.setItem("selectedMovie", JSON.stringify(movie))
                            }
                        >
                            {/* <Link key={movie.movie_id} href={`/movie/${movie.movie_id}`}> */}
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
                                <div className="absolute top-2 right-2 bg-accent text-xs text-white px-2 py-1 rounded">
                                    {movie.quality}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Infinite scroll trigger */}
                <div ref={observerRef} className="h-10 mt-10">
                    {loadingMore && (
                        <p className="text-center text-muted-foreground">Loading more...</p>
                    )}
                </div>
            </main>
        </div>
    )
}
