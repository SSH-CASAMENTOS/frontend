import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
  password?: string;
  company?: string;
  [key: string]: string | undefined;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (userData: CreateUserDTO) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const register = async (userData: CreateUserDTO) => {
    const handleCreateUser = await postRegister(userData);
    if (!handleCreateUser.id) {
      return toast({
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao registrar sua conta.',
        variant: 'destructive',
      });
    }
    toast({
      title: 'Usuário cadastrado!',
      description: 'O usuário foi cadastrado com sucesso.',
      variant: 'default',
    });

    await login(userData.email, userData.password);
  };

  const login = (email: string, password: string): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((user) => user.email === email && user.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;

      setUser(userWithoutPassword);
      setIsAuthenticated(true);

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      toast({
        title: 'Login bem-sucedido',
        description: `Bem-vindo de volta, ${foundUser.name}!`,
      });

      return true;
    }

    return false;
  };

  const register = (userData: User): boolean => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some((user) => user.email === userData.email)) {
      return false;
    }

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = userData;

    setUser(userWithoutPassword);
    setIsAuthenticated(true);

    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    toast({
      title: 'Registro bem-sucedido',
      description: `Bem-vindo, ${userData.name}!`,
    });

    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');

    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.',
    });

    navigate('/login');
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? { ...u, ...userData } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    toast({
      title: 'Perfil atualizado',
      description: 'Suas informações foram atualizadas com sucesso.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, updateUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
