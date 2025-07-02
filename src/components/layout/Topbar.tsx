import React from 'react';
import { Bell, ChevronDown, User, LogOut, ClipboardPen, CreditCard, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Profile } from '@/types';

export const Topbar: React.FC = () => {
  const { activeWedding, setActiveWedding, availableWeddings, isNavOpen } = useAppContext();
  const { profileSelected, profiles, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div
          className={`flex items-center ${
            isNavOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-16'
          } transition-all duration-300`}
        ></div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-gradient-to-r from-primary/5 to-transparent"
              >
                {activeWedding ? (
                  <span className="truncate max-w-[120px]">{activeWedding.title}</span>
                ) : (
                  <span>Selecione um casamento</span>
                )}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Casamentos</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableWeddings.map((wedding) => (
                <DropdownMenuItem
                  key={wedding.id}
                  onClick={() => setActiveWedding(wedding)}
                  className="cursor-pointer"
                >
                  {wedding.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate('/add-wedding')}
                className="cursor-pointer text-primary flex items-center gap-1"
              >
                <span className="text-lg font-bold">+</span> Adicionar novo casamento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-gradient-to-r from-primary/5 to-transparent"
              >
                {profileSelected ? (
                  <span className="truncate max-w-[120px]">{profileSelected.name}</span>
                ) : (
                  <span>Selecione um profile</span>
                )}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {profiles &&
                profiles.length > 0 &&
                profiles.map((profile: Profile) => (
                  <DropdownMenuItem
                    key={profile.id}
                    disabled={profile.id === profileSelected?.id}
                    onClick={() => {
                      // Handle profile selection logic here
                    }}
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{profile.name}</span>
                  </DropdownMenuItem>
                ))}
              <hr className='my-2' />
              <DropdownMenuItem
                onClick={() => {
                  // Handle profile selection logic here
                }}
              >
                <span className="text-center w-full">Adicionar Perfil</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 bg-primary/10">
                  <AvatarFallback className="text-primary">MC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{'Minha Conta'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/profile" className="block w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
              </Link>
              <Link to="/signature" className="block w-full">
                <DropdownMenuItem className="cursor-pointer">
                  <ClipboardPen className="mr-2 h-4 w-4" /> Assinatura Digital
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
