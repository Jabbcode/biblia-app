import { ResponseBook } from "@/types/Book";
import axios from "axios";

export const getBooks = async (testament: string = "") => {
  return await axios.get<ResponseBook[]>(
    `${import.meta.env.VITE_BASE_URL_API}/books/${testament}`
  );
};

export const getVers = async (book: string, chapter: number) => {
  return await axios.get(
    `${import.meta.env.VITE_BASE_URL_API}/read/rv1960/${book}/${chapter}`
  );
};
