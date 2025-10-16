import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { clearToken, getToken } from "../lib/api";

export default function AppNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthed = !!getToken();

  const handleLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
    window.location.reload();
  };

  return (
    <Navbar bg="light" expand="md" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/">AppEscrow</Navbar.Brand>
        <Navbar.Toggle aria-controls="nav" />
        <Navbar.Collapse id="nav">
          <Nav className="me-auto" activeKey={pathname}>
            <Nav.Link as={Link} to="/" eventKey="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/escrows" eventKey="/escrows">Escrows</Nav.Link>
            <Nav.Link as={Link} to="/payments" eventKey="/payments">Payments</Nav.Link>
            <Nav.Link as={Link} to="/about" eventKey="/about">About</Nav.Link>
          </Nav>
          {isAuthed && (
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
