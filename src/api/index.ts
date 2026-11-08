import axios from "axios";
import { BibleVersion, Book, Canon, Language, Verse } from "@/types/Book";
import { parseVerses } from "@/utils/parsePassage";

const client = axios.create({
  baseURL: "https://api.youversion.com",
  headers: { "X-YVP-App-Key": import.meta.env.VITE_YVP_APP_KEY },
});

interface Page<T> {
  data?: T[];
  items?: T[];
  next_page_token?: string | null;
  nextPageToken?: string | null;
  next_page?: string | null;
}

const MAX_PAGES = 50;

const getAll = async <T>(path: string, params: Record<string, unknown> = {}): Promise<T[]> => {
  const items: T[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const { data } = await client.get<Page<T>>(path, { params: { ...params, page_token: pageToken } });
    items.push(...(data.data ?? data.items ?? []));
    const next = data.next_page_token ?? data.nextPageToken ?? data.next_page;
    if (!next || next === pageToken) break;
    pageToken = next;
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

const getVersionsOfLanguage = async (lang: string): Promise<BibleVersion[]> => {
  const params = { language_ranges: [lang] };
  let raw: RawVersion[];
  try {
    raw = await getAll<RawVersion>("/v1/bibles", { ...params, page_size: 100 });
  } catch {
    raw = await getAll<RawVersion>("/v1/bibles", params);
  }
  if (raw[0]) console.debug(`[YouVersion] ${lang}: ${raw.length} versiones; ejemplo:`, raw[0]);
  return raw.map((v) => ({
    id: v.id,
    title: v.title,
    label: v.localized_abbreviation ?? v.abbreviation ?? v.title,
    language_tag: lang,
    search: [v.title, v.abbreviation, v.localized_abbreviation].filter(Boolean).join(" | "),
  }));
};

export const getVersions = async (languageTags: string[]): Promise<BibleVersion[]> => {
  const lists = await Promise.all(languageTags.map((lang) => getVersionsOfLanguage(lang).catch(() => [])));
  return lists.flat();
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
