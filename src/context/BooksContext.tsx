import { createContext, useEffect, useState } from "react";
import { BibleVersion, Book, Canon, Language } from "@/types/Book";
import { getBooks, getLanguages, getVersions } from "@/api";

interface BookProviderProps {
  children: React.ReactNode;
}

interface BookContextProps {
  books: Book[];
  canon?: Canon;
  setCanon: (canon?: Canon) => void;
  languages: Language[];
  selectedLanguages: string[];
  toggleLanguage: (tag: string) => void;
  versions: BibleVersion[];
  selectedVersionIds: number[];
  toggleVersion: (id: number) => void;
}

const initialState: BookContextProps = {
  books: [],
  setCanon: () => undefined,
  languages: [],
  selectedLanguages: [],
  toggleLanguage: () => undefined,
  versions: [],
  selectedVersionIds: [],
  toggleVersion: () => undefined,
};

export const BookContext = createContext(initialState);

const DEFAULT_LANGUAGES = ["es", "en"];
const DEFAULT_VERSION_PATTERNS = [/rvr\s?(19)?60|reina.?valera.*1960/i, /\bNVI\b|nueva versi[oó]n internacional/i];

const pickDefaultVersions = (versions: BibleVersion[]): number[] => {
  const spanish = versions.filter((v) => v.language_tag.startsWith("es"));
  const picked = DEFAULT_VERSION_PATTERNS.map((re) =>
    spanish.find((v) => re.test(v.label) || re.test(v.title))
  ).filter((v): v is BibleVersion => Boolean(v));
  const ids = picked.map((v) => v.id);
  return ids.length > 0 ? ids : versions.slice(0, 2).map((v) => v.id);
};

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

export const BookProvider = ({ children }: BookProviderProps) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [selectedVersionIds, setSelectedVersionIds] = useState<number[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [canon, setCanon] = useState<Canon | undefined>(undefined);

  useEffect(() => {
    getLanguages().then(setLanguages).catch(console.error);
  }, []);

  useEffect(() => {
    getVersions(selectedLanguages)
      .then((list) => {
        setVersions(list);
        setSelectedVersionIds((current) => {
          const valid = current.filter((id) => list.some((v) => v.id === id));
          return valid.length > 0 ? valid : pickDefaultVersions(list);
        });
      })
      .catch(console.error);
  }, [selectedLanguages]);

  const mainVersionId = selectedVersionIds[0];

  useEffect(() => {
    if (!mainVersionId) return;
    getBooks(mainVersionId, canon).then(setBooks).catch(console.error);
  }, [mainVersionId, canon]);

  return (
    <BookContext.Provider
      value={{
        books,
        canon,
        setCanon,
        languages,
        selectedLanguages,
        toggleLanguage: (tag) => setSelectedLanguages((l) => toggle(l, tag)),
        versions,
        selectedVersionIds,
        toggleVersion: (id) => setSelectedVersionIds((v) => toggle(v, id)),
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
