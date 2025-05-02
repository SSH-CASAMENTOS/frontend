import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatters';
import { Budget } from '@/types';
import { CreditCard, CheckCircle, Clock } from 'lucide-react';

interface BudgetCardsProps {
  budget: Budget;
}

const BudgetCards: React.FC<BudgetCardsProps> = ({ budget }) => {
  const totalPaid = budget.categories.reduce(
    (sum, category) =>
      sum +
      category.items
        .filter((item) => item.isPaid)
        .reduce((itemSum, item) => itemSum + item.amount, 0),
    0
  );

  const totalPending = budget.categories.reduce(
    (sum, category) =>
      sum +
      category.items
        .filter((item) => !item.isPaid)
        .reduce((itemSum, item) => itemSum + item.amount, 0),
    0
  );

  const percentagePaid =
    budget.totalAmount > 0 ? Math.round((totalPaid / budget.totalAmount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-primary" />
            Total do Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{formatCurrency(budget.totalAmount)}</p>
          <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${percentagePaid}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {percentagePaid}% do orçamento utilizado
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-100/50 to-green-100/20 dark:from-green-900/20 dark:to-green-800/10 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Total Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {budget.totalAmount > 0 ? Math.round((totalPaid / budget.totalAmount) * 100) : 0}% do
            orçamento total
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-100/50 to-amber-100/20 dark:from-amber-900/20 dark:to-amber-800/10 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2 text-amber-600" />
            Total Pendente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {budget.totalAmount > 0 ? Math.round((totalPending / budget.totalAmount) * 100) : 0}% do
            orçamento total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetCards;
