import { useContext } from "react";
import { BookContext } from "@/context/BooksContext";

const VersionSelector = () => {

  const { languages, selectedLanguages, toggleLanguage, versions, selectedVersionIds, toggleVersion } =
    useContext(BookContext);

  const labelOf = (tag: string) => languages.find((l) => l.id === tag)?.label ?? tag;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
        {selectedLanguages.map((tag) => (
          <button key={tag} onClick={() => toggleLanguage(tag)}>{labelOf(tag)} ✕</button>
        ))}
      </div>

      <select
        value=""
        onChange={(e) => e.target.value && toggleLanguage(e.target.value)}
      >
        <option value="">Añadir idioma…</option>
        {languages
          .filter((l) => !selectedLanguages.includes(l.id))
          .map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
      </select>

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
