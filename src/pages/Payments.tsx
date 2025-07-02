import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Payment } from '@/types';
import { getPayments } from '@/services/payments/getPayments';
import { formatCurrency } from '@/lib/formatters';
import {
  editPayment,
  markAsPaid,
  deletePayment,
  createPayment,
  viewPaymentDocument,
  downloadPaymentDocument,
} from '@/utils/paymentActions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar,
  CreditCard,
  Plus,
  Search,
  Check,
  Edit,
  Trash,
  FileText,
  Download,
  ArrowUpDown,
} from 'lucide-react';
import SignatureForm from '@/components/signature/SignatureForm';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PaymentsPage = () => {
  const { activeWedding } = useAppContext();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Payment;
    direction: 'asc' | 'desc';
  }>({
    key: 'dueDate',
    direction: 'asc',
  });
  const [formData, setFormData] = useState({
    title: '',
    amount: 0,
    dueDate: '',
    category: '',
    recipient: '',
    method: '',
    notes: '',
  });

  useEffect(() => {
    if (activeWedding) {
      const handleGetWeddingPayments = async () => {
        const weddingPayments = await getPayments();
        const updatedPayments = weddingPayments.map((payment) => {
          if (payment.status === 'pending' && isAfter(new Date(), new Date(payment.dueDate))) {
            return { ...payment, status: 'overdue' as const };
          }
          return payment;
        });

        setPayments(updatedPayments);
      };
      handleGetWeddingPayments();
    } else {
      setPayments([]);
    }
  }, [activeWedding]);

  const handleSort = (key: keyof Payment) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter((payment) => payment.status === 'pending' || payment.status === 'overdue')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const filteredPayments = payments
    .filter((payment) => {
      if (activeTab === 'all') return true;
      return payment.status === activeTab;
    })
    .filter(
      (payment) =>
        payment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (payment.category && payment.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const getStatusBadge = (payment: Payment) => {
    const today = new Date();

    switch (payment.status) {
      case 'paid':
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          >
            Pago
          </Badge>
        );
      case 'overdue':
        return (
          <Badge
            variant="outline"
            className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          >
            Atrasado
          </Badge>
        );
      case 'pending': {
        const dueDate = new Date(payment.dueDate);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(today.getDate() + 7);

        if (isBefore(dueDate, sevenDaysFromNow)) {
          return (
            <Badge
              variant="outline"
              className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200"
            >
              Vence em breve
            </Badge>
          );
        }

        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
          >
            Pendente
          </Badge>
        );
      }
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace('payment', '').toLowerCase()]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreatePayment = () => {
    if (!activeWedding) return;

    const newPayment = createPayment({
      weddingId: activeWedding.id,
      title: formData.title,
      amount: Number(formData.amount),
      dueDate: new Date(formData.dueDate),
      recipient: formData.recipient,
      category: formData.category,
      method: formData.method,
      notes: formData.notes,
      status: 'pending',
    });

    setPayments((prev) => [...prev, newPayment]);
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      amount: 0,
      dueDate: '',
      category: '',
      recipient: '',
      method: '',
      notes: '',
    });
  };

  const handleEditPayment = () => {
    if (!selectedPayment) return;

    const updatedPayment = editPayment(selectedPayment, {
      title: formData.title,
      amount: Number(formData.amount),
      dueDate: new Date(formData.dueDate),
      recipient: formData.recipient,
      category: formData.category,
      method: formData.method,
      notes: formData.notes,
    });

    setPayments((prev) => prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p)));

    setIsEditDialogOpen(false);
    setSelectedPayment(null);
  };

  const handleDeletePayment = (payment: Payment) => {
    deletePayment(payment);
    setPayments((prev) => prev.filter((p) => p.id !== payment.id));
  };

  const handleMarkAsPaid = (payment: Payment) => {
    const updatedPayment = markAsPaid(payment);
    setPayments((prev) => prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p)));
  };

  const handleViewDocument = (payment: Payment) => {
    const doc = viewPaymentDocument(payment);
    window.open(doc.output('bloburl'));
  };

  const handleDownloadDocument = (payment: Payment) => {
    downloadPaymentDocument(payment);
  };

  const handleEditClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      title: payment.title,
      amount: payment.amount,
      dueDate: format(new Date(payment.dueDate), 'yyyy-MM-dd'),
      category: payment.category || '',
      recipient: payment.recipient,
      method: payment.method || '',
      notes: payment.notes || '',
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Pagamentos</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={!activeWedding}>
          <Plus className="h-4 w-4 mr-1" /> Novo Pagamento
        </Button>
      </div>

      {!activeWedding ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              Por favor, selecione um casamento para visualizar os pagamentos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(paidAmount)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Pendente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {formatCurrency(pendingAmount)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as typeof activeTab)}
            >
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="paid">Pagos</TabsTrigger>
                <TabsTrigger value="overdue">Atrasados</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pagamentos..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('title')}
                      >
                        Título
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('category')}
                      >
                        Categoria
                      </div>
                    </TableHead>
                    <TableHead>
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleSort('dueDate')}
                      >
                        Vencimento
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">
                      <div
                        className="flex items-center justify-end cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        Valor
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Nenhum pagamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.title}</TableCell>
                        <TableCell>{payment.recipient}</TableCell>
                        <TableCell>{payment.category || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                            {format(new Date(payment.dueDate), 'dd MMM yyyy', {
                              locale: ptBR,
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Ações
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditClick(payment)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              {payment.status !== 'paid' && (
                                <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Marcar como Pago
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleViewDocument(payment)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadDocument(payment)}>
                                <Download className="mr-2 h-4 w-4" />
                                Baixar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeletePayment(payment)}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTitle">Título</Label>
              <Input
                id="paymentTitle"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Título do pagamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Valor</Label>
              <div className="relative">
                <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentDueDate">Data de Vencimento</Label>
                <Input
                  id="paymentDueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentCategory">Categoria</Label>
                <Select onValueChange={(value) => handleSelectChange(value, 'category')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buffet">Buffet</SelectItem>
                    <SelectItem value="decoracao">Decoração</SelectItem>
                    <SelectItem value="fotografia">Fotografia</SelectItem>
                    <SelectItem value="musica">Música</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentRecipient">Destinatário</Label>
              <Input
                id="paymentRecipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="Nome do destinatário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Select onValueChange={(value) => handleSelectChange(value, 'method')}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="card">Cartão de Crédito</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Observações (opcional)</Label>
              <Input
                id="paymentNotes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Observações sobre o pagamento"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePayment}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Pagamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTitle">Título</Label>
              <Input
                id="paymentTitle"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Título do pagamento"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Valor</Label>
              <div className="relative">
                <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="0,00"
                  className="pl-8"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentDueDate">Data de Vencimento</Label>
                <Input
                  id="paymentDueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentCategory">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange(value, 'category')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buffet">Buffet</SelectItem>
                    <SelectItem value="decoracao">Decoração</SelectItem>
                    <SelectItem value="fotografia">Fotografia</SelectItem>
                    <SelectItem value="musica">Música</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentRecipient">Destinatário</Label>
              <Input
                id="paymentRecipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="Nome do destinatário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Método de Pagamento</Label>
              <Select
                value={formData.method}
                onValueChange={(value) => handleSelectChange(value, 'method')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="card">Cartão de Crédito</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Observações (opcional)</Label>
              <Input
                id="paymentNotes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Observações sobre o pagamento"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditPayment}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Assinatura Digital</h2>
        <SignatureForm />
      </div>
    </div>
  );
};

export default PaymentsPage;
