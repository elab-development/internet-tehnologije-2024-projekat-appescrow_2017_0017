import { Outlet } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import { Container } from "react-bootstrap";

export default function App() {
  return (
    <>
      <AppNavbar />
      <Container className="py-4">
        <Outlet />
      </Container>
    </>
  );
}
// Glavna aplikaciona komponenta koja uključuje navigacioni bar i prostor za prikaz stranica