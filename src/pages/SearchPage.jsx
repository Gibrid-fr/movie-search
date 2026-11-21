import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieCard } from "../components/MovieCard";

const API_KEY = "a2e7da1d"; // Твой ключ

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);

  useEffect(() => {
    // Если запрос слишком короткий — не делаем запрос
    if (query.trim().length <= 2) {
      return; 
    }

    setStatus("loading");
    
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.Error) {
          setMovies([]);
          setStatus("error");
          setError(data.Error);
        } else {
          setMovies(data.Search || []);
          setStatus("success");
        }
      })
      .catch(err => {
        setStatus("error");
        setError(err.message);
      });
  }, [query]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    
    // Очищаем результаты, если ввели мало символов
    if (val.trim().length <= 2) {
      setMovies([]);
      setStatus("idle");
      setError(null);
    }

    if (val) setSearchParams({ q: val });
    else setSearchParams({});
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Например: Matrix..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>

      <div style={{ marginTop: "2rem" }}>
        {status === "idle" && <p className="state-message">Введите минимум 3 символа</p>}
        {status === "loading" && <div className="spinner"></div>}
        {status === "error" && <p className="error-message">❌ {error}</p>}
        
        {status === "success" && (
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}