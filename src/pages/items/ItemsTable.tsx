import React from 'react';
import { Item } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { Edit, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ItemsTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  handleSort: (key: keyof Item) => void;
  sortConfig: {
    key: keyof Item;
    direction: 'asc' | 'desc';
  };
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, onEdit, handleSort, sortConfig }) => {
  const getStatusBadge = (status: Item['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
          >
            Pendente
          </Badge>
        );
      case 'acquired':
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          >
            Adquirido
          </Badge>
        );
      case 'delivered':
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          >
            Entregue
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
              Nome
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead className="text-center">
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => handleSort('quantity')}
            >
              Qtd.
            </div>
          </TableHead>
          <TableHead>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleSort('category')}
            >
              Categoria
            </div>
          </TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead className="text-right">
            <div
              className="flex items-center justify-end cursor-pointer"
              onClick={() => handleSort('price')}
            >
              Preço
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
              Nenhum item encontrado
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-center">{item.quantity}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.supplier || '-'}</TableCell>
              <TableCell className="text-right">
                {item.price ? formatCurrency(item.price) : '-'}
              </TableCell>
              <TableCell>{getStatusBadge(item.status)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ItemsTable;
