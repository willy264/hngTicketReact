import { createContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../lib/types";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem("ticketapp_session");
    if (storedSession) {
      setUser(JSON.parse(storedSession));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("ticketapp_session", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ticketapp_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};