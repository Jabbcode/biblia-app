import axios from "axios";
import { BibleVersion, Book, Canon, Language, Verse } from "@/types/Book";
import { parseVerses } from "@/utils/parsePassage";

const client = axios.create({
  baseURL: "https://api.youversion.com",
  headers: { "X-YVP-App-Key": import.meta.env.VITE_YVP_APP_KEY },
});

interface Page<T> {
  data: T[];
  next_page_token?: string | null;
}

const MAX_PAGES = 50;

const getAll = async <T>(path: string, params: Record<string, unknown> = {}): Promise<T[]> => {
  const items: T[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await client.get<Page<T>>(path, { params: { ...params, page_token: pageToken } });
    items.push(...(data.data ?? []));
    if (!data.next_page_token) break;
    pageToken = data.next_page_token;
  }
  return items;
};

interface RawLanguage {
  id: string;
  display_names?: Record<string, string>;
}

interface RawVersion {
  id: number;
  title: string;
  abbreviation?: string;
  localized_abbreviation?: string;
  language_tag: string;
}

interface RawBook {
  id: string;
  title?: string;
  full_title?: string;
  chapters?: Array<{ id: string } | string> | number;
}

export const getLanguages = async (): Promise<Language[]> => {
  const raw = await getAll<RawLanguage>("/v1/languages");
  return raw
    .map((l) => ({ id: l.id, label: l.display_names?.[l.id] ?? l.display_names?.en ?? l.id }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const getVersions = async (languageTags: string[]): Promise<BibleVersion[]> => {
  if (languageTags.length === 0) return [];
  const raw = await getAll<RawVersion>("/v1/bibles", { language_ranges: languageTags });
  return raw.map((v) => ({
    id: v.id,
    title: v.title,
    label: v.localized_abbreviation ?? v.abbreviation ?? v.title,
    language_tag: v.language_tag,
  }));
};

const countChapters = (chapters: RawBook["chapters"]): number => {
  if (typeof chapters === "number") return chapters;
  if (!Array.isArray(chapters)) return 0;
  return chapters.filter((c) => /^\d+$/.test(typeof c === "string" ? c : c.id)).length;
};

export const getBooks = async (versionId: number, canon?: Canon): Promise<Book[]> => {
  const raw = await getAll<RawBook>(`/v1/bibles/${versionId}/books`, { canon });
  return raw.map((b) => ({
    id: b.id,
    title: b.title ?? b.full_title ?? b.id,
    chapters: countChapters(b.chapters),
  }));
};

export const getChapterVerses = async (versionId: number, book: string, chapter: string): Promise<Verse[]> => {
  const { data } = await client.get<{ content: string }>(
    `/v1/bibles/${versionId}/passages/${book}.${chapter}`,
    { params: { format: "html", include_headings: false, include_notes: false } }
  );
  return parseVerses(data.content);
};
