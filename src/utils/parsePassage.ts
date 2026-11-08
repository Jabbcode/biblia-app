import { Verse } from "@/types/Book";

const NOISE = ".yv-n, .yv-vlbl, .note, sup";

export const parseVerses = (html: string): Verse[] => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll(NOISE).forEach((el) => el.remove());

  const verses = new Map<number, string>();
  let current = 0;

  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (current) verses.set(current, (verses.get(current) ?? "") + (node.textContent ?? ""));
      return;
    }
    if (node instanceof HTMLElement) {
      const marker = node.classList.contains("yv-v") ? parseInt(node.getAttribute("v") ?? "", 10) : NaN;
      if (!Number.isNaN(marker)) {
        current = marker;
        return;
      }
      node.childNodes.forEach(walk);
    }
  };
  doc.body.childNodes.forEach(walk);

  if (verses.size === 0) {
    const text = (doc.body.textContent ?? "").trim();
    return text ? [{ number: 0, text }] : [];
  }

  return [...verses.entries()]
    .sort(([a], [b]) => a - b)
    .map(([number, text]) => ({ number, text: text.replace(/\s+/g, " ").trim() }));
};
