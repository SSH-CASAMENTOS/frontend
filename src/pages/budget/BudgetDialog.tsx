import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BudgetItem, BudgetCategory } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface BudgetDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: {
    item: BudgetItem;
    categoryId: string;
  } | null;
  selectedCategory: BudgetCategory | null;
  onSave: () => void;
  setSelectedItem: (item: { item: BudgetItem; categoryId: string } | null) => void;
  setSelectedCategory: (category: BudgetCategory | null) => void;
  budget?: {
    categories: BudgetCategory[];
  } | null;
}

const BudgetDialog = ({
  isOpen,
  onOpenChange,
  selectedItem,
  selectedCategory,
  onSave,
  setSelectedItem,
  setSelectedCategory,
  budget,
}: BudgetDialogProps) => {
  const isEditingCategory = !!selectedCategory && !selectedItem;
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (selectedItem) {
      setSelectedCategoryId(selectedItem.categoryId);
    }
  }, [selectedItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedItem) {
      const { name, value, type, checked } = e.target;

      setSelectedItem({
        ...selectedItem,
        item: {
          ...selectedItem.item,
          [name]: type === 'checkbox' ? checked : value,
        },
      });
    } else if (selectedCategory) {
      const { name, value } = e.target;

      setSelectedCategory({
        ...selectedCategory,
        [name]: value,
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        categoryId: value,
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    if (selectedItem) {
      setSelectedItem({
        ...selectedItem,
        item: {
          ...selectedItem.item,
          isPaid: checked,
        },
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setTimeout(() => {
        if (selectedItem) setSelectedItem(null);
        if (selectedCategory) setSelectedCategory(null);
      }, 300);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <DialogTitle>
            {isEditingCategory ? 'Editar Categoria' : 'Editar Item do Orçamento'}
          </DialogTitle>
          <DialogDescription>
            {isEditingCategory
              ? 'Altere os detalhes da categoria selecionada'
              : 'Ajuste os detalhes do item selecionado no orçamento'}
          </DialogDescription>
        </DialogHeader>

        {isEditingCategory ? (
          <motion.div
            className="space-y-4 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                name="name"
                value={selectedCategory?.name || ''}
                onChange={handleChange}
                className="focus-visible:ring-primary"
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                id="name"
                name="name"
                value={selectedItem?.item.name || ''}
                onChange={handleChange}
                className="focus-visible:ring-primary"
              />
            </motion.div>

            {budget && budget.categories && budget.categories.length > 0 && (
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="category">Categoria</Label>
                <Select value={selectedCategoryId} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category" className="w-full">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {budget.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="0"
                step="0.01"
                value={selectedItem?.item.amount || 0}
                onChange={handleChange}
                className="focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                name="supplier"
                value={selectedItem?.item.supplier || ''}
                onChange={handleChange}
                className="focus-visible:ring-primary"
              />
            </motion.div>

            <motion.div className="flex items-center justify-between" variants={itemVariants}>
              <Label htmlFor="isPaid">Status de Pagamento</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPaid"
                  name="isPaid"
                  checked={selectedItem?.item.isPaid || false}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isPaid">{selectedItem?.item.isPaid ? 'Pago' : 'Pendente'}</Label>
              </div>
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                name="notes"
                value={selectedItem?.item.notes || ''}
                onChange={handleChange}
                className="focus-visible:ring-primary"
              />
            </motion.div>
          </motion.div>
        )}

        <DialogFooter className="p-6 border-t gap-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetDialog;
