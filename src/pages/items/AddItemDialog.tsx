import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Item } from '@/types';

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  onAddItem: (item: Omit<Item, 'id' | 'weddingId'>) => void;
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  categories,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState('');
  const [supplier, setSupplier] = useState('');
  const [status, setStatus] = useState<Item['status']>('pending');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !category) {
      return;
    }

    const newItem: Omit<Item, 'id' | 'weddingId'> = {
      name,
      quantity,
      price,
      category: category === 'other' ? newCategory : category,
      supplier: supplier || undefined,
      status,
      notes: notes || undefined,
    };

    onAddItem(newItem);

    resetForm();
  };

  const resetForm = () => {
    setName('');
    setQuantity(1);
    setPrice(undefined);
    setCategory('');
    setNewCategory('');
    setSupplier('');
    setStatus('pending');
    setNotes('');
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetForm();
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Nome do Item</Label>
            <Input
              id="itemName"
              placeholder="Nome do item"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemQuantity">Quantidade</Label>
              <Input
                id="itemQuantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="itemPrice">Preço (opcional)</Label>
              <Input
                id="itemPrice"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={price || ''}
                onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="itemCategory">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
                <SelectItem value="other">Nova categoria</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {category === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="newCategory">Nova Categoria</Label>
              <Input
                id="newCategory"
                placeholder="Nome da nova categoria"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="itemSupplier">Fornecedor (opcional)</Label>
            <Input
              id="itemSupplier"
              placeholder="Nome do fornecedor"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="itemStatus">Status</Label>
            <Select value={status} onValueChange={(value: Item['status']) => setStatus(value)}>
              <SelectTrigger id="itemStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="acquired">Adquirido</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="itemNotes">Observações (opcional)</Label>
            <Input
              id="itemNotes"
              placeholder="Observações sobre o item"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
