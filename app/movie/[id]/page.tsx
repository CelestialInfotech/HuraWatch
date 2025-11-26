"use client"

import { useState, useEffect, use } from "react"
import { useSearchParams } from "next/navigation"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"
import { Play, Heart, Download, ThumbsUp, ThumbsDown } from "lucide-react"
import { fetchMovies, type Movie } from "@/lib/movie-service"
import Link from "next/link"
import { useRouter } from "next/navigation";

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams()

  const movieData = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data") || "")) : null

  const [movie, setMovie] = useState<Movie | null>(movieData || null)
  const [allMovies, setAllMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(!movieData) // Only load if no movie data passed
  const [isFavorite, setIsFavorite] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null)
  const [comments, setComments] = useState(0)
  const [error, setError] = useState("")
  const router = useRouter();


  // useEffect(() => {
  //   const loadMovie = async () => {

  //     try {
  //       setLoading(true)
  //       const movies = await fetchMovies()
  //       setAllMovies(movies)

  //       let foundMovie = movieData
  //       if (!foundMovie) {
  //         foundMovie = movies.find((m) => m.movie_id === id)
  //       }

  //       if (foundMovie) {
  //         setMovie(foundMovie)
  //         setLikes(foundMovie?.like || 0)
  //         setDislikes(foundMovie?.dislike || 0)
  //         const user = localStorage.getItem("currentUser")
  //         if (user) {
  //           const userData = JSON.parse(user)
  //           const favorites = localStorage.getItem(`favorites_${userData.uid}`)
  //           if (favorites) {
  //             const favList = JSON.parse(favorites)
  //             setIsFavorite(favList.includes(id))
  //           }
  //         }
  //         // Set random likes/dislikes for demo

  //         setComments(Math.floor(Math.random() * 200) + 10)
  //       } else {
  //         setError("Movie not found")
  //       }
  //     } catch (err) {
  //       console.error("Error loading movie:", err)
  //       setError("Failed to load movie details")
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (!movieData) {
  //     loadMovie()
  //   }
  // }, [id, movieData])

  // const handleAddToFavorites = () => {
  //   console.log("Loading movie:", movieData);

  //   const user = localStorage.getItem("currentUser")
  //   if (user) {
  //     const userData = JSON.parse(user)
  //     const favorites = localStorage.getItem(`favorites_${userData.uid}`)
  //     let favList = favorites ? JSON.parse(favorites) : []

  //     if (isFavorite) {
  //       favList = favList.filter((id: string) => id !== id)
  //     } else {
  //       favList.push(id)
  //     }

  //     localStorage.setItem(`favorites_${userData.uid}`, JSON.stringify(favList))
  //     setIsFavorite(!isFavorite)
  //   }
  // }

  const handleLike = (like: number) => {
    if (userRating === "like") {
      setLikes(like - 1)
      setUserRating(null)
    } else {
      if (userRating === "dislike") {
        setDislikes(dislikes - 1)
      }
      setLikes(like + 1)
      setUserRating("like")
    }
  }

  const handleDislike = () => {
    if (userRating === "dislike") {
      setDislikes(dislikes - 1)
      setUserRating(null)
    } else {
      if (userRating === "like") {
        setLikes(likes - 1)
      }
      setDislikes(dislikes + 1)
      setUserRating("dislike")
    }
  }

  const relatedMovies = allMovies
    .filter((m) => m.genre?.some((g) => movie?.genre?.includes(g)) && m.movie_id !== movie?.movie_id)
    .slice(0, 6)

  // const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("selectedMovie");
    if (data) {
      setMovie(JSON.parse(data));
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Header />

        {!movie ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-gray-400">Loading movie details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg m-4">{error}</div>
        ) : movie ? (
          <main className="relative">
            <div
              className="relative w-full h-screen md:h-screen/2 overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${movie.dimage || movie.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-between p-6 md:p-8">
                {/* Breadcrumb */}
                <div className="w-full flex gap-2 text-sm text-gray-400 mb-auto pt-20">
                  <Link href="/" className="hover:text-accent">
                    Home
                  </Link>
                  <span>/</span>
                  <Link href="/movies" className="hover:text-accent">
                    Movies
                  </Link>
                  <span>/</span>
                  <span className="text-white">{movie.title}</span>
                </div>

                {/* Play Button */}
                <button onClick={() => router.push(`/player?movieId=${movie.movie_id}`)}

                  className="w-20 h-20 rounded-full bg-white/30 hover:bg-accent/50 backdrop-blur flex items-center justify-center transition-all group">
                  <Play size={40} className="text-white fill-white ml-1" />
                </button>

                {/* Movie Title in Hero */}
                <div className="text-4xl md:text-6xl font-bold text-white opacity-30 text-center mb-auto pb-20">
                  {movie.title}
                </div>
              </div>
            </div>

            <div className="bg-black px-6 md:px-12 py-8 border-b border-gray-800">
              <p className="text-gray-400 text-center mb-6">
                If current server doesn't work please try other servers below.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {["UpCloud", "AKCloud", "MegaCloud"].map((server) => (
                  <button
                    key={server}
                    className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded transition-colors text-gray-300"
                  >
                    <Play size={18} />
                    Server {server}
                  </button>
                ))}
              </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Poster and Buttons */}
                <div className="md:col-span-1">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full rounded-lg shadow-2xl mb-6 object-cover aspect-[2/3]"
                  />
                  <div className="flex flex-col gap-3">
                    <button className="w-full bg-green-600 hover:bg-green-800 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors">
                      <Play size={20} />
                      Watch Now
                    </button>
                    {/* <button
                      onClick={handleAddToFavorites}
                      className={`w-full py-2 rounded border transition-colors flex items-center justify-center gap-2 ${isFavorite
                        ? "bg-red-900/30 border-red-500 text-red-400"
                        : "border-gray-600 text-gray-300 hover:border-gray-400"
                        }`}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? "Favorited" : "Add Favorite"}
                    </button> */}

                  </div>
                </div>

                {/* Movie Details and Description */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-start gap-4">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="text-white font-semibold">{movie.score}</span>
                            <span className="text-gray-500 text-sm">/180</span>
                          </div>
                          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                            {movie.quality}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Like/Dislike Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(movie?.like)}
                      className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "like"
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <ThumbsUp size={18} />
                      Like {likes > 0 && `(${likes})`}
                    </button>
                    <button
                      onClick={handleDislike}
                      className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "dislike"
                        ? "bg-gray-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                    >
                      <ThumbsDown size={18} />
                      Dislike {dislikes > 0 && `(${dislikes})`}
                    </button>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                  </div>

                  {/* Movie Info Grid */}
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                    {movie.country && movie.country.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm">Country:</p>
                        <p className="text-gray-300">{movie.country.join(", ")}</p>
                      </div>
                    )}

                    {movie.genre && movie.genre.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm">Genre:</p>
                        <p className="text-gray-300">{movie.genre.join(", ")}</p>
                      </div>
                    )}

                    {movie.released && (
                      <div>
                        <p className="text-gray-500 text-sm">Released:</p>
                        <p className="text-gray-300">{movie.released}</p>
                      </div>
                    )}

                    {movie.duration && (
                      <div>
                        <p className="text-gray-500 text-sm">Duration:</p>
                        <p className="text-gray-300">{movie.duration}</p>
                      </div>
                    )}
                  </div>

                  {/* Production Info */}
                  {movie.production && movie.production.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-sm mb-2">Production:</p>
                      <p className="text-gray-300">{movie.production.join(", ")}</p>
                    </div>
                  )}

                  {/* Cast */}
                  {movie.casts && movie.casts.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-sm mb-2">Casts:</p>
                      <p className="text-gray-300">{movie.casts.join(", ")}</p>
                    </div>
                  )}
                </div>

                <div className="md:col-span-1">
                  <h3 className="text-xl font-bold text-white mb-6">You May Also Like</h3>
                  <div className="space-y-4">
                    {relatedMovies.slice(0, 3).map((m) => (
                      <Link key={m.movie_id} href={`/movie/${m.movie_id}`}>
                        <div className="group cursor-pointer mt-6">
                          <div className="aspect-video rounded overflow-hidden mb-2">
                            <img
                              src={m.image || "/placeholder.svg"}
                              alt={m.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">
                            {m.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {m.year} • {m.duration}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </main>
        ) : null}
      </div>
    </ProtectedRoute>
  )
}
