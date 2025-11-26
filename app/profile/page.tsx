"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Link from "next/link"
import { LogOut, Heart, Clock, Download } from "lucide-react"
import Header from "@/components/header"
import ProtectedRoute from "@/components/protected-route"
import MovieCard from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { fetchMovies, type Movie } from "@/lib/movie-service"

const ALL_MOVIES = [
  {
    id: 1,
    title: "Frankenstein",
    year: 2025,
    duration: "180m",
    quality: "HDRip",
    genre: "Horror, Sci-Fi",
    image: "/frankenstein.jpg",
  },
  {
    id: 2,
    title: "One Battle After Another",
    year: 2025,
    duration: "182m",
    quality: "HDRip",
    genre: "Action, Crime, Thriller",
    image: "/action-movie.png",
  },
  {
    id: 3,
    title: "A Legend",
    year: 2024,
    duration: "129m",
    quality: "HDRip",
    genre: "Action, Drama",
    image: "/legend-movie.jpg",
  },
  {
    id: 4,
    title: "Operation Blood Hunt",
    year: 2024,
    duration: "94m",
    quality: "HDRip",
    genre: "Action, Thriller",
    image: "/operation-blood.jpg",
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("favorites")
  const [favorites, setFavorites] = useState<string[]>([])
  const [watchHistory, setWatchHistory] = useState<any[]>([])
  const [downloads, setDownloads] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [allMovies, setAllMovies] = useState<Movie[]>([])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        })
        // Load user's saved data from localStorage
        const savedFavorites = localStorage.getItem(`favorites_${firebaseUser.uid}`)
        const savedHistory = localStorage.getItem(`history_${firebaseUser.uid}`)
        const savedDownloads = localStorage.getItem(`downloads_${firebaseUser.uid}`)

        if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
        if (savedHistory) setWatchHistory(JSON.parse(savedHistory))
        if (savedDownloads) setDownloads(JSON.parse(savedDownloads))
      } else {
        router.push("/login")
      }
      setLoading(false)
    })

    // Fetch all movies for display
    const loadMovies = async () => {
      try {
        const movies = await fetchMovies()
        setAllMovies(movies)
      } catch (err) {
        console.error("Error loading movies:", err)
      }
    }

    loadMovies()
    return unsubscribe
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("currentUser")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleRemoveFavorite = (id: string) => {
    const newFavorites = favorites.filter((fav) => fav !== id)
    setFavorites(newFavorites)
    if (user) {
      localStorage.setItem(`favorites_${user.uid}`, JSON.stringify(newFavorites))
    }
  }

  const handleRemoveFromHistory = (id: number) => {
    setWatchHistory(watchHistory.filter((item) => item.id !== id))
  }

  const handleRemoveDownload = (id: string) => {
    const newDownloads = downloads.filter((dl) => dl !== id)
    setDownloads(newDownloads)
    if (user) {
      localStorage.setItem(`downloads_${user.uid}`, JSON.stringify(newDownloads))
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )

  if (!user) return null

  const favoritesMovies =
    allMovies.length > 0
      ? allMovies.filter((m) => favorites.includes(m.movie_id))
      : ALL_MOVIES.filter((m) => favorites.includes(m.id.toString()))

  const downloadsMovies =
    allMovies.length > 0
      ? allMovies.filter((m) => downloads.includes(m.movie_id))
      : ALL_MOVIES.filter((m) => downloads.includes(m.id.toString()))

  const historyMovies = ALL_MOVIES.filter((m) => watchHistory.some((h) => h.id === m.id))

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-12">
          {/* Profile Header */}
          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="flex gap-2 bg-transparent">
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Favorites</p>
                <p className="text-2xl font-bold text-accent">{favorites.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Watch History</p>
                <p className="text-2xl font-bold text-accent">{watchHistory.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-1">Downloads</p>
                <p className="text-2xl font-bold text-accent">{downloads.length}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveTab("favorites")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "favorites"
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart size={18} />
              Favorites ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "history"
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock size={18} />
              Watch History ({watchHistory.length})
            </button>
            <button
              onClick={() => setActiveTab("downloads")}
              className={`pb-4 px-2 font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                activeTab === "downloads"
                  ? "border-b-2 border-accent text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Download size={18} />
              Downloads ({downloads.length})
            </button>
          </div>

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div>
              {favoritesMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {favoritesMovies.map((movie: any) => (
                    <div key={movie.movie_id || movie.id}>
                      <MovieCard
                        id={Number.parseInt(movie.movie_id) || movie.id}
                        title={movie.title}
                        year={Number.parseInt(movie.year) || movie.year}
                        duration={movie.duration}
                        quality={movie.quality}
                        genre={movie.genre?.[0] || movie.genre || ""}
                        image={movie.image}
                        isFavorite={true}
                        onRemoveFavorite={() => handleRemoveFavorite(movie.movie_id || movie.id.toString())}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Heart size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No favorites yet. Start adding your favorite movies!</p>
                </div>
              )}
            </div>
          )}

          {/* Watch History Tab */}
          {activeTab === "history" && (
            <div>
              {watchHistory.length > 0 ? (
                <div className="space-y-4">
                  {watchHistory.map((item) => {
                    const movie = ALL_MOVIES.find((m) => m.id === item.id)
                    return (
                      <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
                        <Link href={`/movie/${item.id}`} className="flex-shrink-0">
                          <img
                            src={movie?.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-20 h-32 object-cover rounded"
                          />
                        </Link>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{item.progress}% watched</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromHistory(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Clock size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No watch history yet</p>
                </div>
              )}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === "downloads" && (
            <div>
              {downloadsMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {downloadsMovies.map((movie: any) => (
                    <div key={movie.movie_id || movie.id} className="relative">
                      <MovieCard
                        id={Number.parseInt(movie.movie_id) || movie.id}
                        title={movie.title}
                        year={Number.parseInt(movie.year) || movie.year}
                        duration={movie.duration}
                        quality={movie.quality}
                        genre={movie.genre?.[0] || movie.genre || ""}
                        image={movie.image}
                        isDownloaded={true}
                        onDownload={() => handleRemoveDownload(movie.movie_id || movie.id.toString())}
                      />
                      <div className="absolute bottom-2 left-2 bg-accent/80 text-accent-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Download size={12} />
                        Downloaded
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <Download size={48} className="text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No downloads yet</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
