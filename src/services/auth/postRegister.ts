import { User, CreateUserDTO } from "@/types/user";
import api from "../../config/api";

export async function postRegister(registerBody: CreateUserDTO): Promise<User> {
  return api
    .post(`users`, registerBody) 
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao tentar criar um usuário`, err);
      throw err;
    });
}
