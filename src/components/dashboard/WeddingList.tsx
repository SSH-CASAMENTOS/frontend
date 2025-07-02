import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wedding } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface WeddingListProps {
  weddings: Wedding[];
  onSelectWedding: (wedding: Wedding) => void;
}

const statusBadge = (status: Wedding['status']) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200';
    case 'canceled':
      return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200';
    default:
      return '';
  }
};

const statusLabel = (status: Wedding['status']) => {
  switch (status) {
    case 'upcoming':
      return 'Próximo';
    case 'completed':
      return 'Concluído';
    case 'canceled':
      return 'Cancelado';
    default:
      return '';
  }
};

export const WeddingList: React.FC<WeddingListProps> = ({ weddings, onSelectWedding }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWeddings = weddings.filter(
    (wedding) =>
      wedding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wedding.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Casamentos</CardTitle>
          <Link to="/add-wedding" className="hidden md:block">
            <Button variant="outline" size="sm">
              + Novo
            </Button>
          </Link>
        </div>
        <div className="mt-2">
          <Input
            placeholder="Buscar casamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 overflow-auto max-h-[400px] pr-2">
        {filteredWeddings.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Nenhum casamento encontrado</p>
        ) : (
          filteredWeddings.map((wedding) => (
            <div
              key={wedding.id}
              className="flex flex-col md:flex-row md:items-center gap-2 p-3 rounded-md border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => onSelectWedding(wedding)}
            >
              <div className="flex items-center gap-2 flex-grow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-medium text-sm truncate">{wedding.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">
                    {wedding.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <div className="text-xs font-medium bg-background rounded-md py-1 px-2 border">
                  {format(new Date(wedding.date), 'dd MMM yyyy', { locale: ptBR })}
                </div>
                <Badge className={cn(statusBadge(wedding.status), 'ml-auto')} variant="outline">
                  {statusLabel(wedding.status)}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
