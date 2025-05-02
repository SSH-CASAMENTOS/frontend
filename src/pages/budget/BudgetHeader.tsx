import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import { Wedding } from '@/types';

interface BudgetHeaderProps {
  activeWedding: Wedding | null;
  onAddCategory: () => void;
  onAddItem: () => void;
  onViewDocument: () => void;
  onDownloadDocument: () => void;
}

const BudgetHeader: React.FC<BudgetHeaderProps> = ({
  activeWedding,
  onAddCategory,
  onAddItem,
  onViewDocument,
  onDownloadDocument,
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Orçamento</h1>
      {activeWedding && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewDocument}>
            <FileText className="h-4 w-4 mr-1" /> Ver Documento
          </Button>
          <Button variant="outline" onClick={onDownloadDocument}>
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
          <Button variant="outline" onClick={onAddCategory}>
            <Plus className="h-4 w-4 mr-1" /> Nova Categoria
          </Button>
          <Button onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-1" /> Novo Item
          </Button>
        </div>
      )}
    </div>
  );
};

export default BudgetHeader;
