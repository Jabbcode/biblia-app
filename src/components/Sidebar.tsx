import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { BookContext } from "@/context/BooksContext";

const Sidebar = () => {

  const navigate = useNavigate()
  const { books } = useContext(BookContext);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    }}
    >
      {
        books.map((book) => (
          <div key={book.id}>
            <button
              className="button"
              onClick={() => navigate(`/chapters/${book.id}`)}
            >
              {book.title}
            </button>
          </div>
        ))}
    </div>
  )
};
export default Sidebar;
