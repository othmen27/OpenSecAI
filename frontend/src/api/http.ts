import ky from "ky";

export const http = ky.create({
  prefix: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  credentials: "include",
});