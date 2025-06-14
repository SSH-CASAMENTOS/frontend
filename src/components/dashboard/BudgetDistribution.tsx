import React, { useState } from 'react';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { BudgetTable } from '@/components/dashboard/BudgetTable';
import { Button } from '@/components/ui/button';
import { ChartPie, Table } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BudgetDistributionProps {
  data: {
    name: string;
    value: number;
    color: string;
    icon?: string;
  }[];
}

export const BudgetDistribution: React.FC<BudgetDistributionProps> = ({ data }) => {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'relative',
              viewMode === 'chart' && 'bg-background text-foreground shadow-sm'
            )}
            onClick={() => setViewMode('chart')}
          >
            <ChartPie className="h-4 w-4 mr-1" />
            <span className="text-xs">Gráfico</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'relative',
              viewMode === 'table' && 'bg-background text-foreground shadow-sm'
            )}
            onClick={() => setViewMode('table')}
          >
            <Table className="h-4 w-4 mr-1" />
            <span className="text-xs">Tabela</span>
          </Button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <DonutChart title="Distribuição do Orçamento" data={data} animate={true} />
      ) : (
        <BudgetTable data={data} />
      )}
    </div>
  );
};
