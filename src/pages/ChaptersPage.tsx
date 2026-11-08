import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookContext } from "@/context/BooksContext";

const ChaptersPage = () => {

  const params = useParams()
  const navigate = useNavigate()
  const { books } = useContext(BookContext);

  const book = books.find((b) => b.id === params.book);

  return (
    <div>
      <h1>{book?.title ?? params.book}</h1>
      {
        book && (
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {
              Array.from({ length: book.chapters }, (_, index) => (
                <button key={index} onClick={() => navigate(`/chapters/${book.id}/${index + 1}`)}>
                  {index + 1}
                </button>
              ))
            }
          </ul>
        )
      }
    </div>
  )
};
export default ChaptersPage;
