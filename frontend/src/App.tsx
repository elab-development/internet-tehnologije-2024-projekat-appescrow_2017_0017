import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
// Glavna aplikaciona komponenta koja uključuje navigacioni meni i prostor za prikaz ruta