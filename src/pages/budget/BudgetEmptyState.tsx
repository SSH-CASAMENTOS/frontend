import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BudgetEmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

const BudgetEmptyState: React.FC<BudgetEmptyStateProps> = ({ message, actionLabel, onAction }) => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <p className="text-muted-foreground">{message}</p>
        {actionLabel && onAction && (
          <Button className="mt-4" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetEmptyState;
