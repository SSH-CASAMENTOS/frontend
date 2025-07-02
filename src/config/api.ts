import axios, { AxiosInstance } from "axios";

type SignOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/",
}) as APIInstanceProps;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => {
      return response;
    },
    (requestError) => {
      if (requestError?.response?.status === 401) {
        signOut();
      }

      if (requestError.response?.data?.messages) {
        return Promise.reject(new Error(requestError.response.data.messages));
      }
      
      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export default api;
