import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080/api",
  baseURL: "https://inventory-4xyq.onrender.com/api",
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error(
        "[API] A requisição expirou. O servidor pode estar iniciando (cold start). Tente novamente."
      );
    } else if (!error.response) {
      console.error(
        "[API] Erro de rede. Não foi possível conectar ao servidor. Verifique sua conexão."
      );
    } else {
      console.error(
        `[API] Erro ${error.response.status}: ${error.response.data?.message ?? error.message}`
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
