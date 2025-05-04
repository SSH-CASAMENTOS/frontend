import React, { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Budget, BudgetCategory } from '@/types';
import BudgetTable from './BudgetTable';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BudgetService } from '@/services/BudgetService';
import { DocumentService } from '@/services/DocumentService';

interface BudgetCategoryTabsProps {
  budget: Budget;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  onEdit: (item: { id: string; name: string }, categoryId: string) => void;
  onCategoryEdit: (category: BudgetCategory) => void;
  onView: (budget: Budget) => void;
  onDownload: (budget: Budget) => void;
  onDelete: (itemId: string, categoryId: string) => void;
}

const BudgetCategoryTabs: React.FC<BudgetCategoryTabsProps> = ({
  budget,
  activeCategory,
  setActiveCategory,
  onEdit,
  onCategoryEdit,
  onView,
  onDownload,
  onDelete,
}) => {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const filteredCategories = budget.categories.filter(
    (category) => activeCategory === 'all' || category.id === activeCategory
  );

  const handleCategoryEditClick = useCallback(
    (e: React.MouseEvent, category: BudgetCategory) => {
      e.stopPropagation();
      setEditingCategoryId(category.id);
      onCategoryEdit(category);
    },
    [onCategoryEdit]
  );

  return (
    <Tabs
      defaultValue="all"
      value={activeCategory}
      onValueChange={(value) => {
        setEditingCategoryId(null);
        setActiveCategory(value);
      }}
    >
      <div className="flex items-center justify-between overflow-x-auto">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all">Todas as Categorias</TabsTrigger>
          {budget.categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <TabsTrigger
                value={category.id}
                className="relative pr-8"
                onClick={() => setEditingCategoryId(null)}
              >
                {category.name}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 opacity-70 hover:opacity-100"
                  onClick={(e) => handleCategoryEditClick(e, category)}
                  disabled={editingCategoryId === category.id}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TabsTrigger>
            </div>
          ))}
        </TabsList>
      </div>

      <TabsContent value={activeCategory} className="mt-4">
        <Card>
          <CardContent className="pt-6">
            <BudgetTable
              budget={{
                ...budget,
                categories: filteredCategories || [],
              }}
              onEdit={onEdit}
              onView={(b) => {
                setEditingCategoryId(null);
                onView(b);
              }}
              onDownload={(b) => {
                setEditingCategoryId(null);
                onDownload(b);
              }}
              onDelete={(itemId, categoryId) => {
                setEditingCategoryId(null);
                onDelete(itemId, categoryId);
              }}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default React.memo(BudgetCategoryTabs);
