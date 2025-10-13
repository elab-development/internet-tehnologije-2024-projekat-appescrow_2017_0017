import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const nav = useNavigate();
  let authed = false;
  let logout: (() => Promise<void>) | undefined;

  try {
    // ako AuthContext postoji:
    const ctx = useAuth();
    authed = ctx.isAuthed;
    logout = ctx.logout;
  } catch { /* ako još nema konteksta, samo ignoriši */ }

  async function onLogout() {
    if (logout) { await logout(); nav("/login"); }
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-5xl mx-auto p-4 flex gap-4 items-center">
        <Link to="/">Home</Link>
        <Link to="/escrows">Escrows</Link>
        <Link to="/payments">Payments</Link>
        <Link to="/about">About</Link>
        <div className="ml-auto" />
        {authed ? (
          <button className="px-3 py-1 rounded bg-black text-white" onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/login" className="underline">Login</Link>
        )}
      </nav>
    </header>
  );
}
// Navigacioni bar sa linkovima i logout dugmetom ako je korisnik ulogovan