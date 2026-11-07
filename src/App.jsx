import { useState, useEffect } from "react";
import { MovieCard } from "./MovieCard";
import "./index.css";

const API_KEY = "a2e7da1d"; // Твой ключ

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  
  // Состояния для доп. заданий
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [history, setHistory] = useState([]);

  // Загружаем историю при старте
  useEffect(() => {
    const saved = localStorage.getItem("searchHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const saveToHistory = (searchQuery) => {
    if (!searchQuery.trim()) return;
    // Оставляем только уникальные запросы, новый ставим в начало, обрезаем до 5
    const newHistory = [searchQuery, ...history.filter(q => q !== searchQuery)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const fetchMovies = async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&page=${pageNum}&apikey=${API_KEY}`
      );
      if (!res.ok) throw new Error("Ошибка сети. Проверьте интернет.");

      const data = await res.json();

      if (data.Error) {
        setMovies([]);
        setStatus("error");
        setError(data.Error);
        return;
      }

      setMovies(data.Search || []);
      setTotalResults(Number(data.totalResults));
      setStatus("success");
      saveToHistory(searchQuery); // ДОП ЗАДАНИЕ 4: Сохраняем историю
    } catch (err) {
      setMovies([]);
      setStatus("error");
      setError(err.message);
    }
  };

  const handleSearch = () => {
    setPage(1); // При новом поиске сбрасываем страницу на первую
    fetchMovies(query, 1);
  };

  // ДОП ЗАДАНИЕ 2: Пагинация
  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMovies(query, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка наверх
  };

  // Автопоиск с Debounce
  useEffect(() => {
    if (query.trim().length <= 2) {
      setMovies([]);
      setStatus("idle");
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      setPage(1);
      fetchMovies(query, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // ДОП ЗАДАНИЕ 3: Фильтрация по году на клиенте
  const filteredMovies = movies.filter(movie => {
    // Извлекаем первое 4-значное число из строки (на случай, если год это "2010–2015")
    const movieYear = parseInt(movie.Year);
    
    const min = yearFrom ? parseInt(yearFrom) : 0;
    const max = yearTo ? parseInt(yearTo) : 9999;

    return movieYear >= min && movieYear <= max;
  });

  // Вычисляем максимальную страницу (OMDb отдает по 10 фильмов)
  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎬 Поиск фильмов</h1>
        
        {/* Поле поиска */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Например: Matrix, Inception..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          <button
            onClick={handleSearch}
            disabled={status === "loading" || !query.trim()}
            className="search-button"
          >
            {status === "loading" ? "Поиск..." : "Найти"}
          </button>
        </div>

        {/* История поиска (ДОП ЗАДАНИЕ 4) */}
        {history.length > 0 && (
          <div className="history-box">
            <span className="history-label">Вы недавно искали: </span>
            {history.map((h, i) => (
              <button 
                key={i} 
                className="history-tag"
                onClick={() => { setQuery(h); handleSearch(); }}
              >
                {h}
              </button>
            ))}
          </div>
        )}

        {/* Фильтр по годам (ДОП ЗАДАНИЕ 3) */}
        {status === "success" && movies.length > 0 && (
          <div className="year-filter">
            <label>Год от: <input type="number" value={yearFrom} onChange={e => setYearFrom(e.target.value)} placeholder="1990" /></label>
            <label>Год до: <input type="number" value={yearTo} onChange={e => setYearTo(e.target.value)} placeholder="2024" /></label>
          </div>
        )}
      </header>

      <main className="main-content">
        {status === "idle" && (
          <p className="state-message">Введите название фильма (минимум 3 символа).</p>
        )}

        {status === "loading" && (
          <div className="state-message">
            <div className="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        )}

        {status === "error" && (
          <div className="error-message">
            <p>❌ {error === "Movie not found!" ? "Ничего не найдено" : error}</p>
          </div>
        )}

        {status === "success" && (
          <>
            {filteredMovies.length > 0 ? (
              <div className="movie-list">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} apiKey={API_KEY} />
                ))}
              </div>
            ) : (
              <p className="state-message">Нет фильмов, подходящих под фильтр по годам.</p>
            )}

            {/* Пагинация (ДОП ЗАДАНИЕ 2) */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={page === 1 || status === "loading"} 
                  onClick={() => handlePageChange(page - 1)}
                  className="page-btn"
                >
                  ← Назад
                </button>
                <span className="page-info">Страница {page} из {totalPages}</span>
                <button 
                  disabled={page >= totalPages || status === "loading"} 
                  onClick={() => handlePageChange(page + 1)}
                  className="page-btn"
                >
                  Вперед →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;