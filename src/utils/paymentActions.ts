import { toast } from '@/hooks/use-toast';
import { Payment } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const editPayment = (payment: Payment, updatedData: Partial<Payment>): Payment => {
  const updatedPayment = { ...payment, ...updatedData };

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const updatedPayments = payments.map((p: Payment) => (p.id === payment.id ? updatedPayment : p));
  localStorage.setItem('payments', JSON.stringify(updatedPayments));

  toast({
    title: 'Pagamento atualizado',
    description: 'As alterações foram salvas com sucesso.',
  });

  return updatedPayment;
};

export const markAsPaid = (payment: Payment): Payment => {
  const now = new Date();
  const updatedPayment = {
    ...payment,
    status: 'paid' as const,
    paidAt: now,
  };

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const updatedPayments = payments.map((p: Payment) => (p.id === payment.id ? updatedPayment : p));
  localStorage.setItem('payments', JSON.stringify(updatedPayments));

  toast({
    title: 'Pagamento confirmado',
    description: `O pagamento de ${payment.title} foi marcado como pago.`,
  });

  return updatedPayment;
};

export const deletePayment = (payment: Payment): void => {
  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  const filteredPayments = payments.filter((p: Payment) => p.id !== payment.id);
  localStorage.setItem('payments', JSON.stringify(filteredPayments));

  toast({
    title: 'Pagamento excluído',
    description: 'O pagamento foi removido com sucesso.',
    variant: 'destructive',
  });
};

export const createPayment = (newPayment: Omit<Payment, 'id'>): Payment => {
  const payment: Payment = {
    ...newPayment,
    id: crypto.randomUUID(),
  };

  const payments = JSON.parse(localStorage.getItem('payments') || '[]');
  localStorage.setItem('payments', JSON.stringify([...payments, payment]));

  toast({
    title: 'Pagamento criado',
    description: 'O novo pagamento foi adicionado com sucesso.',
  });

  return payment;
};

export const viewPaymentDocument = (payment: Payment) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text('Comprovante de Pagamento', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  const startY = 40;
  const lineHeight = 10;

  doc.text(`Título: ${payment.title}`, 20, startY);
  doc.text(`Valor: R$ ${payment.amount.toFixed(2)}`, 20, startY + lineHeight);
  doc.text(`Destinatário: ${payment.recipient}`, 20, startY + lineHeight * 2);
  doc.text(`Categoria: ${payment.category || 'N/A'}`, 20, startY + lineHeight * 3);
  doc.text(
    `Vencimento: ${format(new Date(payment.dueDate), 'dd/MM/yyyy', { locale: ptBR })}`,
    20,
    startY + lineHeight * 4
  );
  doc.text(
    `Status: ${payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'}`,
    20,
    startY + lineHeight * 5
  );

  if (payment.paidAt) {
    doc.text(
      `Data do Pagamento: ${format(new Date(payment.paidAt), 'dd/MM/yyyy', { locale: ptBR })}`,
      20,
      startY + lineHeight * 6
    );
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
};

export const downloadPaymentDocument = (payment: Payment) => {
  const doc = viewPaymentDocument(payment);
  doc.save(`pagamento-${payment.id}.pdf`);

  toast({
    title: 'Documento baixado',
    description: 'O comprovante de pagamento foi baixado com sucesso.',
  });
};
