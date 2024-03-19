import { createContext, useEffect, useState } from "react";
import { Book, Chapter } from "@/types/Book";
import { getBooks } from "@/api";

interface BookProviderProps {
  children: React.ReactNode;
}

interface BookContextProps {
  books: Book[];
  handleBooks: (testament: string) => void;
  chapters: number[] | null;
  getChapters: (book: Book) => void;
  chapter: Chapter;
  getChapter: (chapter: Chapter) => void;
}

const initialState: BookContextProps = {
  books: [],
  handleBooks: (testament: string) => testament,
  chapters: null,
  getChapters: (book: Book) => book,
  chapter: { testament: "", name: "", num_chapters: 0, chapter: 0, vers: [] },
  getChapter: (chapter: Chapter) => chapter
}

export const BookContext = createContext(initialState)

export const BookProvider = ({ children }: BookProviderProps) => {

  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<number[] | null>(null);
  const [chapter, getChapter] = useState<Chapter>({ testament: "", name: "", num_chapters: 0, chapter: 0, vers: [] });

  const handleBooks = async (testament: string) => {
    const response = await getBooks(testament);
    setBooks(response.data);
  }

  const getChapters = (book: Book) => {
    const newArray = Array.from({ length: book.chapters }) as number[];
    setChapters(newArray);
  }

  useEffect(() => {
    handleBooks("");
  }, []);

  return (
    <BookContext.Provider value={{ books, handleBooks, chapters, getChapters, chapter, getChapter }}>
      {children}
    </BookContext.Provider>
  )
}