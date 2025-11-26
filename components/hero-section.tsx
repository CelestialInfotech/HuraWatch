"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Movie } from "@/lib/movie-service";
import Link from "next/link";

export default function HeroSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/CelestialInfotech/HurawatchAPI/refs/heads/main/carousel.json"
    )
      .then((res) => res.json())
      .then((data: Movie[]) => setMovies(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[\s\W-]+/g, "-");

  const getMovieLink = (movie: Movie) => {
    const slug = slugify(movie.title);
    const movieDataEncoded = encodeURIComponent(JSON.stringify(movie));
    return `/movie/${slug}?data=${movieDataEncoded}`;
  };

  return (
    <section className="relative w-full h-screen min-h-[600px]  overflow-hidden">

      {/* Slider Container */}
      <div
        className="absolute inset-0 flex transition-transform duration-[900ms] ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {movies.map((m) => (
          <div
            key={m.movie_id}
            className="min-w-full h-full bg-cover bg-center relative"
            style={{ backgroundImage: `url(${m.dimage || m.image})` }}
          >
            {/* Gradient ALWAYS visible */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-4 md:px-8 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-semibold">
              {movies[currentIndex].quality}
            </span>
            <span className="text-muted-foreground text-sm">
              Duration: {movies[currentIndex].duration}
            </span>
            <span className="text-muted-foreground text-sm">
              IMDB: {movies[currentIndex].score || "N/A"}
            </span>
            <span className="text-muted-foreground text-sm">
              Genre: {movies[currentIndex].genre.join(", ")}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold">
            {movies[currentIndex].title}
          </h1>

          <p className="text-lg text-foreground/80 max-w-xl">
            {movies[currentIndex].description}
          </p>

          <div className="flex gap-4 pt-4">
            <Link href={getMovieLink(movies[currentIndex])}>
              <Button className="gap-2 bg-accent hover:bg-accent/90 text-white">
                <Play size={20} /> Watch now
              </Button>
            </Link>

            <Link href={getMovieLink(movies[currentIndex])}>
              <Button
                variant="outline"
                className="gap-2 border-foreground/30 hover:bg-white"
              >
                <ChevronRight size={20} /> More info
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all ${
              currentIndex === i ? "w-8 bg-accent" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
