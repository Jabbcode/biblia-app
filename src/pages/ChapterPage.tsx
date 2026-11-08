import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookContext } from "@/context/BooksContext";
import { getChapterVerses } from "@/api";
import { BibleVersion, Verse } from "@/types/Book";

const ChapterPage = () => {

  const { book, chapter } = useParams();
  const { books, versions, selectedVersionIds } = useContext(BookContext);
  const [columns, setColumns] = useState<Record<number, Verse[]>>({});
  const [loading, setLoading] = useState(false);

  const selected = selectedVersionIds
    .map((id) => versions.find((v) => v.id === id))
    .filter((v): v is BibleVersion => v !== undefined);
  const idsKey = selectedVersionIds.join(",");

  useEffect(() => {
    if (!book || !chapter || selectedVersionIds.length === 0) return;
    let cancelled = false;
    setLoading(true);
    Promise.all(
      selectedVersionIds.map(async (id) => [id, await getChapterVerses(id, book, chapter).catch(() => [])] as const)
    ).then((entries) => {
      if (cancelled) return;
      setColumns(Object.fromEntries(entries));
      setLoading(false);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapter, idsKey]);

  const numbers = [...new Set(selectedVersionIds.flatMap((id) => (columns[id] ?? []).map((v) => v.number)))]
    .sort((a, b) => a - b);

  const bookTitle = books.find((b) => b.id === book)?.title ?? book;

  return (
    <div>
      <h1>{bookTitle} - {chapter}</h1>
      {loading && <p>Cargando…</p>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(selected.length, 1)}, 1fr)`, gap: "1rem" }}>
        {selected.map((v) => <h3 key={v.id}>{v.label}</h3>)}
        {numbers.map((n) => selected.map((v) => {
          const verse = (columns[v.id] ?? []).find((x) => x.number === n);
          return (
            <p key={`${n}-${v.id}`} style={{ margin: 0, paddingBottom: "0.5rem" }}>
              {verse ? `${n > 0 ? `${n} - ` : ""}${verse.text}` : ""}
            </p>
          );
        }))}
      </div>
    </div>
  );
};
export default ChapterPage;
