import { Link, useLocation } from "react-router-dom";

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  let path = "";
  return (
    <nav className="text-sm mb-4">
      <Link to="/" className="underline">Home</Link>
      {parts.map((p, i) => {
        path += `/${p}`;
        return (
          <span key={i}>
            {" / "}
            <Link to={path} className="underline">{p}</Link>
          </span>
        );
      })}
    </nav>
  );
}
// Prikazuje breadcrumb navigaciju baziranu na trenutnoj putanji