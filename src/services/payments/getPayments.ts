import { Payment } from '@/types';
import api from '../../config/api';

export async function getPayments(): Promise<Payment[]> {
  return api
    .get(`payments`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao buscar pagamentos`, err);
      throw err;
    });
}
