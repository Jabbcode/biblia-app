import { useContext, useState } from "react";
import { BookContext } from "@/context/BooksContext";

const VersionSelector = () => {

  const { languages, selectedLanguages, toggleLanguage, versions, selectedVersionIds, toggleVersion } =
    useContext(BookContext);

  const [query, setQuery] = useState("");

  const labelOf = (tag: string) => languages.find((l) => l.id === tag)?.label ?? tag;

  const normalize = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const q = normalize(query.trim());
  const matches = q
    ? languages
        .filter((l) => !selectedLanguages.includes(l.id) && normalize(`${l.label} ${l.id}`).includes(q))
        .slice(0, 50)
    : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {selectedLanguages.map((tag) => (
          <button key={tag} onClick={() => toggleLanguage(tag)}>{labelOf(tag)} ✕</button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Buscar idioma…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matches.length > 0 && (
        <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px" }}>
          {matches.map((l) => (
            <button
              key={l.id}
              style={{ textAlign: "left" }}
              onClick={() => { toggleLanguage(l.id); setQuery(""); }}
            >
              {l.label} <small>({l.id})</small>
            </button>
          ))}
        </div>
      )}

      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {versions.map((v) => (
          <label key={v.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedVersionIds.includes(v.id)}
              onChange={() => toggleVersion(v.id)}
            />
            {" "}{v.label} <small>({v.language_tag})</small>
          </label>
        ))}
      </div>
    </div>
  );
};
export default VersionSelector;
