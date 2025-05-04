import { toast } from '@/hooks/use-toast';
import { Budget } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const viewBudgetDocument = (budget: Budget) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Orçamento', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  let currentY = 40;
  const lineHeight = 10;

  doc.text(`Total do Orçamento: R$ ${budget.totalAmount.toFixed(2)}`, 20, currentY);
  currentY += lineHeight * 2;

  budget.categories.forEach((category) => {
    doc.setFontSize(14);
    doc.text(category.name, 20, currentY);
    currentY += lineHeight;

    doc.setFontSize(12);
    category.items.forEach((item) => {
      doc.text(
        `- ${item.name}: R$ ${item.amount.toFixed(2)} (${item.isPaid ? 'Pago' : 'Pendente'})`,
        30,
        currentY
      );
      if (item.supplier) {
        doc.text(`  Fornecedor: ${item.supplier}`, 40, currentY + lineHeight);
        currentY += lineHeight;
      }
      currentY += lineHeight;
    });
    currentY += lineHeight;
  });

  if (budget.notes) {
    doc.text(`Observações: ${budget.notes}`, 20, currentY);
  }

  doc.setFontSize(10);
  doc.text(
    `Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
    105,
    280,
    { align: 'center' }
  );

  return doc;
};

export const downloadBudgetDocument = (budget: Budget) => {
  const doc = viewBudgetDocument(budget);
  doc.save(`orcamento-${budget.id}.pdf`);

  toast({
    title: 'Documento baixado',
    description: 'O orçamento foi baixado com sucesso.',
  });
};
