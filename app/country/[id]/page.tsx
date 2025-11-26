"use client"

import Header from "@/components/header";
import { fetchMovies, Movie } from "@/lib/movie-service";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
    const params = useParams()

    // params.country can be string | string[] | undefined
    String(params.id) // country = params.id
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
    const slugify = (text: string) =>
        text
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-');

    const filteredMovies = allMovies.filter((m) => m.country.includes(decodeURIComponent(params.id as string)))
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl font-bold mb-8">Browse by Country : {decodeURIComponent(params.id as string)}</h1>
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
                                    <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded">
                                        {movie.quality}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
