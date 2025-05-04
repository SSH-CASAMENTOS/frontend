import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Budget, BudgetCategory } from '@/types';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface BudgetAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'category' | 'item';
  budget: Budget | null;
  onSave: (
    type: 'category' | 'item',
    data:
      | { name: string; description?: string }
      | { name: string; categoryId: string; amount: number; supplier?: string; notes?: string }
  ) => void;
}

const BudgetAddDialog: React.FC<BudgetAddDialogProps> = ({
  isOpen,
  onOpenChange,
  dialogType,
  budget,
  onSave,
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemValue, setItemValue] = useState('');
  const [itemSupplier, setItemSupplier] = useState('');
  const [itemNotes, setItemNotes] = useState('');

  const handleSave = () => {
    if (dialogType === 'category') {
      if (!categoryName.trim()) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira o nome da categoria.',
          variant: 'destructive',
        });
        return;
      }

      onSave('category', {
        name: categoryName,
        description: categoryDescription,
      });
      setCategoryName('');
      setCategoryDescription('');
    } else {
      if (!itemName.trim() || !itemCategory || !itemValue) {
        toast({
          title: 'Erro',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }

      onSave('item', {
        name: itemName,
        categoryId: itemCategory,
        amount: parseFloat(itemValue),
        supplier: itemSupplier,
        notes: itemNotes,
      });

      setItemName('');
      setItemCategory('');
      setItemValue('');
      setItemSupplier('');
      setItemNotes('');
    }

    onOpenChange(false);
  };

  const handleDialogClose = () => {
    onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent">
          <DialogTitle>
            {dialogType === 'category' ? 'Nova Categoria' : 'Novo Item do Orçamento'}
          </DialogTitle>
          <DialogDescription>
            {dialogType === 'category'
              ? 'Adicione uma nova categoria ao seu orçamento'
              : 'Adicione um novo item ao seu orçamento'}
          </DialogDescription>
        </DialogHeader>

        {dialogType === 'category' ? (
          <motion.div
            className="space-y-4 p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="categoryName">Nome da Categoria</Label>
              <Input
                id="categoryName"
                placeholder="Ex: Buffet, Decoração"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="categoryDescription">Descrição (opcional)</Label>
              <Input
                id="categoryDescription"
                placeholder="Descrição da categoria"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
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
              <Label htmlFor="itemName">Nome do Item</Label>
              <Input
                id="itemName"
                placeholder="Ex: Flores para decoração"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="itemCategory">Categoria</Label>
              <Select value={itemCategory} onValueChange={setItemCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {budget?.categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="itemValue">Valor</Label>
              <Input
                id="itemValue"
                type="number"
                placeholder="0,00"
                min="0"
                step="0.01"
                value={itemValue}
                onChange={(e) => setItemValue(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="itemSupplier">Fornecedor (opcional)</Label>
              <Input
                id="itemSupplier"
                placeholder="Nome do fornecedor"
                value={itemSupplier}
                onChange={(e) => setItemSupplier(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </motion.div>
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="itemNotes">Observações (opcional)</Label>
              <Input
                id="itemNotes"
                placeholder="Observações do item"
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                className="focus-visible:ring-primary"
              />
            </motion.div>
          </motion.div>
        )}

        <DialogFooter className="p-6 border-t gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={handleDialogClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetAddDialog;
