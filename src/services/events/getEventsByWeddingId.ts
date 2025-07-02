import { Event } from "@/types";
import api from "../../config/api";

export async function getEventsByWeddingId(weddingId: string): Promise<Event[]> {
  return api
    .get(`events/wedding/${weddingId}`) 
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao buscar eventos pelo id do casamento ${weddingId}`, err);
      throw err;
    });
}
