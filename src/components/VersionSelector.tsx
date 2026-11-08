import { useContext, useState } from "react";
import { BookContext } from "@/context/BooksContext";
import { FAMILY_LABELS, Family } from "@/types/Book";

const FIXED_LANGUAGES = [
  { id: "es", label: "ES" },
  { id: "en", label: "EN" },
];

const VersionSelector = () => {

  const { languages, selectedLanguages, toggleLanguage, family, setFamily, unresolved, versions } =
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

  const extra = selectedLanguages.filter((tag) => !FIXED_LANGUAGES.some((f) => f.id === tag));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "10px" }}>
      <div style={{ display: "flex", gap: "5px" }}>
        {(Object.keys(FAMILY_LABELS) as Family[]).map((f) => (
          <button
            key={f}
            onClick={() => setFamily(f)}
            style={{ fontWeight: family === f ? "bold" : "normal", textDecoration: family === f ? "underline" : "none" }}
          >
            {FAMILY_LABELS[f]}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {FIXED_LANGUAGES.map((l) => (
          <label key={l.id}>
            <input
              type="checkbox"
              checked={selectedLanguages.includes(l.id)}
              onChange={() => toggleLanguage(l.id)}
            />
            {" "}{l.label}
          </label>
        ))}
      </div>

      {extra.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {extra.map((tag) => (
            <button key={tag} onClick={() => toggleLanguage(tag)}>{labelOf(tag)} ✕</button>
          ))}
        </div>
      )}

      <input
        type="search"
        placeholder="Buscar otro idioma…"
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

      {unresolved.length > 0 && (
        <>
          <small>Sin {FAMILY_LABELS[family]} disponible en: {unresolved.map(labelOf).join(", ")}</small>
          <details>
            <summary><small>Ver versiones disponibles</small></summary>
            {selectedLanguages.map((lang) => {
              const list = versions.filter((v) => v.language_tag === lang);
              return (
                <div key={lang}>
                  <small><b>{labelOf(lang)}</b> ({list.length})</small>
                  <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {list.map((v) => <div key={v.id}><small>{v.search}</small></div>)}
                  </div>
                </div>
              );
            })}
          </details>
        </>
      )}
    </div>
  );
};
export default VersionSelector;
