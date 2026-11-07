import React, { useState, useEffect } from "react";

// Надежная локальная SVG-заглушка
const FALLBACK_POSTER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <rect width="300" height="450" fill="#e5e7eb" />
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#9ca3af">Нет постера</text>
  </svg>
`);

export function MovieCard({ movie, apiKey }) {
  const [plot, setPlot] = useState("");
  const [isPlotLoading, setIsPlotLoading] = useState(true);

  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  // ДОП ЗАДАНИЕ 1: Загружаем описание для каждой карточки
  useEffect(() => {
    const fetchPlot = async () => {
      setIsPlotLoading(true);
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${apiKey}`
        );
        const data = await res.json();
        if (data.Plot && data.Plot !== "N/A") {
          setPlot(data.Plot);
        } else {
          setPlot("Описание отсутствует.");
        }
      } catch (err) {
        setPlot("Не удалось загрузить описание.");
      } finally {
        setIsPlotLoading(false);
      }
    };

    fetchPlot();
  }, [movie.imdbID, apiKey]);

  return (
    <article className="movie-card">
      <img 
        src={posterUrl} 
        alt={movie.Title} 
        className="movie-poster"
        onError={(e) => { e.target.src = FALLBACK_POSTER; }} 
      />
      <div className="movie-info">
        <h3>{movie.Title}</h3>
        <p className="movie-meta">
          <span>📅 {movie.Year}</span>
          <span>🎬 {movie.Type}</span>
        </p>
        
        {/* Блок с описанием */}
        <div className="movie-plot">
          {isPlotLoading ? (
            <span className="plot-loading">Загрузка описания...</span>
          ) : (
            <p>{plot}</p>
          )}
        </div>
      </div>
    </article>
  );
}