import { createContext, useEffect, useMemo, useState } from "react";
import { BibleVersion, Book, Canon, Family, Language } from "@/types/Book";
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
  family: Family;
  setFamily: (family: Family) => void;
  versions: BibleVersion[];
  selectedVersions: BibleVersion[];
  unresolved: string[];
}

const initialState: BookContextProps = {
  books: [],
  setCanon: () => undefined,
  languages: [],
  selectedLanguages: [],
  toggleLanguage: () => undefined,
  family: "rvr60",
  setFamily: () => undefined,
  versions: [],
  selectedVersions: [],
  unresolved: [],
};

export const BookContext = createContext(initialState);

const DEFAULT_LANGUAGES = ["es", "en"];

const FAMILY_PATTERNS: Record<Family, Record<string, RegExp[]>> = {
  rvr60: {
    es: [/reina[\s-]?valera[^|]*1960|rvr\s?-?(19)?60/i],
    en: [/\bkjv\b/i, /king james/i],
  },
  nvi: {
    es: [/\bnvi\b/i, /nueva versi[oó]n internacional/i],
    en: [/\bniv\b/i, /new international version/i],
  },
};

const pickVersion = (lang: string, family: Family, versions: BibleVersion[]): BibleVersion | undefined => {
  const candidates = versions.filter((v) => v.language_tag === lang);
  const patterns = FAMILY_PATTERNS[family][lang];
  if (!patterns) return candidates[0];
  for (const re of patterns) {
    const matches = candidates.filter((v) => re.test(v.search));
    if (matches.length > 0) return matches.sort((a, b) => a.search.length - b.search.length)[0];
  }
  return undefined;
};

export const BookProvider = ({ children }: BookProviderProps) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [family, setFamily] = useState<Family>("rvr60");
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [canon, setCanon] = useState<Canon | undefined>(undefined);

  useEffect(() => {
    getLanguages().then(setLanguages).catch(console.error);
  }, []);

  useEffect(() => {
    getVersions(selectedLanguages).then(setVersions).catch(console.error);
  }, [selectedLanguages]);

  const resolved = useMemo(
    () => selectedLanguages.map((lang) => ({ lang, version: pickVersion(lang, family, versions) })),
    [selectedLanguages, family, versions]
  );
  const selectedVersions = useMemo(
    () => resolved.flatMap((r) => (r.version ? [r.version] : [])),
    [resolved]
  );
  const unresolved = versions.length === 0 ? [] : resolved.filter((r) => !r.version).map((r) => r.lang);

  const mainVersionId = selectedVersions[0]?.id;

  useEffect(() => {
    if (!mainVersionId) return;
    getBooks(mainVersionId, canon).then(setBooks).catch(console.error);
  }, [mainVersionId, canon]);

  const toggleLanguage = (tag: string) =>
    setSelectedLanguages((list) => (list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]));

  return (
    <BookContext.Provider
      value={{
        books,
        canon,
        setCanon,
        languages,
        selectedLanguages,
        toggleLanguage,
        family,
        setFamily,
        versions,
        selectedVersions,
        unresolved,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
