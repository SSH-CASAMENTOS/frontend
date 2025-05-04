import { toast } from '@/hooks/use-toast';
import { Budget, BudgetItem, BudgetCategory } from '@/types';
import { formatCurrency } from '@/utils/formatters';

export class BudgetService {
  public static editBudgetItem(
    budget: Budget,
    categoryId: string,
    item: BudgetItem,
    updatedData: Partial<BudgetItem>
  ): Budget {
    const updatedBudget = {
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

    const newTotalAmount = this.calculateTotalAmount(updatedBudget);
    updatedBudget.totalAmount = newTotalAmount;

    localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

    toast({
      title: 'Item atualizado',
      description: 'As alterações foram salvas com sucesso.',
    });

    return updatedBudget;
  }

  public static changeBudgetItemCategory(
    budget: Budget,
    oldCategoryId: string,
    newCategoryId: string,
    item: BudgetItem,
    updatedData: Partial<BudgetItem> = {}
  ): Budget {
    if (oldCategoryId === newCategoryId) {
      return this.editBudgetItem(budget, oldCategoryId, item, updatedData);
    }

    const updatedBudget = {
      ...budget,
      categories: budget.categories.map((category) => {
        if (category.id === oldCategoryId) {
          return {
            ...category,
            items: category.items.filter((i) => i.id !== item.id),
          };
        }
        if (category.id === newCategoryId) {
          return {
            ...category,
            items: [...category.items, { ...item, ...updatedData, categoryId: newCategoryId }],
          };
        }
        return category;
      }),
    };

    const newTotalAmount = this.calculateTotalAmount(updatedBudget);
    updatedBudget.totalAmount = newTotalAmount;

    localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

    toast({
      title: 'Item movido',
      description: 'O item foi movido para a nova categoria com sucesso.',
    });

    return updatedBudget;
  }

  public static editBudgetCategory(
    budget: Budget,
    category: BudgetCategory,
    updatedData: Partial<BudgetCategory>
  ): Budget {
    const updatedBudget = {
      ...budget,
      categories: budget.categories.map((cat) =>
        cat.id === category.id ? { ...cat, ...updatedData } : cat
      ),
    };

    localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

    toast({
      title: 'Categoria atualizada',
      description: 'As alterações foram salvas com sucesso.',
    });

    return updatedBudget;
  }

  public static deleteBudgetItem(budget: Budget, categoryId: string, itemId: string): Budget {
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

    const newTotalAmount = this.calculateTotalAmount(updatedBudget);
    updatedBudget.totalAmount = newTotalAmount;

    localStorage.setItem(`budget_${budget.weddingId}`, JSON.stringify(updatedBudget));

    toast({
      title: 'Item excluído',
      description: 'O item foi removido com sucesso.',
      variant: 'destructive',
    });

    return updatedBudget;
  }

  private static calculateTotalAmount(budget: Budget): number {
    return budget.categories.reduce(
      (total, category) =>
        total + category.items.reduce((catTotal, item) => catTotal + item.amount, 0),
      0
    );
  }
}
