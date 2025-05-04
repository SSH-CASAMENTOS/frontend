import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Contract } from '@/types';
import ContractsTable from './ContractsTable';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

interface ContractsContentProps {
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

const ContractsContent: React.FC<ContractsContentProps> = ({
  contracts,
  onEdit,
  onView,
  onDownload,
  onDelete,
  sortConfig,
  handleSort,
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1 },
      }}
      initial="hidden"
      animate="show"
    >
      <Card className="overflow-hidden border-t-4 border-t-primary/70 shadow-md">
        <CardContent className="p-0">
          <ContractsTable
            contracts={contracts}
            onEdit={onEdit}
            onView={onView}
            onDownload={onDownload}
            onDelete={onDelete}
            sortConfig={sortConfig}
            handleSort={handleSort}
          />
        </CardContent>
      </Card>

      {contracts.length === 0 && (
        <EmptyState
          icon={<FileText className="h-16 w-16" />}
          title="Nenhum contrato encontrado"
          description="Tente ajustar os filtros ou adicionar um novo contrato"
          imageSrc="https://illustrations.popsy.co/fuchsia/crashed-error.svg"
        />
      )}
    </motion.div>
  );
};

export default ContractsContent;
