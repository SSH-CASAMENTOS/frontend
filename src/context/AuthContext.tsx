import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/api';
import { CreateUserDTO } from '@/types/user';
import { postRegister } from '@/services/auth/postRegister';
import { postAuth } from '@/services/auth/postAuth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (userData: CreateUserDTO) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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

  const login = async (email: string, password: string) => {
    try {
      const handleLogin = await postAuth({ email, password });
      localStorage.setItem('auth_token', handleLogin.access_token);
      updateToken(handleLogin.access_token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      toast({
        title: 'Erro no login',
        description: 'Email ou senha incorretos.',
        variant: 'destructive',
      });
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  function updateToken(token?: string) {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      updateToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  const logout = () => {
    updateToken(undefined);
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(logout);

    return () => {
      subscribe();
    };
  }, [logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, register, login, logout }}>
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
