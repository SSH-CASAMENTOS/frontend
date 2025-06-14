import React from 'react';
import { useAppContext } from '@/context/AppContext';
import {
  Calendar,
  CreditCard,
  Home,
  FileText,
  List,
  PieChart,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModuleType } from '@/types';
import { Link, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { isNavOpen, setIsNavOpen, activeModule, setActiveModule } = useAppContext();
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Dashboard',
      icon: Home,
      module: 'dashboard' as ModuleType,
      path: '/',
    },
    {
      name: 'Orçamentos',
      icon: PieChart,
      module: 'budget' as ModuleType,
      path: '/budget',
    },
    {
      name: 'Contratos',
      icon: FileText,
      module: 'contracts' as ModuleType,
      path: '/contracts',
    },
    {
      name: 'Itens',
      icon: List,
      module: 'items' as ModuleType,
      path: '/items',
    },
    {
      name: 'Pagamentos',
      icon: CreditCard,
      module: 'payments' as ModuleType,
      path: '/payments',
    },
    {
      name: 'Calendário',
      icon: Calendar,
      module: 'calendar' as ModuleType,
      path: '/calendar',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex-shrink-0 w-64 bg-sidebar shadow-md flex flex-col transition-transform duration-300 ease-in-out transform',
        isNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border bg-gradient-to-r from-primary/20 to-transparent">
        <div className="flex items-center">
          <span className={cn('text-xl font-semibold', !isNavOpen && 'md:hidden')}>SmartUnion</span>
          {!isNavOpen && <span className="hidden md:block text-xl font-semibold">SU</span>}
        </div>
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-1 rounded-md hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          aria-label={isNavOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-auto py-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={() => setActiveModule(item.module)}
                className={cn(
                  'flex items-center py-2 px-3 rounded-md transition-all',
                  activeModule === item.module
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon size={20} className={cn('flex-shrink-0', !isNavOpen && 'mx-auto')} />
                <span
                  className={cn('ml-3 transition-opacity duration-200', !isNavOpen && 'md:hidden')}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Link
          to="/profile"
          className={cn(
            'flex items-center py-2 px-3 rounded-md transition-all hover:bg-sidebar-accent',
            !isNavOpen && 'md:justify-center'
          )}
        >
          <User size={20} className="flex-shrink-0" />
          <span className={cn('ml-3 text-sm font-medium', !isNavOpen && 'md:hidden')}>Perfil</span>
        </Link>

        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center py-2 px-3 rounded-md transition-all hover:bg-sidebar-accent w-full text-left',
            !isNavOpen && 'md:justify-center'
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className={cn('ml-3 text-sm font-medium', !isNavOpen && 'md:hidden')}>Sair</span>
        </button>
      </div>
    </aside>
  );
};
