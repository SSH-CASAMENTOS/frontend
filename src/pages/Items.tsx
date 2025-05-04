import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Item } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ItemsTable from './items/ItemsTable';
import AddItemDialog from './items/AddItemDialog';
import EditItemDialog from './items/EditItemDialog';
import NoWeddingSelected from './items/NoWeddingSelected';
import ItemsFilters from './items/ItemsFilters';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';

const ItemsPage = () => {
  const { toast } = useToast();
  const { activeWedding } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const {
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
  } = useItems(activeWedding?.id);

  const handleEditClick = (item: Item) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedItem) return;

    const updatedItems = items.map((i) => (i.id === selectedItem.id ? selectedItem : i));
    setItems(updatedItems);

    toast({
      title: 'Item atualizado',
      description: 'As alterações foram salvas com sucesso.',
    });

    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div
        variants={item}
        className="flex justify-between items-center bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 rounded-lg shadow-sm"
      >
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span>Itens do Evento</span>
          <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
            {items.length}
          </span>
        </h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!activeWedding}
          className="gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        >
          <Plus className="h-4 w-4" /> Novo Item
        </Button>
      </motion.div>

      {!activeWedding ? (
        <motion.div variants={item}>
          <NoWeddingSelected />
        </motion.div>
      ) : (
        <>
          <motion.div variants={item}>
            <motion.div
              className="bg-gradient-to-b from-background to-background/80 rounded-lg p-4 border shadow-sm"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <ItemsFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                resetFilters={resetFilters}
                categories={categories}
              />
            </motion.div>
          </motion.div>

          <motion.div variants={item}>
            <Card className="overflow-hidden border-t-4 border-t-primary/70 shadow-md">
              <CardContent className="p-0">
                <ItemsTable
                  items={filteredAndSortedItems}
                  onEdit={handleEditClick}
                  handleSort={handleSort}
                  sortConfig={sortConfig}
                />
              </CardContent>
            </Card>

            {filteredAndSortedItems.length === 0 && (
              <div className="text-center py-8">
                <motion.div
                  className="flex flex-col items-center justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Package className="h-16 w-16 text-muted-foreground opacity-40 mb-2" />
                  <p className="text-muted-foreground">Nenhum item encontrado</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tente ajustar os filtros ou adicionar um novo item
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>
        </>
      )}

      <AddItemDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        categories={categories}
        onAddItem={handleAddItem}
      />

      <EditItemDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedItem={selectedItem}
        categories={categories}
        onSave={handleEditSave}
        setSelectedItem={setSelectedItem}
      />
    </motion.div>
  );
};

export default ItemsPage;
