export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface Notebook {
  id: string;
  name: string;
  description: string;
  coverColor: string;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  notebookId: string;
  tagIds: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
}

export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteInput = Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateNotebookInput = Omit<Notebook, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNotebookInput = Partial<Omit<Notebook, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateTagInput = Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTagInput = Partial<Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>>;
