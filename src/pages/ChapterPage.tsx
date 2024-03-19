import { BookContext } from "@/context/BooksContext";
import { Verse } from "@/types/Book";
import { useContext } from "react";

const ChapterPage = () => {

  const { chapter } = useContext(BookContext);

  console.log(chapter);

  return (
    <div>
      {
        chapter.vers && (
          <>
            <h1>{chapter.name} - {chapter.chapter}</h1>
            <ul>
              {
                chapter.vers.map((ver: Verse, index: number) => (
                  <>
                    {ver.study && <h2 style={{paddingBottom: "10px"}}>{ver.study}</h2>}
                    <li key={index} style={{ listStyle: "none", paddingBottom: "0.5rem" }}>{index + 1} - {ver.verse}</li>
                  </>
                ))
              }
            </ul>
          </>
        )
      }
    </div>
  );
};
export default ChapterPage;
