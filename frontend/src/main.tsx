import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { buildRouter } from "./routes/Router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function AppRouter() {
  const { isAuthed } = useAuth();
  const router = buildRouter(isAuthed);
  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
);
