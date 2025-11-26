"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Play, Share2 } from "lucide-react"

export default function TVShowPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <img src="/placeholder.svg?height=600&width=400" alt="TV Show" className="w-full rounded-lg" />
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">TV Show Title</h1>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>2025</span>
                <span>Season 1</span>
                <span className="text-accent">IMDB: 8.0</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Episodes</h3>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((ep) => (
                  <div
                    key={ep}
                    className="p-3 bg-card rounded border border-border hover:border-accent transition-colors cursor-pointer"
                  >
                    <p className="font-semibold">Episode {ep}</p>
                    <p className="text-sm text-muted-foreground">45 minutes</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Play size={20} />
                Watch Now
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Share2 size={20} />
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
