import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../lib/api";
import { saveToken, loadToken, clearToken } from "../lib/storage";

type User = { id: number; name: string; email: string };

type AuthCtx = {
  user: User | null;
  token: string | null;
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(loadToken());

  useEffect(() => { setAuthToken(token || undefined); }, [token]);

  async function login(email: string, password: string) {
    const { data } = await api.post("/login", { email, password });
    setUser(data.user);
    setToken(data.token);
    saveToken(data.token);
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await api.post("/register", { name, email, password });
    setUser(data.user);
    setToken(data.token);
    saveToken(data.token);
  }

  async function logout() {
    try { await api.post("/logout"); } catch {}
    setUser(null);
    setToken(null);
    clearToken();
    setAuthToken(undefined);
  }

  return (
    <Ctx.Provider value={{ user, token, isAuthed: !!token, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
