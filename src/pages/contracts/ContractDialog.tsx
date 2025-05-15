import React from 'react';
import { Contract } from '@/types';
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
import { format } from 'date-fns';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContractDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContract: Contract | null;
  onSave: () => void;
  setSelectedContract: (contract: Contract | null) => void;
}

const ContractDialog: React.FC<ContractDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedContract,
  onSave,
  setSelectedContract,
}) => {
  const isNewContract = selectedContract && !selectedContract.title;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader className="bg-gradient-to-r from-primary/10 to-transparent p-4 -mx-6 -mt-6 mb-2 rounded-t-lg">
          <motion.div
            className="flex gap-2 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileText className="h-5 w-5 text-primary" />
            <DialogTitle>{isNewContract ? 'Adicionar Contrato' : 'Editar Contrato'}</DialogTitle>
          </motion.div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractTitle" className="text-right">
              Título
            </Label>
            <Input
              id="contractTitle"
              value={selectedContract?.title || ''}
              onChange={(e) =>
                setSelectedContract(
                  selectedContract ? { ...selectedContract, title: e.target.value } : null
                )
              }
              className="col-span-3"
              placeholder="Digite o título do contrato"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractType" className="text-right">
              Tipo
            </Label>
            <Select
              value={selectedContract?.type}
              onValueChange={(value: Contract['type']) =>
                setSelectedContract(selectedContract ? { ...selectedContract, type: value } : null)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Cliente</SelectItem>
                <SelectItem value="supplier">Fornecedor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractSupplier" className="text-right">
              Fornecedor
            </Label>
            <Input
              id="contractSupplier"
              value={selectedContract?.supplierName || ''}
              onChange={(e) =>
                setSelectedContract(
                  selectedContract ? { ...selectedContract, supplierName: e.target.value } : null
                )
              }
              className="col-span-3"
              placeholder="Nome do fornecedor"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractCategory" className="text-right">
              Categoria
            </Label>
            <Input
              id="contractCategory"
              value={selectedContract?.category || ''}
              onChange={(e) =>
                setSelectedContract(
                  selectedContract ? { ...selectedContract, category: e.target.value } : null
                )
              }
              className="col-span-3"
              placeholder="Categoria do contrato"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractValue" className="text-right">
              Valor
            </Label>
            <Input
              id="contractValue"
              type="number"
              value={selectedContract?.value || 0}
              onChange={(e) =>
                setSelectedContract(
                  selectedContract ? { ...selectedContract, value: Number(e.target.value) } : null
                )
              }
              className="col-span-3"
              placeholder="0.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractSigned" className="text-right">
              Data de Assinatura
            </Label>
            <Input
              id="contractSigned"
              type="date"
              value={
                selectedContract?.signedAt
                  ? format(new Date(selectedContract.signedAt), 'yyyy-MM-dd')
                  : ''
              }
              onChange={(e) =>
                setSelectedContract(
                  selectedContract
                    ? {
                        ...selectedContract,
                        signedAt: new Date(e.target.value),
                      }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractExpires" className="text-right">
              Data de Expiração
            </Label>
            <Input
              id="contractExpires"
              type="date"
              value={
                selectedContract?.expiresAt
                  ? format(new Date(selectedContract.expiresAt), 'yyyy-MM-dd')
                  : ''
              }
              onChange={(e) =>
                setSelectedContract(
                  selectedContract
                    ? {
                        ...selectedContract,
                        expiresAt: new Date(e.target.value),
                      }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contractStatus" className="text-right">
              Status
            </Label>
            <Select
              value={selectedContract?.status}
              onValueChange={(value: Contract['status']) =>
                setSelectedContract(
                  selectedContract ? { ...selectedContract, status: value } : null
                )
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="expired">Expirado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractDialog;
