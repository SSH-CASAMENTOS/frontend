import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetNotesProps {
  notes: string | undefined;
}

const BudgetNotes: React.FC<BudgetNotesProps> = ({ notes }) => {
  if (!notes) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Observações</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{notes}</p>
      </CardContent>
    </Card>
  );
};

export default BudgetNotes;
