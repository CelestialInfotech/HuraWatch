// "use client"

// import { useState, useEffect, use } from "react"
// import { useSearchParams } from "next/navigation"
// import Header from "@/components/header"
// import ProtectedRoute from "@/components/protected-route"
// import { Play, Heart, Download, ThumbsUp, ThumbsDown } from "lucide-react"
// import Link from "next/link"
// import { useRouter } from "next/navigation";
// import { fetchShows, TvShow } from "@/lib/show-service"

// export interface SeasonData {
//   id: string
//   title: string
// }

// export interface EpisodesData {
//   title: string
//   ep: string
//   id: string
// }

// export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
//   const { id } = use(params);
//   const searchParams = useSearchParams()

//   const movieData = searchParams.get("data") ? JSON.parse(decodeURIComponent(searchParams.get("data") || "")) : null

//   const [movie, setMovie] = useState<TvShow | null>(movieData || null)
//   const [allMovies, setAllMovies] = useState<TvShow[]>([])
//   const [allSeasons, setAllSeasons] = useState<SeasonData[]>([])
//   const [allEpisodes, setAllEpisodes] = useState<EpisodesData[]>([])
//   const [loading, setLoading] = useState(!movieData) // Only load if no movie data passed
//   const [isFavorite, setIsFavorite] = useState(false)
//   const [likes, setLikes] = useState(0)
//   const [dislikes, setDislikes] = useState(0)
//   const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null)
//   const [comments, setComments] = useState(0)
//   const [error, setError] = useState("")
//   const router = useRouter();

//   // useEffect(() => {
//   //   const loadMovie = async () => {

//   //     try {
//   //       setLoading(true)
//   //       const movies = await fetchShows()
//   //       setAllMovies(movies)

//   //       let foundMovie = movieData
//   //       if (!foundMovie) {
//   //         foundMovie = movies.find((m) => m.movie_id === id)
//   //       }

//   //       if (foundMovie) {
//   //         setMovie(foundMovie)
//   //         setLikes(foundMovie?.like || 0)
//   //         setDislikes(foundMovie?.dislike || 0)
//   //         const user = localStorage.getItem("currentUser")
//   //         if (user) {
//   //           const userData = JSON.parse(user)
//   //           const favorites = localStorage.getItem(`favorites_${userData.uid}`)
//   //           if (favorites) {
//   //             const favList = JSON.parse(favorites)
//   //             setIsFavorite(favList.includes(id))
//   //           }
//   //         }
//   //         // Set random likes/dislikes for demo

//   //         setComments(Math.floor(Math.random() * 200) + 10)
//   //       } else {
//   //         setError("Movie not found")
//   //       }
//   //     } catch (err) {
//   //       console.error("Error loading movie:", err)
//   //       setError("Failed to load movie details")
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   //   if (!movieData) {
//   //     loadMovie()
//   //   }
//   // }, [id, movieData])

//   // const handleAddToFavorites = () => {
//   //   console.log("Loading movie:", movieData);

//   //   const user = localStorage.getItem("currentUser")
//   //   if (user) {
//   //     const userData = JSON.parse(user)
//   //     const favorites = localStorage.getItem(`favorites_${userData.uid}`)
//   //     let favList = favorites ? JSON.parse(favorites) : []

//   //     if (isFavorite) {
//   //       favList = favList.filter((id: string) => id !== id)
//   //     } else {
//   //       favList.push(id)
//   //     }

//   //     localStorage.setItem(`favorites_${userData.uid}`, JSON.stringify(favList))
//   //     setIsFavorite(!isFavorite)
//   //   }
//   // }

//   // const handleLike = (like: number) => {
//   //   if (userRating === "like") {
//   //     setLikes(like - 1)
//   //     setUserRating(null)
//   //   } else {
//   //     if (userRating === "dislike") {
//   //       setDislikes(dislikes - 1)
//   //     }
//   //     setLikes(like + 1)
//   //     setUserRating("like")
//   //   }
//   // }

//   // const handleDislike = () => {
//   //   if (userRating === "dislike") {
//   //     setDislikes(dislikes - 1)
//   //     setUserRating(null)
//   //   } else {
//   //     if (userRating === "like") {
//   //       setLikes(likes - 1)
//   //     }
//   //     setDislikes(dislikes + 1)
//   //     setUserRating("dislike")
//   //   }
//   // }

//   // const relatedMovies = allMovies
//   //   .filter((m) => m.genre?.some((g) => movie?.genre?.includes(g)) && m.movie_id !== movie?.movie_id)
//   //   .slice(0, 6)


//   const handleLike = (like: number) => {
//     if (userRating === "like") {
//       setLikes(like - 1)
//       setUserRating(null)
//     } else {
//       if (userRating === "dislike") {
//         setDislikes(dislikes - 1)
//       }
//       setLikes(like + 1)
//       setUserRating("like")
//     }
//   }

//   const handleDislike = () => {
//     if (userRating === "dislike") {
//       setDislikes(dislikes - 1)
//       setUserRating(null)
//     } else {
//       if (userRating === "like") {
//         setLikes(likes - 1)
//       }
//       setDislikes(dislikes + 1)
//       setUserRating("dislike")
//     }
//   }

//   const relatedMovies = allMovies
//     .filter((m) => m.genre?.some((g) => movie?.genre?.includes(g)) && m.movie_id !== movie?.movie_id)
//     .slice(0, 6)


//   useEffect(() => {
//     const data = sessionStorage.getItem("selectedMovie");
//     if (data) {
//       setMovie(JSON.parse(data));

//     }
//   }, []);

//   useEffect(() => {
//     const loadMovie = async () => {
//       if (!movie) return;

//       setLoading(true);

//       // 1. Fetch seasons
//       const res = await fetch(`/api/season?id=${movie.movie_id}`);
//       const data = await res.json();

//       setAllSeasons(data.seasons);
//       console.log("Season Response ::::::::: ", data.seasons);

//       if (!data.seasons || data.seasons.length === 0) {
//         console.log("No seasons available");
//         setLoading(false);
//         return;
//       }

//       // ------------------------------------------------------
//       // 🔥 Correct: Convert "SS1" → "Season 1"
//       // Convert "SS1" → "Season 1"
//       // 🔥 get season number correctly
//       const seasonNumber = movie.season.replace("SS", "").trim();  // "2"

//       // 🔥 build correct season title
//       const seasonTitle = `Season ${seasonNumber}`;

//       console.log("Looking for season title:", seasonTitle);

//       // 🔥 find matching season
//       const selectedSeason = data.seasons.find(
//         (s: any) => s.title.trim().toLowerCase() === seasonTitle.toLowerCase()
//       );

//       console.log("selectedSeason ::::::::::: ", selectedSeason);


//       // 🔥 Select matched season or fallback to first season
//       const selectedSeasonId = selectedSeason
//         ? selectedSeason.id
//         : data.seasons[0].id;

//       console.log("Selected Season ID →", selectedSeasonId);

//       // 3. Fetch episodes of selected season
//       const epRes = await fetch(`/api/episodes?id=${selectedSeasonId}`);
//       const epData = await epRes.json();

//       setAllEpisodes(epData.episodes);
//       console.log("Episodes Response ::::::::: ", epData.episodes);

//       setLoading(false);
//     };

//     loadMovie();
//   }, [movie]);




//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-black">
//         <Header />

//         {!movie ? (
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
//               <p className="text-gray-400">Loading movie details...</p>
//             </div>
//           </div>
//         ) : error ? (
//           <div className="bg-red-900/20 text-red-400 p-4 rounded-lg m-4">{error}</div>
//         ) : movie ? (
//           <main className="relative">
//             <div
//               className="relative w-full h-screen md:h-screen/2 overflow-hidden"
//               style={{
//                 backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url(${movie.dimage || movie.image})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//               }}
//             >
//               <div className="absolute inset-0 flex flex-col items-center justify-between p-6 md:p-8">
//                 {/* Breadcrumb */}
//                 <div className="w-full flex gap-2 text-sm text-gray-400 mb-auto pt-20">
//                   <Link href="/" className="hover:text-accent">
//                     Home
//                   </Link>
//                   <span>/</span>
//                   <Link href="/tv-shows" className="hover:text-accent">
//                     Tv Show
//                   </Link>
//                   <span>/</span>
//                   <span className="text-white">{movie.title}</span>
//                 </div>

//                 {/* Play Button */}
//                 <button onClick={() => router.push(`/player?movieId=${movie.movie_id}`)}

//                   className="w-20 h-20 rounded-full bg-white/30 hover:bg-accent/50 backdrop-blur flex items-center justify-center transition-all group">
//                   <Play size={40} className="text-white fill-white ml-1" />
//                 </button>

//                 {/* Movie Title in Hero */}
//                 <div className="text-4xl md:text-6xl font-bold text-white opacity-30 text-center mb-auto pb-20">
//                   {movie.title}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-black px-6 md:px-12 py-8 border-b border-gray-800">
//               <p className="text-gray-400 text-center mb-6">
//                 If current server doesn't work please try other servers below.
//               </p>
//               <div className="flex flex-wrap gap-4 justify-center">
//                 {["UpCloud", "AKCloud", "MegaCloud"].map((server) => (
//                   <button
//                     key={server}
//                     className="flex items-center gap-2 px-6 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded transition-colors text-gray-300"
//                   >
//                     <Play size={18} />
//                     Server {server}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>

//               <h1 className="text-3xl font-bold text-white opacity-30  mb-auto pt-10">
//                 Season {movie.season.split("SS")}
//               </h1>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 {allEpisodes.map((epi) => (
//                   <div key={epi.id} className="w-full">
//                     <button onClick={() => router.push(`/player?episodeId=${epi.id}`)}>{epi.title}</button>
//                     {/* <img
//                       src={epi.image || "/placeholder.svg"}
//                       alt={epi.title}
//                       className="w-full rounded-lg shadow-2xl mb-6 object-cover aspect-[2/3]"
//                     /> */}
//                   </div>
//                 ))}
//               </div>

//             </div>



//             <div className="container mx-auto px-4 md:px-8 py-12">
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//                 {/* Poster and Buttons */}
//                 <div className="md:col-span-1">
//                   <img
//                     src={movie.image || "/placeholder.svg"}
//                     alt={movie.title}
//                     className="w-full rounded-lg shadow-2xl mb-6 object-cover aspect-[2/3]"
//                   />
//                   <div className="flex flex-col gap-3">
//                     <button className="w-full bg-green-600 hover:bg-green-800 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors">
//                       <Play size={20} />
//                       Watch Now
//                     </button>
//                     {/* <button
//                       onClick={handleAddToFavorites}
//                       className={`w-full py-2 rounded border transition-colors flex items-center justify-center gap-2 ${isFavorite
//                         ? "bg-red-900/30 border-red-500 text-red-400"
//                         : "border-gray-600 text-gray-300 hover:border-gray-400"
//                         }`}
//                     >
//                       <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
//                       {isFavorite ? "Favorited" : "Add Favorite"}
//                     </button> */}

//                   </div>
//                 </div>

//                 {/* Movie Details and Description */}
//                 <div className="md:col-span-2 space-y-6">
//                   <div>
//                     <div className="flex items-start gap-4">
//                       <div>
//                         <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
//                         <div className="flex items-center gap-4">
//                           <div className="flex items-center gap-2">
//                             <span className="text-yellow-400 text-lg">★</span>
//                             <span className="text-white font-semibold">{movie.score}</span>
//                             <span className="text-gray-500 text-sm">/180</span>
//                           </div>
//                           <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
//                             {movie.quality}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Like/Dislike Buttons */}
//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => handleLike(movie?.like)}
//                       className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "like"
//                         ? "bg-green-600 text-white"
//                         : "bg-gray-800 text-gray-300 hover:bg-gray-700"
//                         }`}
//                     >
//                       <ThumbsUp size={18} />
//                       Like {likes > 0 && `(${likes})`}
//                     </button>
//                     <button
//                       onClick={handleDislike}
//                       className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "dislike"
//                         ? "bg-gray-600 text-white"
//                         : "bg-gray-800 text-gray-300 hover:bg-gray-700"
//                         }`}
//                     >
//                       <ThumbsDown size={18} />
//                       Dislike {dislikes > 0 && `(${dislikes})`}
//                     </button>
//                   </div>

//                   {/* Description */}
//                   <div>
//                     <p className="text-gray-300 leading-relaxed">{movie.description}</p>
//                   </div>

//                   {/* Movie Info Grid */}
//                   <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-800">
//                     {movie.country && movie.country.length > 0 && (
//                       <div>
//                         <p className="text-gray-500 text-sm">Country:</p>
//                         <p className="text-gray-300">{movie.country.join(", ")}</p>
//                       </div>
//                     )}

//                     {movie.genre && movie.genre.length > 0 && (
//                       <div>
//                         <p className="text-gray-500 text-sm">Genre:</p>
//                         <p className="text-gray-300">{movie.genre.join(", ")}</p>
//                       </div>
//                     )}

//                     {movie.released && (
//                       <div>
//                         <p className="text-gray-500 text-sm">Released:</p>
//                         <p className="text-gray-300">{movie.released}</p>
//                       </div>
//                     )}

//                     {movie.duration && (
//                       <div>
//                         <p className="text-gray-500 text-sm">Duration:</p>
//                         <p className="text-gray-300">{movie.duration}</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Production Info */}
//                   {movie.production && movie.production.length > 0 && (
//                     <div className="pt-4 border-t border-gray-800">
//                       <p className="text-gray-500 text-sm mb-2">Production:</p>
//                       <p className="text-gray-300">{movie.production.join(", ")}</p>
//                     </div>
//                   )}

//                   {/* Cast */}
//                   {movie.casts && movie.casts.length > 0 && (
//                     <div className="pt-4 border-t border-gray-800">
//                       <p className="text-gray-500 text-sm mb-2">Casts:</p>
//                       <p className="text-gray-300">{movie.casts.join(", ")}</p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="md:col-span-1">
//                   <h3 className="text-xl font-bold text-white mb-6">You May Also Like</h3>
//                   <div className="space-y-4">
//                     {relatedMovies.slice(0, 3).map((m) => (
//                       <Link key={m.movie_id} href={`/show/${m.movie_id}`}>
//                         <div className="group cursor-pointer mt-6">
//                           <div className="aspect-video rounded overflow-hidden mb-2">
//                             <img
//                               src={m.image || "/placeholder.svg"}
//                               alt={m.title}
//                               className="w-full h-full object-cover group-hover:scale-105 transition-transform"
//                             />
//                           </div>
//                           <h4 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">
//                             {m.title}
//                           </h4>
//                           <p className="text-xs text-gray-500">
//                             {m.season} • {m.episode}
//                           </p>
//                         </div>
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//           </main>
//         ) : null}
//       </div>
//     </ProtectedRoute>
//   )
// }



"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"
import { Play, Heart, Download, ThumbsUp, ThumbsDown } from "lucide-react"
import Link from "next/link"
import { fetchShows, TvShow } from "@/lib/show-service"

export interface SeasonData {
  id: string
  title: string
}

export interface EpisodesData {
  title: string
  ep: string
  id: string
  image?: string
}

interface OptionalTvShow extends Partial<TvShow> {
  movie_id?: string
}

export default function MoviePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // read movie id or encoded movie data from querystring (robust)
  const routeId =
    searchParams?.get("id") ||
    searchParams?.get("movieId") ||
    searchParams?.get("episodeId")
  const encodedData = searchParams?.get("data")

  const initialMovieFromQuery = (() => {
    if (!encodedData) return null
    try {
      return JSON.parse(decodeURIComponent(encodedData)) as TvShow
    } catch {
      return null
    }
  })()

  // STATES
  const [movie, setMovie] = useState<TvShow | null>(initialMovieFromQuery || null)
  const [allMovies, setAllMovies] = useState<TvShow[]>([])
  const [allSeasons, setAllSeasons] = useState<SeasonData[]>([])
  const [allEpisodes, setAllEpisodes] = useState<EpisodesData[]>([])
  const [loading, setLoading] = useState(!initialMovieFromQuery) // only show loader if not passing data
  const [isFavorite, setIsFavorite] = useState(false)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null)
  const [comments, setComments] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<SeasonData | null>(null);

  // refs
  const abortRef = useRef<AbortController | null>(null)
  const mountedRef = useRef(true)

  // simple in-memory cache (only lasts page load)
  const seasonsCache = useRef<Record<string, SeasonData[]>>({})
  const episodesCache = useRef<Record<string, EpisodesData[]>>({})

  // ---------- Helper utilities ----------
  const parseSeasonNumber = (seasonRaw?: string) => {
    if (!seasonRaw) return null
    // allow "SS1", "S1", "Season 1", "1"
    const s = seasonRaw.replace(/\s+/g, "").toLowerCase() // "ss1"
    const match = s.match(/(\d+)/)
    return match ? match[1] : null
  }

  const safeSetMovieFromSession = () => {
    try {
      const data = sessionStorage.getItem("selectedMovie")
      if (data) {
        const parsed = JSON.parse(data)
        setMovie(parsed)
      }
    } catch (err) {
      console.warn("Failed to read selectedMovie from sessionStorage", err)
    }
  }

  // ---------- initialize movie (from query/session) ----------
  useEffect(() => {
    // keep mounted ref
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      // abort any inflight request when unmounting
      if (abortRef.current) abortRef.current.abort()
    }
  }, [])

  useEffect(() => {
    // If we already have movie (from encodedData), don't override.
    if (movie) return

    // 1) try encoded query (handled above)
    // 2) try sessionStorage
    // 3) fallback: if a routeId is present, try fetchShows to find it

    safeSetMovieFromSession()

    if (!movie && !initialMovieFromQuery && routeId) {
      // load shows list in background to find the movie by id (non-blocking)
      const loadShowsFindMovie = async () => {
        try {
          setLoading(true)
          const shows = await fetchShows()
          if (!mountedRef.current) return
          setAllMovies(shows)
          const found = shows.find((s) => s.movie_id === routeId)
          if (found) {
            setMovie(found)
            // store to session so subsequent mount is faster
            try {
              sessionStorage.setItem("selectedMovie", JSON.stringify(found))
            } catch { }
          } else {
            // If not found, clear loader and set error
            setError("Movie not found.")
          }
        } catch (err) {
          console.error("Error fetching shows:", err)
          if (mountedRef.current) setError("Failed to load movie data.")
        } finally {
          if (mountedRef.current) setLoading(false)
        }
      }
      loadShowsFindMovie()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId])

  // ---------- Load seasons + episodes when movie is available ----------
  useEffect(() => {
    if (!movie) return

    // Prevent duplicate loads if movie hasn't changed
    let active = true
    const controller = new AbortController()
    abortRef.current = controller

    const loadSeasonsAndEpisodes = async () => {
      setLoading(true)
      setError(null)

      try {
        const movieId = movie.movie_id || (movie as OptionalTvShow).movie_id
        if (!movieId) {
          setError("Movie id missing.")
          setLoading(false)
          return
        }

        // 1) Fetch seasons (try sessionStorage cache -> in-memory cache -> network)
        const seasonsKey = `seasons_${movieId}`

        let seasons: SeasonData[] | undefined =
          seasonsCache.current[seasonsKey] ||
          (() => {
            try {
              const fromSession = sessionStorage.getItem(seasonsKey)
              return fromSession ? JSON.parse(fromSession) : undefined
            } catch {
              return undefined
            }
          })()

        if (!seasons) {
          const res = await fetch(`/api/season?id=${movieId}`, {
            signal: controller.signal,
          })
          if (!res.ok) throw new Error(`Seasons fetch failed: ${res.status}`)
          const data = await res.json()
          seasons = data?.seasons || []
          // seasonsCache.current[seasonsKey] = seasons
          try {
            sessionStorage.setItem(seasonsKey, JSON.stringify(seasons))
          } catch { }
        }

        if (!active) return
        setAllSeasons(seasons ?? [])

        if (!seasons || seasons.length === 0) {
          setAllEpisodes([])
          setLoading(false)
          return
        }

        // Determine which season id to fetch
        const seasonNumber = parseSeasonNumber(movie.season) // ex: "1"
        let selectedSeason =
          seasonNumber &&
          seasons.find(
            (s) =>
              s.title &&
              s.title.trim().toLowerCase() === `season ${seasonNumber}`.toLowerCase()
          )

        if (!selectedSeason) {
          // try to find number within title (eg: "SS1", "S01" etc)
          selectedSeason =
            seasons.find((s) => {
              const m = s.title.match(/(\d+)/)
              return m && seasonNumber && m[1] === seasonNumber
            }) || seasons[0]
        }

        const selectedSeasonId = selectedSeason.id

        // 2) Fetch episodes (use caching similar to seasons)
        const episodesKey = `episodes_${selectedSeasonId}`

        let episodes: EpisodesData[] | undefined =
          episodesCache.current[episodesKey] ||
          (() => {
            try {
              const fromSession = sessionStorage.getItem(episodesKey)
              return fromSession ? JSON.parse(fromSession) : undefined
            } catch {
              return undefined
            }
          })()

        if (!episodes) {
          const epRes = await fetch(`/api/episodes?id=${selectedSeasonId}`, {
            signal: controller.signal,
          })
          if (!epRes.ok) throw new Error(`Episodes fetch failed: ${epRes.status}`)
          const epData = await epRes.json()
          episodes = epData?.episodes || []
          // episodesCache.current[episodesKey] = episodes
          try {
            sessionStorage.setItem(episodesKey, JSON.stringify(episodes))
          } catch { }
        }

        if (!active) return
        setAllEpisodes(episodes ?? [])
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // aborted; ignore
        } else {
          console.error("Error loading seasons/episodes:", err)
          if (mountedRef.current) setError("Failed to load season/episode data.")
        }
      } finally {
        if (mountedRef.current) setLoading(false)
      }
    }

    loadSeasonsAndEpisodes()

    return () => {
      active = false
      controller.abort()
    }
  }, [movie])

  // ---------- Load all shows in background to power related movies (non-blocking) ----------
  useEffect(() => {
    let cancelled = false
    const loadAllShows = async () => {
      try {
        if (allMovies.length === 0) {
          const shows = await fetchShows()
          if (cancelled) return
          setAllMovies(shows)
        }
      } catch (err) {
        console.warn("Failed to load all shows for related list.", err)
      }
    }
    loadAllShows()
    return () => {
      cancelled = true
    }
  }, [])

  // ---------- Likes / Dislikes logic ----------
  useEffect(() => {
    if (!movie) return
    setLikes(movie.like || 0)
    setDislikes(movie.dislike || 0)
    setComments(Math.floor(Math.random() * 200) + 10)

    // restore user's rating from localStorage if present
    try {
      const user = localStorage.getItem("currentUser")
      if (user) {
        const userData = JSON.parse(user)
        const ratingKey = `rating_${userData.uid}_${movie.movie_id}`
        const stored = localStorage.getItem(ratingKey)
        if (stored === "like" || stored === "dislike") setUserRating(stored)
      }
    } catch { }
  }, [movie])

  const handleLike = (likeCount: number) => {
    if (userRating === "like") {
      setLikes((prev) => Math.max(prev - 1, 0))
      setUserRating(null)
    } else {
      if (userRating === "dislike") {
        setDislikes((prev) => Math.max(prev - 1, 0))
      }
      setLikes((prev) => prev + 1)
      setUserRating("like")
    }
    // optionally persist per-user rating in localStorage (best-effort)
    try {
      const user = localStorage.getItem("currentUser")
      if (user && movie?.movie_id) {
        const userData = JSON.parse(user)
        const ratingKey = `rating_${userData.uid}_${movie.movie_id}`
        localStorage.setItem(ratingKey, userRating === "like" ? "" : "like")
      }
    } catch { }
  }

  const handleDislike = () => {
    if (userRating === "dislike") {
      setDislikes((prev) => Math.max(prev - 1, 0))
      setUserRating(null)
    } else {
      if (userRating === "like") {
        setLikes((prev) => Math.max(prev - 1, 0))
      }
      setDislikes((prev) => prev + 1)
      setUserRating("dislike")
    }
    try {
      const user = localStorage.getItem("currentUser")
      if (user && movie?.movie_id) {
        const userData = JSON.parse(user)
        const ratingKey = `rating_${userData.uid}_${movie.movie_id}`
        localStorage.setItem(ratingKey, userRating === "dislike" ? "" : "dislike")
      }
    } catch { }
  }

  // Related movies (same genre, excluding current)
  const relatedMovies = allMovies
    .filter((m) => {
      if (!movie?.genre || !m.genre) return false
      const shared = m.genre.some((g) => movie.genre?.includes(g))
      return shared && m.movie_id !== movie?.movie_id
    })
    .slice(0, 6)

  // Favorite toggle (client-only)
  const handleAddToFavorites = () => {
    try {
      const user = localStorage.getItem("currentUser")
      if (user && movie?.movie_id) {
        const userData = JSON.parse(user)
        const favKey = `favorites_${userData.uid}`
        const favorites = localStorage.getItem(favKey)
        let favList: string[] = favorites ? JSON.parse(favorites) : []
        if (favList.includes(movie.movie_id)) {
          favList = favList.filter((id) => id !== movie.movie_id)
          setIsFavorite(false)
        } else {
          favList.push(movie.movie_id)
          setIsFavorite(true)
        }
        localStorage.setItem(favKey, JSON.stringify(favList))
      } else {
        // not logged in — push to login or show message
        router.push("/login")
      }
    } catch (err) {
      console.warn("Favorites error", err)
    }
  }

  // Render helpers
  const seasonHeading = () => {
    const sn = parseSeasonNumber(movie?.season)
    return sn ? `Season ${sn}` : movie?.season || "Season"
  }

  const handleSeasonSelect = async (season: SeasonData) => {
    setShowSeasonDropdown(false);
    setSelectedSeason(season);
    setLoading(true);

    try {
      const res = await fetch(`/api/episodes?id=${season.id}`);
      const data = await res.json();

      setAllEpisodes(Array.isArray(data?.episodes) ? data.episodes : []);
    } catch (err) {
      console.error("Error loading episodes:", err);
      setAllEpisodes([]);
    } finally {
      setLoading(false);
    }
  };


  // ---------- JSX ----------
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black">
        <Header />

        {(!movie && loading) ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
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
                <div className="w-full flex gap-2 text-sm text-gray-400 mb-auto pt-20">
                  <Link href="/" className="hover:text-accent">Home</Link>
                  <span>/</span>
                  <Link href="/tv-shows" className="hover:text-accent">Tv Show</Link>
                  <span>/</span>
                  <span className="text-white">{movie.title}</span>
                </div>

                <button
                  onClick={() => router.push(`/player?movieId=${movie.movie_id}`)}
                  className="w-20 h-20 rounded-full bg-white/30 hover:bg-accent/50 backdrop-blur flex items-center justify-center transition-all group"
                >
                  <Play size={40} className="text-white fill-white ml-1" />
                </button>

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

            <div className="px-6 md:px-12 py-8">
              <div className="relative inline-block mb-6 pt-4">
                <button
                  onClick={() => setShowSeasonDropdown((prev) => !prev)}
                  className="flex items-center gap-2 text-3xl font-bold text-white opacity-80"
                >
                  {selectedSeason?.title || seasonHeading()}
                  <svg
                    className={`w-6 h-6 transition-transform ${showSeasonDropdown ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showSeasonDropdown && (
                  <div className="absolute z-20 mt-3 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    {allSeasons.map((season) => (
                      <button
                        key={season.id}
                        onClick={() => handleSeasonSelect(season)}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800"
                      >
                        {season.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>


              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
              ) : allEpisodes.length === 0 ? (
                <div className="text-center text-gray-400">No episodes found for this season.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {allEpisodes.map((epi) => (
                    <div key={epi.id} className="w-full">
                      <button
                        onClick={() => router.push(`/player?episodeId=${epi.id}`)}
                        className="w-full text-left"
                      >
                        <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
                          <img
                            src={movie.dimage || "/placeholder.svg?height=400&width=250&query=movie poster"}
                            alt={epi.title}
                            className="w-full h-full object-fit group-hover:scale-105 opacity-30 transition-transform duration-300"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                            <button
                              onClick={() => router.push(`/player?movieId=${movie.movie_id}`)}
                              className="w-10 h-10 rounded-full bg-white/30 hover:bg-accent/50 backdrop-blur flex items-center justify-center transition-all group"
                            >
                              <Play size={20} className="text-white fill-white ml-1" />
                            </button>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                            <h3 className="text-sm font-semibold text-white line-clamp-2">{epi.title}</h3>
                            <div className="flex items-center gap-2">

                              {/* <p>
                                {movie.season}
                              </p>
                              <p>
                                •
                              </p>
                              <p>
                                Episode {epi.ep.split("Eps")}
                              </p> */}
                            </div>


                          </div>
                          <div className="absolute top-2 right-2 bg-accent text-white text-xs px-2 py-1 rounded">
                            {movie.quality}
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="container mx-auto px-4 md:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-2xl mb-6 object-cover aspect-[2/3]" />
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => router.push(`/player?movieId=${movie.movie_id}`)}
                      className="w-full bg-green-600 hover:bg-green-800 text-white font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <Play size={20} />
                      Watch Now
                    </button>

                    <button
                      onClick={handleAddToFavorites}
                      className={`w-full py-2 rounded border transition-colors flex items-center justify-center gap-2 ${isFavorite ? "bg-red-900/30 border-red-500 text-red-400" : "border-gray-600 text-gray-300 hover:border-gray-400"}`}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                      {isFavorite ? "Favorited" : "Add Favorite"}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div>
                    <div className="flex items-start gap-4">
                      <div>
                        <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-lg">★</span>
                            <span className="text-white font-semibold">{movie.score ?? "-"}</span>
                            <span className="text-gray-500 text-sm">/180</span>
                          </div>
                          <span className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                            {movie.quality ?? "HD"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleLike(likes)}
                      className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "like" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                    >
                      <ThumbsUp size={18} />
                      Like {likes > 0 && `(${likes})`}
                    </button>
                    <button
                      onClick={handleDislike}
                      className={`flex items-center gap-2 px-6 py-2 rounded transition-colors ${userRating === "dislike" ? "bg-gray-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}
                    >
                      <ThumbsDown size={18} />
                      Dislike {dislikes > 0 && `(${dislikes})`}
                    </button>
                  </div>

                  <div>
                    <p className="text-gray-300 leading-relaxed">{movie.description}</p>
                  </div>

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

                  {movie.production && movie.production.length > 0 && (
                    <div className="pt-4 border-t border-gray-800">
                      <p className="text-gray-500 text-sm mb-2">Production:</p>
                      <p className="text-gray-300">{movie.production.join(", ")}</p>
                    </div>
                  )}

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
                      <Link key={m.movie_id} href={`/show/${m.movie_id}`}>
                        <div className="group cursor-pointer mt-6">
                          <div className="aspect-video rounded overflow-hidden mb-2">
                            <img src={m.image || "/placeholder.svg"} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          </div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">{m.title}</h4>
                          <p className="text-xs text-gray-500">{m.season} • {m.episode}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-gray-400">No movie selected.</p>
          </div>
        )}
      </div>
    </ProtectedRoute >
  )
}
