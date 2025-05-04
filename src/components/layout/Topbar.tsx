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

export const Topbar: React.FC = () => {
  const { activeWedding, setActiveWedding, availableWeddings, isNavOpen } = useAppContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user || !user.name) return 'U';

    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-2">
                <h3 className="font-medium mb-2 pb-2 border-b">Notificações</h3>
                <ul className="space-y-2">
                  <li className="p-3 rounded-md hover:bg-muted transition-colors border border-border/50">
                    <div className="flex items-start gap-2">
                      <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                        <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pagamento pendente</p>
                        <p className="text-xs text-muted-foreground">
                          Ana e Pedro - Pagamento final do buffet vence em 7 dias
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="p-3 rounded-md hover:bg-muted transition-colors border border-border/50">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Reunião agendada</p>
                        <p className="text-xs text-muted-foreground">
                          Reunião com o Buffet Gourmet em 5 dias
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </PopoverContent>
          </Popover>

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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 bg-primary/10">
                  <AvatarFallback className="text-primary">{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || 'Minha Conta'}</DropdownMenuLabel>
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
