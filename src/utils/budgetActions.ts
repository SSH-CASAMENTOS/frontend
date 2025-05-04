import { toast } from '@/hooks/use-toast';
import { BudgetItem, Budget, BudgetCategory } from '@/types';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const editBudgetItem = (
  budget: Budget,
  categoryId: string,
  item: BudgetItem,
  updatedData: Partial<BudgetItem>
): Budget => {
  let isCategoryChanged = false;
  const oldCategoryId = categoryId;
  const newCategoryId = categoryId;

  if (oldCategoryId !== newCategoryId) {
    isCategoryChanged = true;
  }

  let updatedBudget: Budget;

  if (isCategoryChanged) {
    updatedBudget = {
      ...budget,
      categories: budget.categories.map((category) => {
        if (category.id === oldCategoryId) {
          return {
            ...category,
            items: category.items.filter((i) => i.id !== item.id),
          };
        } else if (category.id === newCategoryId) {
          return {
            ...category,
            items: [...category.items, { ...item, ...updatedData }],
          };
        }
        return category;
      }),
    };
  } else {
    updatedBudget = {
      ...budget,
      categories: budget.categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((i) => (i.id === item.id ? { ...i, ...updatedData } : i)),
            }
          : category
      ),
    };
  }

  localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

  toast({
    title: 'Item atualizado',
    description: 'As alterações foram salvas com sucesso.',
  });

  return updatedBudget;
};

export const deleteBudgetItem = (budget: Budget, categoryId: string, itemId: string): Budget => {
  const updatedBudget = {
    ...budget,
    categories: budget.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.filter((item) => item.id !== itemId),
          }
        : category
    ),
  };

  localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

  toast({
    title: 'Item excluído',
    description: 'O item foi removido com sucesso.',
    variant: 'destructive',
  });

  return updatedBudget;
};

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
