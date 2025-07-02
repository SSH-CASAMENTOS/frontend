import { User } from "@/types/user";
import api from "../../config/api";

export async function getUserById(userId: string): Promise<User> {
  return api
    .get(`users/${userId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao buscar usuário pelo id`, err);
      throw err;
    });
}
