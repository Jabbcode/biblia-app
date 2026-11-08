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
  selectedVersions: [],
  unresolved: [],
};

export const BookContext = createContext(initialState);

const DEFAULT_LANGUAGES = ["es", "en"];

const FAMILY_PATTERNS: Record<Family, Record<string, RegExp[]>> = {
  rvr60: {
    es: [/rvr\s?(19)?60|reina.?valera.*1960/i],
    en: [/^kjv$/i, /king james/i],
  },
  nvi: {
    es: [/^nvi$/i, /nueva versi[oó]n internacional/i],
    en: [/^niv$/i, /new international version/i],
  },
};

const inLanguage = (v: BibleVersion, lang: string) => {
  const tag = v.language_tag.toLowerCase();
  return tag === lang || tag.startsWith(`${lang}-`);
};

const pickVersion = (lang: string, family: Family, versions: BibleVersion[]): BibleVersion | undefined => {
  const candidates = versions.filter((v) => inLanguage(v, lang));
  const patterns = FAMILY_PATTERNS[family][lang];
  if (!patterns) return candidates[0];
  for (const re of patterns) {
    const match = candidates.find((v) => re.test(v.label) || re.test(v.title));
    if (match) return match;
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
        selectedVersions,
        unresolved,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};
