import { useState, useEffect } from "react";
import { MovieCard } from "../components/MovieCard";

const API_KEY = "a2e7da1d";

export function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?s=Marvel&apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Search) setMovies(data.Search);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🎬 Популярные фильмы</h1>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}