import { createContext, useContext, useState, ReactNode } from 'react';
import { User, LoginCredentials, AuthContextType } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@santapriscila.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'usuario',
    email: 'usuario@santapriscila.com',
    password: 'user123',
    name: 'Usuario Demo',
    role: 'user' as const,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockUser = MOCK_USERS.find(
      u =>
        (u.username === credentials.identifier || u.email === credentials.identifier) &&
        u.password === credentials.password
    );

    if (!mockUser) {
      setIsLoading(false);
      throw new Error('Usuario o contraseña incorrectos');
    }

    const { password, ...userWithoutPassword } = mockUser;
    setUser(userWithoutPassword);

    if (credentials.rememberMe) {
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    }

    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
