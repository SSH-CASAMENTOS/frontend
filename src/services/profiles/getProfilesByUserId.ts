import { Event, Profile } from "@/types";
import api from "../../config/api";

export async function getProfilesByUserId(userId: string): Promise<Profile[]> {
  return api
    .get(`users/${userId}/profiles`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao buscar profiles pelo id do usuario ${userId}`, err);
      throw err;
    });
}
