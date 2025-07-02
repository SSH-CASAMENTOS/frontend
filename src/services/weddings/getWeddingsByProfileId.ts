import { Wedding } from "@/types";
import api from "../../config/api";

export async function getWeddingsByProfileId(profileId: string): Promise<Wedding[]> {
  return api
    .get(`weddings/profile/${profileId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao buscar casamentos`, err);
      throw err;
    });
}
