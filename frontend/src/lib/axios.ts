import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? `http://localhost:8000/api`
      : // `http://localhost:8386/api`
        "/api",
  // withCredentials: true,
});
