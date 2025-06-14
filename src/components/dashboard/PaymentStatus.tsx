import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/formatters';

interface PaymentStatusProps {
  totalBudget: number;
  totalPaid: number;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ totalBudget, totalPaid }) => {
  const percentagePaid = Math.round((totalPaid / totalBudget) * 100) || 0;
  const remaining = totalBudget - totalPaid;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status do Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progresso</span>
            <span className="font-medium">{percentagePaid}%</span>
          </div>
          <Progress value={percentagePaid} className="h-2" />
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Total pago</p>
              <p className="text-lg font-semibold text-primary">{formatCurrency(totalPaid)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restante</p>
              <p className="text-lg font-semibold">{formatCurrency(remaining)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
