import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BookContext } from "@/context/BooksContext";
import { getVers } from "@/api";

const ChaptersPage = () => {

  const params = useParams()
  const navigate = useNavigate()
  const { chapters, getChapter } = useContext(BookContext);

  const handleVers = async (chapter: number) => {
    const response = await getVers(params.book!, chapter)
    getChapter(response.data);
    navigate(`/chapters/${params.book}/${chapter}`)
  }

  return (
    <div>
      <h1>{params.book}</h1>
      {
        chapters && (
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {
              chapters?.map((_, index) => {
                return <button key={index} onClick={() => handleVers(index + 1)}>{index + 1}</button>
              })
            }
          </ul>
        )
      }
    </div>
  )
};
export default ChaptersPage;
