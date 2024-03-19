import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { BookContext } from "@/context/BooksContext";
import { Book } from "@/types/Book";

const Sidebar = () => {

  const navigate = useNavigate()
  const { books, getChapters } = useContext(BookContext);

  const handleChapters = (book: Book) => {
    getChapters(book)
    navigate(`/chapters/${book.names[0]}`)
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}
    >
      {
        books.map((book: Book, index: number) => (
          <div key={index}>
            <button
              className="button"
              onClick={() => handleChapters(book)}
            >
              {book.names[0]}
            </button>
          </div>
        ))}
    </div>
  )
};
export default Sidebar;
