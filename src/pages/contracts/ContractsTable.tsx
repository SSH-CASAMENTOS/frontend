import React from 'react';
import { Contract } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { FileText, MoreHorizontal, Edit, Download, Trash, ArrowUpDown } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getStatusBadgeClass, getStatusLabel } from './utils';

interface ContractsTableProps {
  contracts: Contract[];
  onEdit: (contract: Contract) => void;
  onView: (contract: Contract) => void;
  onDownload: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  sortConfig: {
    key: keyof Contract;
    direction: 'asc' | 'desc';
  };
  handleSort: (key: keyof Contract) => void;
}

const ContractsTable: React.FC<ContractsTableProps> = ({
  contracts,
  onEdit,
  onView,
  onDownload,
  onDelete,
  sortConfig,
  handleSort,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>
              Título
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center cursor-pointer" onClick={() => handleSort('type')}>
              Tipo
            </div>
          </TableHead>
          <TableHead>Fornecedor/Categoria</TableHead>
          <TableHead>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleSort('signedAt')}
            >
              Assinado em
            </div>
          </TableHead>
          <TableHead>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => handleSort('expiresAt')}
            >
              Expira em
            </div>
          </TableHead>
          <TableHead className="text-right">
            <div
              className="flex items-center justify-end cursor-pointer"
              onClick={() => handleSort('value')}
            >
              Valor
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </div>
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
              Nenhum contrato encontrado
            </TableCell>
          </TableRow>
        ) : (
          contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </TableCell>
              <TableCell className="font-medium">{contract.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {contract.type === 'client' ? 'Cliente' : 'Fornecedor'}
                </Badge>
              </TableCell>
              <TableCell>
                {contract.type === 'supplier' ? contract.supplierName : contract.category || '-'}
              </TableCell>
              <TableCell>{contract.signedAt ? formatDate(contract.signedAt) : '-'}</TableCell>
              <TableCell>{contract.expiresAt ? formatDate(contract.expiresAt) : '-'}</TableCell>
              <TableCell className="text-right">{formatCurrency(contract.value)}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(getStatusBadgeClass(contract.status, contract.expiresAt))}
                >
                  {getStatusLabel(contract.status, contract.expiresAt)}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(contract)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onView(contract)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Documento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload(contract)}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(contract)}>
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

export default ContractsTable;
