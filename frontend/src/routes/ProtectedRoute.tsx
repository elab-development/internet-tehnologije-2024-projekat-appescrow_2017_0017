import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: React.ReactNode;
}) {
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
