import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const NoWeddingSelected: React.FC = () => {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <p className="text-muted-foreground">
          Por favor, selecione um casamento para visualizar os itens.
        </p>
      </CardContent>
    </Card>
  );
};

export default NoWeddingSelected;
