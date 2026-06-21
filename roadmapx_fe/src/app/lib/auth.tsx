import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "./services";
import type { Role } from "./api";

interface AuthState {
  token: string | null;
  role: Role | null;
  username: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Role>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE = { token: "rmx_token", role: "rmx_role", username: "rmx_username" };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: null, role: null, username: null });

  useEffect(() => {
    setState({
      token: localStorage.getItem(STORAGE.token),
      role: localStorage.getItem(STORAGE.role) as Role | null,
      username: localStorage.getItem(STORAGE.username),
    });
  }, []);

  async function login(email: string, password: string) {
    const data = await authService.login(email, password);
    localStorage.setItem(STORAGE.token, data.token);
    localStorage.setItem(STORAGE.role, data.role);
    localStorage.setItem(STORAGE.username, data.username);
    setState({ token: data.token, role: data.role, username: data.username });
    return data.role;
  }

  function logout() {
    localStorage.removeItem(STORAGE.token);
    localStorage.removeItem(STORAGE.role);
    localStorage.removeItem(STORAGE.username);
    setState({ token: null, role: null, username: null });
  }

  return (
    <AuthContext.Provider
      value={{ ...state, isAuthenticated: !!state.token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}

export function homeForRole(role: Role | null): string {
  if (role === "ROLE_ADMIN") return "/admin";
  if (role === "ROLE_CONTENT_MANAGER") return "/cm";
  if (role === "ROLE_STUDENT") return "/student";
  return "/login";
}
