export type Canon = "old_testament" | "new_testament";

export interface Language {
  id: string;
  label: string;
}

export interface BibleVersion {
  id: number;
  title: string;
  label: string;
  language_tag: string;
}

export interface Book {
  id: string;
  title: string;
  chapters: number;
}

export interface Verse {
  number: number;
  text: string;
}
