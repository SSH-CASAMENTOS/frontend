import { toast } from '@/hooks/use-toast';
import { Contract } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const editContract = (contract: Contract, updatedData: Partial<Contract>): Contract => {
  const updatedContract = { ...contract, ...updatedData };

  const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  const updatedContracts = contracts.map((c: Contract) =>
    c.id === contract.id ? updatedContract : c
  );
  localStorage.setItem('contracts', JSON.stringify(updatedContracts));

  toast({
    title: 'Contrato atualizado',
    description: 'As alterações foram salvas com sucesso.',
  });

  return updatedContract;
};

export const deleteContract = (contract: Contract): void => {
  const contracts = JSON.parse(localStorage.getItem('contracts') || '[]');
  const filteredContracts = contracts.filter((c: Contract) => c.id !== contract.id);
  localStorage.setItem('contracts', JSON.stringify(filteredContracts));

  toast({
    title: 'Contrato excluído',
    description: 'O contrato foi removido com sucesso.',
    variant: 'destructive',
  });
};

export const viewContractDocument = (contract: Contract) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Contrato', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  const startY = 40;
  const lineHeight = 10;

  doc.text(`Título: ${contract.title}`, 20, startY);
  doc.text(
    `Tipo: ${contract.type === 'client' ? 'Cliente' : 'Fornecedor'}`,
    20,
    startY + lineHeight
  );
  doc.text(`Valor: R$ ${contract.value.toFixed(2)}`, 20, startY + lineHeight * 2);

  if (contract.supplierName) {
    doc.text(`Fornecedor: ${contract.supplierName}`, 20, startY + lineHeight * 3);
  }

  if (contract.signedAt) {
    doc.text(
      `Assinado em: ${format(new Date(contract.signedAt), 'dd/MM/yyyy', { locale: ptBR })}`,
      20,
      startY + lineHeight * 4
    );
  }

  if (contract.expiresAt) {
    doc.text(
      `Expira em: ${format(new Date(contract.expiresAt), 'dd/MM/yyyy', { locale: ptBR })}`,
      20,
      startY + lineHeight * 5
    );
  }

  doc.text(`Status: ${contract.status}`, 20, startY + lineHeight * 6);

  doc.setFontSize(10);
  doc.text(
    `Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
    105,
    280,
    { align: 'center' }
  );

  return doc;
};

export const downloadContractDocument = (contract: Contract) => {
  const doc = viewContractDocument(contract);
  doc.save(`contrato-${contract.id}.pdf`);

  toast({
    title: 'Documento baixado',
    description: 'O contrato foi baixado com sucesso.',
  });
};
