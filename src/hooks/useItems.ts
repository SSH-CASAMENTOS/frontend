import { useState, useEffect } from 'react';
import { Item } from '@/types';
import { getItemsByWeddingId } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const useItems = (weddingId: string | undefined) => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Item['status'] | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: 'asc' | 'desc';
  }>({ key: 'name', direction: 'asc' });

  useEffect(() => {
    if (weddingId) {
      const weddingItems = getItemsByWeddingId(weddingId);
      setItems(weddingItems);
    } else {
      setItems([]);
    }
  }, [weddingId]);

  const categories = Array.from(new Set(items.map((item) => item.category))).sort();

  const handleSort = (key: keyof Item) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setFilterCategory(null);
    setFilterStatus(null);
    setSearchQuery('');
  };

  const filteredAndSortedItems = [...items]
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((item) => (filterCategory ? item.category === filterCategory : true))
    .filter((item) => (filterStatus ? item.status === filterStatus : true))
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleAddItem = (newItemData: Omit<Item, 'id' | 'weddingId'>) => {
    if (!weddingId) return;

    const newItem: Item = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      weddingId,
      ...newItemData,
    };

    setItems((prevItems) => [...prevItems, newItem]);

    toast({
      title: 'Item adicionado',
      description: 'O novo item foi adicionado com sucesso.',
    });
  };

  const handleUpdateItem = (updatedItem: Item) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );

    toast({
      title: 'Item atualizado',
      description: 'O item foi atualizado com sucesso.',
    });
  };

  return {
    items,
    setItems,
    categories,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    sortConfig,
    handleSort,
    resetFilters,
    filteredAndSortedItems,
    handleAddItem,
    handleUpdateItem,
  };
};
