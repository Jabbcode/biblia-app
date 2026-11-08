import { useContext } from "react";
import { BookContext } from "@/context/BooksContext";
import { useNavigate } from "react-router-dom";
import { Canon } from "@/types/Book";

const Filters = () => {

  const navigate = useNavigate()
  const { setCanon } = useContext(BookContext);

  const resetView = (canon?: Canon) => {
    setCanon(canon);
    navigate("/")
  }

  return (
    <div style={{ display: "flex", paddingBottom: "10px", gap: "5px" }}>
      <button onClick={() => resetView()}>Todos</button>
      <button onClick={() => resetView("old_testament")}>Antiguo Testamento</button>
      <button onClick={() => resetView("new_testament")}>Nuevo Testamento</button>
    </div>
  );
};
export default Filters;
