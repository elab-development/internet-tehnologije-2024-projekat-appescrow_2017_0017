import { Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/api";

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthed = !!getToken();

const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
    window.location.reload(); // 🔁 osveži app state
}; 

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="text-gray-700 font-semibold hover:text-blue-600">
            Home
          </Link>
          <Link to="/escrows" className="text-gray-700 font-semibold hover:text-blue-600">
            Escrows
          </Link>
          <Link to="/payments" className="text-gray-700 font-semibold hover:text-blue-600">
            Payments
          </Link>
          <Link to="/about" className="text-gray-700 font-semibold hover:text-blue-600">
            About
          </Link>
        </div>

        {isAuthed && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
