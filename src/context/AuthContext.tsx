import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, type Usuario } from "../services/api";

interface AuthContextType {
  user: Usuario | null;
  login: (user: Usuario) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nickName = localStorage.getItem("nickName");
    if (nickName) {
      api.usuarios.listar().then((users) => {
        const found = users.find((u) => u.nickName === nickName);
        if (found) setUser(found);
        else localStorage.removeItem("nickName");
      }).catch(() => {
        localStorage.removeItem("nickName");
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (user: Usuario) => {
    setUser(user);
    localStorage.setItem("nickName", user.nickName);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nickName");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
