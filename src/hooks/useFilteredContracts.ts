import { useState } from 'react';
import { Contract } from '@/types';

interface FilterOptions {
  type: string;
  status: string;
}

export const useFilteredContracts = (contracts: Contract[]) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    type: '',
    status: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contract;
    direction: 'asc' | 'desc';
  }>({ key: 'title', direction: 'asc' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSort = (key: keyof Contract) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleTypeChange = (value: string) => {
    setFilterOptions((prev) => ({ ...prev, type: value }));
  };

  const handleStatusChange = (value: string) => {
    setFilterOptions((prev) => ({ ...prev, status: value }));
  };

  const resetFilters = () => {
    setFilterOptions({ type: '', status: '' });
    setSearchQuery('');
  };

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contract.supplierName &&
        contract.supplierName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contract.category && contract.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = !filterOptions.type || contract.type === filterOptions.type;

    const matchesStatus = !filterOptions.status || contract.status === filterOptions.status;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedAndFilteredContracts = [...filteredContracts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  return {
    filteredContracts: sortedAndFilteredContracts,
    searchQuery,
    setSearchQuery,
    sortConfig,
    handleSort,
    isFilterOpen,
    toggleFilter,
    filterOptions,
    handleTypeChange,
    handleStatusChange,
    resetFilters,
  };
};
