import React from 'react';
import { Item } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: Item | null;
  categories: string[];
  onSave: () => void;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedItem,
  categories,
  onSave,
  setSelectedItem,
}) => {
  const isMobile = useIsMobile();

  if (!selectedItem) return null;

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
          <DialogTitle>Editar Item</DialogTitle>
          <DialogDescription>Faça as alterações necessárias no item selecionado</DialogDescription>
        </DialogHeader>

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
              value={selectedItem?.name || ''}
              onChange={(e) =>
                setSelectedItem((prev) => (prev ? { ...prev, name: e.target.value } : null))
              }
              className="focus-visible:ring-primary"
            />
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4" variants={itemVariants}>
            <div className="space-y-2">
              <Label htmlFor="itemQuantity">Quantidade</Label>
              <Input
                id="itemQuantity"
                type="number"
                min="1"
                value={selectedItem?.quantity || 1}
                onChange={(e) =>
                  setSelectedItem((prev) =>
                    prev ? { ...prev, quantity: Number(e.target.value) } : null
                  )
                }
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Preço</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                value={selectedItem?.price || 0}
                onChange={(e) =>
                  setSelectedItem((prev) =>
                    prev ? { ...prev, price: Number(e.target.value) } : null
                  )
                }
                className="focus-visible:ring-primary"
              />
            </div>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="itemCategory">Categoria</Label>
            <Select
              value={selectedItem?.category}
              onValueChange={(value) =>
                setSelectedItem((prev) => (prev ? { ...prev, category: value } : null))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="itemSupplier">Fornecedor</Label>
            <Input
              id="itemSupplier"
              value={selectedItem?.supplier || ''}
              onChange={(e) =>
                setSelectedItem((prev) => (prev ? { ...prev, supplier: e.target.value } : null))
              }
              className="focus-visible:ring-primary"
            />
          </motion.div>

          <motion.div className="space-y-2" variants={itemVariants}>
            <Label htmlFor="itemStatus">Status</Label>
            <Select
              value={selectedItem?.status || 'pending'}
              onValueChange={(value: Item['status']) =>
                setSelectedItem((prev) => (prev ? { ...prev, status: value } : null))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="acquired">Adquirido</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>

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

export default EditItemDialog;
