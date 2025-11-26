"use client"

import Link from "next/link"
import { Heart, Download } from "lucide-react"
import { useState } from "react"

interface MovieCardProps {
  id: string
  title: string
  year: string
  duration: string
  quality: string
  genre: string[]
  image: string
  isFavorite?: boolean
  isDownloaded?: boolean
  onAddFavorite?: (id: string) => void
  onRemoveFavorite?: (id: string) => void
  onDownload?: (id: string) => void
}

export default function MovieCard({
  id,
  title,
  year,
  duration,
  quality,
  image,
  isFavorite,
  isDownloaded,
  onAddFavorite,
  onRemoveFavorite,
  onDownload,
}: MovieCardProps) {
  const [showQualityOnHover, setShowQualityOnHover] = useState(false)

  return (
    <Link href={`/movie/${id}`}>
      <div
        className="relative group overflow-hidden rounded-lg aspect-[2/3]"
        onMouseEnter={() => setShowQualityOnHover(true)}
        onMouseLeave={() => setShowQualityOnHover(false)}
      >
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute transition-all duration-300 ${
            showQualityOnHover
              ? "top-2 right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded"
              : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent/80 text-accent-foreground text-sm px-3 py-1.5 rounded font-semibold"
          }`}
        >
          {quality}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          <div className="flex gap-2 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault()
                if (isFavorite && onRemoveFavorite) {
                  onRemoveFavorite(id)
                } else if (onAddFavorite) {
                  onAddFavorite(id)
                }
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
            >
              <Heart
                size={16}
                fill={isFavorite ? "currentColor" : "none"}
                className={isFavorite ? "text-red-500" : ""}
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                if (onDownload) {
                  onDownload(id)
                }
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
            >
              <Download size={16} />
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white line-clamp-2">{title}</h3>
            <p className="text-xs text-gray-300">
              {year} • {duration}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
