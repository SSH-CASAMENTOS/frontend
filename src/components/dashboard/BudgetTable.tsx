import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/lib/categoryIcons';

interface BudgetTableProps {
  data: {
    name: string;
    value: number;
    color: string;
    icon?: string;
  }[];
  className?: string;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ data, className }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-shadow', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle>Distribuição do Orçamento</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3">Categoria</th>
                <th className="text-right py-2 px-3">Valor</th>
                <th className="text-right py-2 px-3">Percentual</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const IconComponent = getCategoryIcon(item.name);
                const percentage = (item.value / total) * 100;

                return (
                  <tr
                    key={index}
                    className="border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        {IconComponent && (
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: item.color + '40' }}
                          >
                            <IconComponent className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                        )}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right">{item.value}</td>
                    <td className="py-2 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {formatPercentage(percentage)}
                        <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
