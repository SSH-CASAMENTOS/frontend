import { Wedding } from '@/types';
import api from '../../config/api';

export async function postWedding(weddingBody: Wedding): Promise<Wedding> {
  return api
    .post(`weddings`, weddingBody)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao criar casamento`, err);
      throw err;
    });
}
