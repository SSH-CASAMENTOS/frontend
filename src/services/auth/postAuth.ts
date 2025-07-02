import axios from 'axios';

interface PostAuthRequestInterface {
  email: string;
  password: string;
}

interface PostAuthResponseInterface {
  access_token: string;
}
export async function postAuth(
  authBody: PostAuthRequestInterface
): Promise<PostAuthResponseInterface> {
  return axios
    .post(`${import.meta.env.VITE_API_URL}/auth/sign-in`, authBody)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`Erro ao tentar fazer login`, err);
      throw err;
    });
}
