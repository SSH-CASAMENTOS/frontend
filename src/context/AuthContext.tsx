import { createContext, useContext, useState, useEffect, ReactNode, Dispatch } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/api';
import { Profile } from '@/types';
import { CreateUserDTO, User } from '@/types/user';
import { postAuth } from '@/services/auth/postAuth';
import { getUserById } from '@/services/users/getUserById';
import { postRegister } from '@/services/auth/postRegister';
import { getProfilesByUserId } from '@/services/profiles/getProfilesByUserId';

interface AuthContextType {
  register: (userData: CreateUserDTO) => void;
  login: (email: string, password: string) => void;
  isAuthenticated: boolean;
  logout: () => void;
  profiles: Profile[] | undefined;
  profileSelected: Profile | undefined;
  setProfileSelected: Dispatch<React.SetStateAction<Profile | undefined>>;
}

interface JwtPayload {
  sub: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();
  const [profiles, setProfiles] = useState<Profile[]>();
  const [profileSelected, setProfileSelected] = useState<Profile>();

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
      getUserIdFromToken(handleLogin.access_token);
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

  async function getUserIdFromToken(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const user = await getUserById(decoded.sub);
      setUser(user);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      throw error;
    }
  }

  function updateToken(token?: string) {
    api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
  }

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      updateToken(token);
      getUserIdFromToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
    const handleGetProfiles = async () => {
      const profiles = await getProfilesByUserId(user.id);
      setProfiles(profiles);
      setProfileSelected(profiles[0]);
    };

    handleGetProfiles();
  }, [user]);

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
    <AuthContext.Provider
      value={{
        register,
        login,
        isAuthenticated,
        logout,
        profiles,
        profileSelected,
        setProfileSelected,
      }}
    >
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
