import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Wedding } from '@/types';

interface ContractsHeaderProps {
  contractsCount: number;
  activeWedding: Wedding | null;
  onAddClick: () => void;
}

const ContractsHeader: React.FC<ContractsHeaderProps> = ({
  contractsCount,
  activeWedding,
  onAddClick,
}) => {
  return (
    <motion.div
      className="flex justify-between items-center bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 rounded-lg shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <span>Contratos</span>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-2">
          {contractsCount}
        </span>
      </h1>
      <Button
        onClick={onAddClick}
        disabled={!activeWedding}
        className="gap-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
        aria-label="Adicionar novo contrato"
      >
        <Plus className="h-4 w-4" /> Novo Contrato
      </Button>
    </motion.div>
  );
};

export default ContractsHeader;
