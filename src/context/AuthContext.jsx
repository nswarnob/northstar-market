import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("northstar_token")));

  useEffect(() => {
    if (!localStorage.getItem("northstar_token")) return;
    api.get("/auth/me")
      .then(({ data }) => setUser(data.data.user))
      .catch(() => localStorage.removeItem("northstar_token"))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, values) => {
    const { data } = await api.post(path, values);
    localStorage.setItem("northstar_token", data.data.token);
    setUser(data.data.user);
  };

  const value = {
    user,
    loading,
    login: (values) => authenticate("/auth/login", values),
    register: (values) => authenticate("/auth/register", values),
    logout: () => {
      localStorage.removeItem("northstar_token");
      setUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
