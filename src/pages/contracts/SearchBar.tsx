import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isFilterOpen: boolean;
  toggleFilter: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isFilterOpen,
  toggleFilter,
}) => {
  return (
    <motion.div
      className="flex items-center gap-4 pb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="relative grow">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, fornecedor ou categoria..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFilter}
        className={isFilterOpen ? 'bg-primary/10' : ''}
        aria-label={isFilterOpen ? 'Fechar filtros' : 'Abrir filtros'}
      >
        <Filter className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

export default SearchBar;
