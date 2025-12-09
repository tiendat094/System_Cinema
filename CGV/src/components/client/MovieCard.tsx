// Movie Card Component

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star } from "lucide-react";
import { Movie } from "@/types/movie.types";
import { formatDate, formatDuration } from "@/lib/utils";
import { AGE_RATINGS } from "@/lib/constants";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  console.log("Rendering MovieCard for movie:", movie);
  const ageRatingInfo = AGE_RATINGS[movie.ageRating];

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="card overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Age Rating Badge */}
          <div className={`absolute top-3 left-3 ${ageRatingInfo.color} px-2 py-1 rounded-md text-xs font-bold`}>
            {movie.ageRating}
          </div>
          
          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">{movie.rating.toFixed(1)}</span>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Movie Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {movie.title}
          </h3>
          
          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 py-1 bg-dark-700 rounded-full text-gray-400"
              >
                {genre.name}
              </span>
            ))}
          </div>
          
          {/* Meta Info */}
          <div className="space-y-1.5 text-sm text-gray-400 mt-auto">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(movie.releaseDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
