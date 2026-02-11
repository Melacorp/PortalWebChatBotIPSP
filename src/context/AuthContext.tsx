import { useState, useEffect, type ReactNode } from "react";
import type { User, LoginCredentials } from "../types/auth.types";
import { AuthContext } from "./authContext";
import { authService } from "../services/auth.service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifySession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const response = await authService.verifyToken();
        if (response.ok && response.data) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        authService.clearAuth();
      } finally {
        setIsInitializing(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (response.ok && response.data) {
        setUser(response.data.user);
      } else {
        throw new Error(response.message || "Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    authService.clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isInitializing,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
