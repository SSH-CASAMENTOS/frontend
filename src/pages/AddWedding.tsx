import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/context/AppContext';
import { Wedding } from '@/types';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const addWeddingSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  clientNames: z.string().min(3, 'Os nomes dos clientes são obrigatórios'),
  location: z.string().min(3, 'A localização é obrigatória'),
  budget: z.string().refine(
    (value) => {
      const num = parseFloat(value.replace(/[^0-9]/g, ''));
      return !isNaN(num) && num > 0;
    },
    {
      message: 'O orçamento deve ser um valor positivo',
    }
  ),
  date: z.date({
    required_error: 'A data do casamento é obrigatória',
  }),
});

type AddWeddingFormValues = z.infer<typeof addWeddingSchema>;

const AddWedding: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { availableWeddings } = useAppContext();

  const form = useForm<AddWeddingFormValues>({
    resolver: zodResolver(addWeddingSchema),
    defaultValues: {
      title: '',
      clientNames: '',
      location: '',
      budget: '',
      date: undefined,
    },
  });

  const onSubmit = (values: AddWeddingFormValues) => {
    const budgetValue = parseFloat(values.budget.replace(/[^0-9]/g, '')) / 100;

    const newWedding: Wedding = {
      id: `wedding-${Date.now()}`,
      title: values.title,
      clientNames: values.clientNames,
      location: values.location,
      budget: budgetValue,
      totalPaid: 0,
      date: values.date,
      status: 'upcoming',
    };

    const updatedWeddings = [...availableWeddings, newWedding];
    localStorage.setItem('weddings', JSON.stringify(updatedWeddings));

    toast({
      title: 'Casamento adicionado',
      description: `${values.title} foi criado com sucesso!`,
    });

    navigate('/');
  };

  const formatCurrency = (value: string) => {
    value = value.replace(/\D/g, '');
    if (value === '') return '';

    const valueNumber = parseInt(value, 10) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valueNumber);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Adicionar Novo Casamento</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Casamento Ana e Pedro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomes dos Clientes</FormLabel>
                  <FormControl>
                    <Input placeholder="Ana Silva e Pedro Oliveira" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Casamento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Buffet Jardins, São Paulo - SP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orçamento Total</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="R$ 0,00"
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Casamento</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddWedding;
