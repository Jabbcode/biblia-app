export interface ResponseBook {
  names: string[];
  abrev: string;
  chapters: number;
  testament: string;
}

export interface Book {
  names: string[];
  abrev: string;
  chapters: number;
  testament: string;
}

export interface Verse {
  verse: string;
  number: number;
  study?: string;
  id: number;
}

export interface Chapter {
  testament: string;
  name: string;
  num_chapters: number;
  chapter: number;
  vers: Verse[];
}

export type BookState = {
  books: Book[];
};
