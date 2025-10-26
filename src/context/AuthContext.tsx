import { createContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../lib/types";
import { setCurrentUser } from "../lib/utils";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem("ticketapp_session");
    if (storedSession) {
      try {
        const userData = JSON.parse(storedSession);
        setUser(userData);
        setCurrentUser(userData.id);
      } catch (error) {
        console.error("Failed to parse session data:", error);
        localStorage.removeItem("ticketapp_session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("ticketapp_session", JSON.stringify(user));
    setCurrentUser(user.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ticketapp_session");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};