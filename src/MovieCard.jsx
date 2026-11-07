import React from "react";

// Надежная локальная SVG-заглушка (не зависит от интернета)
const FALLBACK_POSTER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#e5e7eb" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#9ca3af">Нет постера</text>
  </svg>
`);

export function MovieCard({ movie }) {
  // Если постера нет, ставим нашу SVG-заглушку
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  return (
    <article className="movie-card">
      <img 
        src={posterUrl} 
        alt={movie.Title} 
        className="movie-poster"
        // Если ссылка на постер есть, но она битая (не грузится) — тоже подставим заглушку
        onError={(e) => {
          e.target.src = FALLBACK_POSTER;
        }} 
      />
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p>
          <strong>Год:</strong> {movie.Year}
        </p>
        <p className="movie-type">
          <strong>Тип:</strong> {movie.Type}
        </p>
      </div>
    </article>
  );
}