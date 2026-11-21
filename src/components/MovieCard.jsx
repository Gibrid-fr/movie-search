import { Link } from "react-router-dom";

const FALLBACK_POSTER = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="#e5e7eb"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#9ca3af">Нет постера</text></svg>
`);

export function MovieCard({ movie }) {
  const posterUrl = movie.Poster !== "N/A" ? movie.Poster : FALLBACK_POSTER;

  return (
    <article className="movie-card">
      {/* Ссылка на детальную страницу + передаем movie в state */}
      <Link to={`/movie/${movie.imdbID}`} state={{ movie }} style={{ textDecoration: 'none' }}>
        <img src={posterUrl} alt={movie.Title} className="movie-poster" />
        <div className="movie-info">
          <h3>{movie.Title}</h3>
          <p>📅 {movie.Year}</p>
        </div>
      </Link>
    </article>
  );
}