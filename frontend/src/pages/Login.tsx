import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

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
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back</h1>
        <p className="text-gray-600 mt-2">Sign in to manage your escrow transactions and payments.</p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex gap-2">
            <Button type="submit">Login</Button>
            <Button type="button" variant="secondary" onClick={onQuickRegister}>Quick register</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
// Prikazuje login formu sa opcijom brzog registrovanja