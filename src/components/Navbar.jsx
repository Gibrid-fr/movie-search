import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Главная
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        Поиск фильмов
      </NavLink>
    </nav>
  );
}