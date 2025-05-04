import React from 'react';
import { Budget, BudgetItem } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { Edit, Trash, FileText, Download, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BudgetTableProps {
  budget: Budget;
  onEdit: (item: BudgetItem, categoryId: string) => void;
  onView: (budget: Budget) => void;
  onDownload: (budget: Budget) => void;
  onDelete: (itemId: string, categoryId: string) => void;
}

const BudgetTable: React.FC<BudgetTableProps> = ({
  budget,
  onEdit,
  onView,
  onDownload,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Fornecedor</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {budget.categories.map((category) =>
          category.items.map((item) => (
            <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {category.name}
                </span>
              </TableCell>
              <TableCell>{item.supplier || '-'}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(item.amount)}
              </TableCell>
              <TableCell className="text-center">
                {item.isPaid ? (
                  <div className="inline-flex items-center text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-green-600 mr-1"></div>
                    <span className="text-xs">Pago</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                    <div className="h-2 w-2 rounded-full bg-amber-600 mr-1"></div>
                    <span className="text-xs">Pendente</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onEdit(item, category.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(budget)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Orçamento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(budget)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id, category.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default BudgetTable;
