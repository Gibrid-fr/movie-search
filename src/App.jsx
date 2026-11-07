import { useState, useEffect } from "react";
import { MovieCard } from "./MovieCard";
import "./index.css";

const API_KEY = "a2e7da1d";

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle"); // 'idle' | 'loading' | 'error' | 'success'
  const [error, setError] = useState(null);

  // Функция запроса к API
  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=${API_KEY}`
      );

      if (!res.ok) throw new Error("Ошибка сети. Проверьте интернет.");

      const data = await res.json();

      // OMDb возвращает { Error: "Movie not found!" }, если ничего не найдено
      if (data.Error) {
        setMovies([]);
        setStatus("error");
        setError(data.Error);
        return;
      }

      setMovies(data.Search || []);
      setStatus("success");
    } catch (err) {
      setMovies([]);
      setStatus("error");
      setError(err.message);
    }
  };

  // Обработчик ручного поиска (по кнопке или Enter)
  const handleSearch = () => {
    fetchMovies(query);
  };

  // Обработчик нажатия Enter в поле ввода
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Автопоиск с Debounce (доп. задание из лабы)
  useEffect(() => {
    // Если запрос слишком короткий — сбрасываем всё
    if (query.trim().length <= 2) {
      setMovies([]);
      setStatus("idle");
      setError(null);
      return;
    }

    // Запускаем таймер на 500мс
    const timer = setTimeout(() => {
      fetchMovies(query);
    }, 500);

    // Функция очистки: если пользователь продолжает печатать, таймер сбрасывается
    return () => clearTimeout(timer);
  }, [query]); // Следим только за изменениями query

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎬 Поиск фильмов</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Например: Matrix, Inception..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={status === "loading" || !query.trim()} // Блокируем кнопку во время загрузки
            className="search-button"
          >
            {status === "loading" ? "Поиск..." : "Найти"}
          </button>
        </div>
      </header>

      <main className="main-content">
        {/* Состояние 1: Ожидание */}
        {status === "idle" && (
          <p className="state-message">
            Введите название фильма (минимум 3 символа) или нажмите «Найти».
          </p>
        )}

        {/* Состояние 2: Загрузка */}
        {status === "loading" && (
          <div className="state-message">
            <div className="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        )}

        {/* Состояние 3: Ошибка (включая "Ничего не найдено") */}
        {status === "error" && (
          <div className="error-message">
            <p>❌ {error === "Movie not found!" ? "Ничего не найдено по вашему запросу" : error}</p>
          </div>
        )}

        {/* Состояние 4: Успех */}
        {status === "success" && movies.length > 0 && (
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;