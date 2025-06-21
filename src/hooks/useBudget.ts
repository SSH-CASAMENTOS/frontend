import { useState, useEffect, useCallback } from 'react';
import { Budget, BudgetItem, BudgetCategory } from '@/types';
import { getBudgetByWeddingId } from '@/data/mockData';
import { BudgetService } from '@/services/BudgetService';
import { viewBudgetDocument, downloadBudgetDocument } from '@/utils/budgetDocumentUtils';
import { useToast } from '@/hooks/use-toast';

export const useBudget = (weddingId: string | undefined) => {
  const { toast } = useToast();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'category' | 'item'>('item');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    item: BudgetItem;
    categoryId: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);

  useEffect(() => {
    if (weddingId) {
      const weddingBudget = getBudgetByWeddingId(weddingId);
      setBudget(weddingBudget || null);
      setActiveCategory('all');
    } else {
      setBudget(null);
    }
  }, [weddingId]);

  const addNewCategory = useCallback(() => {
    setDialogType('category');
    setIsDialogOpen(true);
  }, []);

  const addNewItem = useCallback(() => {
    setDialogType('item');
    setIsDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const handleEditClick = useCallback((item: BudgetItem, categoryId: string) => {
    setSelectedItem({ item, categoryId });
    setSelectedCategory(null);
    setIsEditDialogOpen(true);
  }, []);

  const handleCategoryEditClick = useCallback((category: BudgetCategory) => {
    setSelectedCategory(category);
    setSelectedItem(null);
    setIsEditDialogOpen(true);
  }, []);

  const handleEditSave = useCallback(() => {
    if ((!selectedItem && !selectedCategory) || !budget) return;

    if (selectedItem) {
      const originalCategoryId = selectedItem.categoryId;
      const newCategoryId = selectedItem.categoryId;

      if (originalCategoryId !== newCategoryId) {
        const updatedBudget = BudgetService.changeBudgetItemCategory(
          budget,
          originalCategoryId,
          newCategoryId,
          selectedItem.item
        );
        setBudget(updatedBudget);
      } else {
        const updatedBudget = BudgetService.editBudgetItem(
          budget,
          selectedItem.categoryId,
          selectedItem.item,
          selectedItem.item
        );
        setBudget(updatedBudget);
      }
    } else if (selectedCategory) {
      const updatedBudget = BudgetService.editBudgetCategory(
        budget,
        selectedCategory,
        selectedCategory
      );
      setBudget(updatedBudget);
    }

    setIsEditDialogOpen(false);
    setSelectedItem(null);
    setSelectedCategory(null);
  }, [selectedItem, selectedCategory, budget]);

  const handleDelete = useCallback(
    (itemId: string, categoryId: string) => {
      if (!budget) return;

      const updatedBudget = BudgetService.deleteBudgetItem(budget, categoryId, itemId);
      setBudget(updatedBudget);
    },
    [budget]
  );

  const handleViewDocument = useCallback(() => {
    if (!budget) return;
    const doc = viewBudgetDocument(budget);
    window.open(doc.output('bloburl'));
  }, [budget]);

  const handleDownloadDocument = useCallback(() => {
    if (!budget) return;
    downloadBudgetDocument(budget);
  }, [budget]);

  const handleAddSave = useCallback(
    (
      type: 'category' | 'item',
      data: {
        name: string;
        amount?: string;
        supplier?: string;
        notes?: string;
        categoryId?: string;
      }
    ) => {
      if (!budget) return;

      let updatedBudget: Budget;

      if (type === 'category') {
        const newCategory: BudgetCategory = {
          id: `cat-${Date.now()}`,
          name: data.name,
          items: [],
        };

        updatedBudget = {
          ...budget,
          categories: [...budget.categories, newCategory],
        };

        toast({
          title: 'Categoria adicionada',
          description: 'A nova categoria foi adicionada com sucesso.',
        });
      } else {
        updatedBudget = {
          ...budget,
          categories: budget.categories.map((category) =>
            category.id === data.categoryId
              ? {
                  ...category,
                  items: [
                    ...category.items,
                    {
                      id: `item-${Date.now()}`,
                      name: data.name,
                      amount: parseFloat(data.amount),
                      supplier: data.supplier,
                      notes: data.notes,
                      isPaid: false,
                    },
                  ],
                }
              : category
          ),
        };

        const newTotalAmount = updatedBudget.categories.reduce(
          (total, category) =>
            total + category.items.reduce((catTotal, item) => catTotal + item.amount, 0),
          0
        );

        updatedBudget.totalAmount = newTotalAmount;

        toast({
          title: 'Item adicionado',
          description: 'O novo item foi adicionado com sucesso.',
        });
      }

      setBudget(updatedBudget);
      setIsDialogOpen(false);
    },
    [budget, toast]
  );

  return {
    budget,
    activeCategory,
    isDialogOpen,
    dialogType,
    isEditDialogOpen,
    selectedItem,
    selectedCategory,
    setBudget,
    setActiveCategory,
    setIsDialogOpen,
    setDialogType,
    setIsEditDialogOpen,
    setSelectedItem,
    setSelectedCategory,
    addNewCategory,
    addNewItem,
    handleDialogClose,
    handleEditClick,
    handleCategoryEditClick,
    handleEditSave,
    handleDelete,
    handleViewDocument,
    handleDownloadDocument,
    handleAddSave,
  };
};
