"use client"

import Link from "next/link"
import { Menu, Search, Download, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0],
        }
        setUser(userData)
        localStorage.setItem("currentUser", JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem("currentUser")
      }
    })

    return unsubscribe
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("currentUser")
      setUser(null)
      setProfileMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-background via-background/80 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-accent shrink-0">
            <span className="text-accent">▶</span>
            <span>HURAWATCH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="/"
              className={`hover:text-accent transition-colors ${isActive("/") ? "text-accent font-semibold" : ""
                }`}
            >
              Home
            </Link>

            <Link
              href="/genre"
              className={`hover:text-accent transition-colors ${isActive("/genre") ? "text-accent font-semibold" : ""
                }`}
            >
              Genre
            </Link>

            <Link
              href="/country"
              className={`hover:text-accent transition-colors ${isActive("/country") ? "text-accent font-semibold" : ""
                }`}
            >
              Country
            </Link>

            <Link
              href="/movies"
              className={`hover:text-accent transition-colors ${isActive("/movies") ? "text-accent font-semibold" : ""
                }`}
            >
              Movies
            </Link>

            <Link
              href="/tv-shows"
              className={`hover:text-accent transition-colors ${isActive("/tv-shows") ? "text-accent font-semibold" : ""
                }`}
            >
              TV Shows
            </Link>

            <Link
              href="/top-imdb"
              className={`hover:text-accent transition-colors ${isActive("/top-imdb") ? "text-accent font-semibold" : ""
                }`}
            >
              Top IMDB
            </Link>

            <Link
              href="/search"
              className={`hover:text-accent transition-colors ${isActive("/search") ? "text-accent font-semibold" : ""
                }`}
            >
              Search
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-card transition-colors ${isActive("/search") ? "text-accent" : ""
                }`}
            >
              <Search size={20} />
            </Link>

            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-card transition-colors">
              <Download size={20} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-card transition-colors"
              >
                <User size={20} />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2 text-destructive"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 hover:bg-muted transition-colors">
                        Sign In
                      </Link>
                      <Link href="/signup" className="block px-4 py-2 hover:bg-muted transition-colors">
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-card transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-4 bg-card/50 backdrop-blur p-4 rounded-lg">
            <Link href="/" className={`hover:text-accent transition-colors ${isActive("/") ? "text-accent font-semibold" : ""}`}>
              Home
            </Link>

            <Link href="/genre" className={`hover:text-accent transition-colors ${isActive("/genre") ? "text-accent font-semibold" : ""}`}>
              Genre
            </Link>

            <Link href="/country" className={`hover:text-accent transition-colors ${isActive("/country") ? "text-accent font-semibold" : ""}`}>
              Country
            </Link>

            <Link href="/movies" className={`hover:text-accent transition-colors ${isActive("/movies") ? "text-accent font-semibold" : ""}`}>
              Movies
            </Link>

            <Link href="/tv-shows" className={`hover:text-accent transition-colors ${isActive("/tv-shows") ? "text-accent font-semibold" : ""}`}>
              TV Shows
            </Link>

            <Link href="/top-imdb" className={`hover:text-accent transition-colors ${isActive("/top-imdb") ? "text-accent font-semibold" : ""}`}>
              Top IMDB
            </Link>

            <Link href="/search" className={`hover:text-accent transition-colors ${isActive("/search") ? "text-accent font-semibold" : ""}`}>
              Search
            </Link>

            {user ? (
              <>
                <Link href="/profile" className="hover:text-accent transition-colors flex items-center gap-2">
                  <User size={16} />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-destructive hover:text-destructive/80 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-accent transition-colors">Sign In</Link>
                <Link href="/signup" className="hover:text-accent transition-colors">Sign Up</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
