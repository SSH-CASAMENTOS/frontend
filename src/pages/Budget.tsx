import { viewBudgetDocument, downloadBudgetDocument } from '@/utils/budgetActions';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download } from 'lucide-react';
import BudgetDialog from './budget/BudgetDialog';
import BudgetAddDialog from './budget/BudgetAddDialog';
import BudgetCards from './budget/BudgetCards';
import BudgetCategoryTabs from './budget/BudgetCategoryTabs';
import BudgetNotes from './budget/BudgetNotes';
import { useBudget } from '@/hooks/useBudget';
import BudgetHeader from './budget/BudgetHeader';
import BudgetEmptyState from './budget/BudgetEmptyState';
import { BudgetService } from '@/services/BudgetService';
import { Budget, BudgetCategory, BudgetItem } from '@/types';
import { getBudgetByWeddingId } from '@/data/mockData';

const BudgetPage = () => {
  const { activeWedding } = useAppContext();
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
    if (activeWedding) {
      const weddingBudget = getBudgetByWeddingId(activeWedding.id);
      setBudget(weddingBudget || null);
      setActiveCategory('all');
    } else {
      setBudget(null);
    }
  }, [activeWedding]);

  const addNewCategory = () => {
    setDialogType('category');
    setIsDialogOpen(true);
  };

  const addNewItem = () => {
    setDialogType('item');
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEditClick = (item: BudgetItem, categoryId: string) => {
    setSelectedItem({ item, categoryId });
    setSelectedCategory(null);
    setIsEditDialogOpen(true);
  };

  const handleCategoryEditClick = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setSelectedItem(null);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = () => {
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
  };

  const handleDelete = (itemId: string, categoryId: string) => {
    if (!budget) return;

    const updatedBudget = BudgetService.deleteBudgetItem(budget, categoryId, itemId);
    setBudget(updatedBudget);
  };

  const handleViewDocument = () => {
    if (!budget) return;
    const doc = viewBudgetDocument(budget);
    window.open(doc.output('bloburl'));
  };

  const handleDownloadDocument = () => {
    if (!budget) return;
    downloadBudgetDocument(budget);
  };

  const handleAddSave = (type: 'category' | 'item', data: BudgetCategory | BudgetItem) => {
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <BudgetHeader
        activeWedding={activeWedding}
        onAddCategory={addNewCategory}
        onAddItem={addNewItem}
        onViewDocument={handleViewDocument}
        onDownloadDocument={handleDownloadDocument}
      />

      {!activeWedding && (
        <BudgetEmptyState message="Por favor, selecione um casamento para visualizar o orçamento." />
      )}

      {activeWedding && !budget && (
        <BudgetEmptyState
          message="Nenhum orçamento encontrado para este casamento."
          actionLabel="Criar Orçamento"
          onAction={addNewCategory}
        />
      )}

      {activeWedding && budget && (
        <>
          <BudgetCards budget={budget} />

          <BudgetCategoryTabs
            budget={budget}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onEdit={handleEditClick}
            onCategoryEdit={handleCategoryEditClick}
            onView={handleViewDocument}
            onDownload={handleDownloadDocument}
            onDelete={handleDelete}
          />

          <BudgetNotes notes={budget.notes} />
        </>
      )}

      <BudgetAddDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dialogType={dialogType}
        budget={budget}
        onSave={handleAddSave}
      />

      <BudgetDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        selectedItem={selectedItem}
        selectedCategory={selectedCategory}
        onSave={handleEditSave}
        setSelectedItem={setSelectedItem}
        setSelectedCategory={setSelectedCategory}
        budget={budget}
      />
    </div>
  );
};

export default BudgetPage;
