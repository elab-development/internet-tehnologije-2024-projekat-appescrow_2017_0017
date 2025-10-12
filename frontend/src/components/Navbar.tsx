import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();

  async function onLogout() {
    await logout();
    nav("/login");
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-5xl mx-auto p-4 flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/escrows">Escrows</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/about">About</Link>
        <div className="ml-auto" />
        {isAuthed ? (
          <button className="px-3 py-1 rounded bg-black text-white" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <Link className="underline" to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
// Prikazuje linkove i dugme za logout ako je ulogovan, inače link za login