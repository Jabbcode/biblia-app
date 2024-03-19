import { useContext } from "react";
import { BookContext } from "@/context/BooksContext";
import { useNavigate } from "react-router-dom";

const Filters = () => {

  const navigate = useNavigate()
  const { handleBooks } = useContext(BookContext);

  const resetView = (testament: string) => {
    handleBooks(testament);
    navigate("/")
  }

  return (
    <div style={{ display: "flex", paddingBottom: "10px", gap: "5px" }}>
      <button onClick={() => resetView("")}>Todos</button>
      <button onClick={() => resetView("oldTestament")}>Antiguo Testamento</button>
      <button onClick={() => resetView("newTestament")}>Nuevo Testamento</button>
    </div>
  );
};
export default Filters;
