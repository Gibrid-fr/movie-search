import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", marginTop: "5rem" }}>
      <h1 style={{ fontSize: "4rem", margin: 0 }}>404</h1>
      <h2>Страница не найдена</h2>
      <p style={{ marginBottom: "2rem" }}>Такой страницы не существует.</p>
      <Link to="/" className="page-btn" style={{ textDecoration: "none" }}>
        Вернуться на главную
      </Link>
    </div>
  );
}