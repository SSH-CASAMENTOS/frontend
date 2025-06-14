import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { getCategoryIcon } from '@/lib/categoryIcons';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { TooltipProps } from 'recharts';
import { SectorProps } from 'recharts';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DonutChartProps {
  title: string;
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  className?: string;
  animate?: boolean;
}

const renderActiveShape = (props: SectorProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="white"
        strokeWidth={2}
      />
    </g>
  );
};

export const DonutChart = ({ title, data, className, animate = false }: DonutChartProps) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartConfig = data.reduce(
    (acc, item) => ({
      ...acc,
      [item.name]: {
        theme: { light: item.color, dark: item.color },
        label: item.name,
      },
    }),
    {}
  );

  const handlePieEnter = (_: { name: string; value: number; color: string }, index: number) => {
    setActiveIndex(index);
  };

  const handlePieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className={cn('shadow-sm hover:shadow-md transition-shadow', className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-1 md:p-4">
        <div className={cn('flex flex-col md:flex-row items-center', animate && 'animate-fade-in')}>
          <div className="w-full md:w-3/5 h-60 md:h-64">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex !== null ? [activeIndex] : []}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={animate ? 55 : 60}
                    outerRadius={animate ? 75 : 80}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    animationDuration={animate ? 800 : 0}
                    animationBegin={0}
                    animationEasing="ease-out"
                    onMouseEnter={handlePieEnter}
                    onMouseLeave={handlePieLeave}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="white"
                        strokeWidth={1}
                        className="hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={
                      <CustomTooltipContent
                        formatter={(value) =>
                          `${formatPercentage((value / total) * 100)} (${value})`
                        }
                      />
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="w-full md:w-2/5 mt-4 md:mt-0 md:pl-4">
            <div className="grid grid-cols-1 gap-3">
              {data.map((item, index) => {
                const IconComponent = getCategoryIcon(item.name);
                const percentage = (item.value / total) * 100;

                return (
                  <div
                    key={item.name}
                    className={cn(
                      'flex items-center p-2 rounded-md transition-colors cursor-pointer',
                      activeIndex === index ? 'bg-accent' : 'hover:bg-muted/50'
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div
                      className="h-8 w-8 rounded-full mr-3 flex items-center justify-center"
                      style={{ backgroundColor: item.color + '30' }}
                    >
                      <IconComponent className="h-4 w-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatPercentage(percentage)} ({item.value})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CustomTooltipContent = (props: TooltipProps<number, string>) => {
  const { active, payload, formatter } = props;

  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0];
  const IconComponent = getCategoryIcon(data.name);

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-48">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: data.fill + '30' }}
        >
          <IconComponent className="h-3.5 w-3.5" style={{ color: data.fill }} />
        </div>
        <span className="font-medium">{data.name}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Valor: <span className="font-medium text-foreground">{data.value}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        Percentual:{' '}
        <span className="font-medium text-foreground">
          {formatter ? formatter(data.value, data.name, data, 0, payload) : data.value}
        </span>
      </div>
    </div>
  );
};
