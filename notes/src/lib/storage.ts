import { Note, Notebook, Tag } from '../types';

const STORAGE_KEYS = {
  NOTES: 'notes_data',
  NOTEBOOKS: 'notebooks_data',
  TAGS: 'tags_data',
} as const;

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to localStorage: ${key}`, error);
  }
}

export const storage = {
  generateId,

  getNotes(): Note[] {
    return getItem<Note[]>(STORAGE_KEYS.NOTES, []);
  },

  saveNotes(notes: Note[]): void {
    setItem(STORAGE_KEYS.NOTES, notes);
  },

  getNotebooks(): Notebook[] {
    return getItem<Notebook[]>(STORAGE_KEYS.NOTEBOOKS, []);
  },

  saveNotebooks(notebooks: Notebook[]): void {
    setItem(STORAGE_KEYS.NOTEBOOKS, notebooks);
  },

  getTags(): Tag[] {
    return getItem<Tag[]>(STORAGE_KEYS.TAGS, []);
  },

  saveTags(tags: Tag[]): void {
    setItem(STORAGE_KEYS.TAGS, tags);
  },

  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.NOTEBOOKS);
    localStorage.removeItem(STORAGE_KEYS.TAGS);
  },
};

export default storage;
