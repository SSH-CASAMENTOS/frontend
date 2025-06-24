import { toast } from '@/hooks/use-toast';
import { Budget, Contract, Payment } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency, formatDate } from '@/utils/formatters';

export class DocumentService {
  public static generateContractDocument(contract: Contract): jsPDF {
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
    doc.text(`Valor: ${formatCurrency(contract.value)}`, 20, startY + lineHeight * 2);

    if (contract.supplierName) {
      doc.text(`Fornecedor: ${contract.supplierName}`, 20, startY + lineHeight * 3);
    }

    if (contract.signedAt) {
      doc.text(`Assinado em: ${formatDate(contract.signedAt)}`, 20, startY + lineHeight * 4);
    }

    if (contract.expiresAt) {
      doc.text(`Expira em: ${formatDate(contract.expiresAt)}`, 20, startY + lineHeight * 5);
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
  }

  public static viewContractDocument(contract: Contract): void {
    const doc = this.generateContractDocument(contract);
    window.open(doc.output('bloburl'));
  }

  public static downloadContractDocument(contract: Contract): void {
    const doc = this.generateContractDocument(contract);
    doc.save(`contrato-${contract.id}.pdf`);

    toast({
      title: 'Documento baixado',
      description: 'O contrato foi baixado com sucesso.',
    });
  }

  public static generateBudgetDocument(budget: Budget): jsPDF {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Orçamento', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    let currentY = 40;
    const lineHeight = 10;

    doc.text(`Total do Orçamento: ${formatCurrency(budget.totalAmount)}`, 20, currentY);
    currentY += lineHeight * 2;

    budget.categories.forEach((category) => {
      doc.setFontSize(14);
      doc.text(category.name, 20, currentY);
      currentY += lineHeight;

      doc.setFontSize(12);
      category.items.forEach((item) => {
        doc.text(
          `- ${item.name}: ${formatCurrency(item.amount)} (${item.isPaid ? 'Pago' : 'Pendente'})`,
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
  }

  public static viewBudgetDocument(budget: Budget): void {
    const doc = this.generateBudgetDocument(budget);
    window.open(doc.output('bloburl'));
  }

  public static downloadBudgetDocument(budget: Budget): void {
    const doc = this.generateBudgetDocument(budget);
    doc.save(`orcamento-${budget.id}.pdf`);

    toast({
      title: 'Documento baixado',
      description: 'O orçamento foi baixado com sucesso.',
    });
  }

  public static generatePaymentDocument(payment: Payment): jsPDF {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Comprovante de Pagamento', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    const startY = 40;
    const lineHeight = 10;

    doc.text(`Título: ${payment.title}`, 20, startY);
    doc.text(`Valor: ${formatCurrency(payment.amount)}`, 20, startY + lineHeight);
    doc.text(`Destinatário: ${payment.recipient}`, 20, startY + lineHeight * 2);
    doc.text(`Categoria: ${payment.category || 'N/A'}`, 20, startY + lineHeight * 3);
    doc.text(`Vencimento: ${formatDate(payment.dueDate)}`, 20, startY + lineHeight * 4);
    doc.text(
      `Status: ${payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}`,
      20,
      startY + lineHeight * 5
    );

    if (payment.paidAt) {
      doc.text(`Data do Pagamento: ${formatDate(payment.paidAt)}`, 20, startY + lineHeight * 6);
    }

    if (payment.notes) {
      doc.text(`Observações: ${payment.notes}`, 20, startY + lineHeight * 7);
    }

    doc.setFontSize(10);
    doc.text(
      `Documento gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
      105,
      280,
      { align: 'center' }
    );

    return doc;
  }

  public static viewPaymentDocument(payment: Payment): void {
    const doc = this.generatePaymentDocument(payment);
    window.open(doc.output('bloburl'));
  }

  public static downloadPaymentDocument(payment: Payment): void {
    const doc = this.generatePaymentDocument(payment);
    doc.save(`pagamento-${payment.id}.pdf`);

    toast({
      title: 'Documento baixado',
      description: 'O comprovante de pagamento foi baixado com sucesso.',
    });
  }
}
