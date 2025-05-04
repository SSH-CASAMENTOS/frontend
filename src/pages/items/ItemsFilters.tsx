import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Item } from '@/types';

interface ItemsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string | null;
  setFilterCategory: (category: string | null) => void;
  filterStatus: Item['status'] | null;
  setFilterStatus: (status: Item['status'] | null) => void;
  resetFilters: () => void;
  categories: string[];
}

const ItemsFilters: React.FC<ItemsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  resetFilters,
  categories,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="relative grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou fornecedor..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Categoria
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterCategory(null)}>Todas</DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category} onClick={() => setFilterCategory(category)}>
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus(null)}>Todos</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('pending')}>Pendente</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('acquired')}>
              Adquirido
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus('delivered')}>
              Entregue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(filterCategory || filterStatus || searchQuery) && (
          <Button variant="ghost" onClick={resetFilters}>
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  );
};

export default ItemsFilters;
