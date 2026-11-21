import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const API_KEY = "a2e7da1d"; // Убедись, что тут твой ключ!

export function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Пытаемся взять данные из state (если перешли с карточки)
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Если фильм уже загружен из state и у него есть описание — ничего не делаем
    if (movie && movie.Plot) {
      setLoading(false);
      return;
    }

    // Иначе делаем запрос к API
    setLoading(true);
    fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.Error) throw new Error(data.Error);
        setMovie(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, movie]);

  if (loading) {
    return <div className="spinner" style={{ marginTop: "5rem" }}></div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "5rem", color: "red" }}>
        <h2>Ошибка: {error}</h2>
        <button onClick={() => navigate(-1)} className="page-btn" style={{ marginTop: "1rem" }}>
          ← Назад
        </button>
      </div>
    );
  }

  if (!movie) {
    return <h2 style={{ textAlign: "center", marginTop: "5rem" }}>Фильм не найден</h2>;
  }

  return (
    <div className="movie-details">
      <button onClick={() => navigate(-1)} className="page-btn">← Назад</button>
      
      <div className="details-content">
        {/* Картинка с обработкой ошибки (если Amazon заблокирован) */}
        <img 
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Poster"} 
          alt={movie.Title} 
          className="details-poster"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=No+Poster"; }}
        />
        
        <div className="details-info">
          <h1>{movie.Title}</h1>
          <p><strong>Год:</strong> {movie.Year} | <strong>Жанр:</strong> {movie.Genre}</p>
          <p><strong>Режиссер:</strong> {movie.Director}</p>
          <p><strong>Актеры:</strong> {movie.Actors}</p>
          <p style={{ marginTop: "1rem", lineHeight: "1.6" }}>
            <strong>Описание:</strong> {movie.Plot}
          </p>
        </div>
      </div>
    </div>
  );
}