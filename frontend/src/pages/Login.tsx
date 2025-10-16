import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [err, setErr] = useState<string>("");
  const nav = useNavigate();
  const { login, register } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setErr("");
      await login(email, password);
      nav("/escrows");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Login failed");
    }
  }

  async function onQuickRegister() {
    try {
      setErr("");
      await register("Admin", email, password);
      nav("/escrows");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Register failed");
    }
  }

  return (
    <Row className="justify-content-md-center">
      <Col md={6} lg={5}>
        <h1 className="mb-3">Sign in</h1>
        <Card body>
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control value={email} onChange={(e)=>setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            </Form.Group>
            {err && <Alert variant="danger" className="py-2">{err}</Alert>}
            <div className="d-flex gap-2">
              <Button type="submit">Login</Button>
              <Button variant="outline-secondary" type="button" onClick={onQuickRegister}>
                Quick register
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
}
// Prikazuje login formu sa opcijom brzog registrovanja