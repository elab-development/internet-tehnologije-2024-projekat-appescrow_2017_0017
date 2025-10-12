import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Escrows from "../pages/Escrows";
import Payments from "../pages/Payments";
import About from "../pages/About";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navbar";

export function buildRouter(isAuthed: boolean) {
  return createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <main className="p-4">
            <h1 className="text-2xl font-semibold">Welcome to Escrow App</h1>
            <p className="mt-2 text-gray-700">Simple blockchain-inspired escrow manager demo.</p>
          </main>
        </>
      ),
    },
    {
      path: "/login",
      element: isAuthed ? <Navigate to="/escrows" /> : <Login />,
    },
    {
      path: "/escrows",
      element: (
        <ProtectedRoute isAuthed={isAuthed}>
          <Navbar />
          <Escrows />
        </ProtectedRoute>
      ),
    },
    {
      path: "/payments",
      element: (
        <ProtectedRoute isAuthed={isAuthed}>
          <Navbar />
          <Payments />
        </ProtectedRoute>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <Navbar />
          <About />
        </>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
}
