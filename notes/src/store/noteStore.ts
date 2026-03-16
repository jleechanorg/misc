import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Note,
  Notebook,
  Tag,
  CreateNoteInput,
  UpdateNoteInput,
  CreateNotebookInput,
  UpdateNotebookInput,
  CreateTagInput,
  UpdateTagInput,
} from '../types';
import storage from '../lib/storage';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

interface NoteStoreState {
  notes: Note[];
  notebooks: Notebook[];
  tags: Tag[];
  isInitialized: boolean;

  initialize: () => void;

  noteActions: {
    createNote: (input: CreateNoteInput) => Note;
    updateNote: (id: string, input: UpdateNoteInput) => Note | undefined;
    deleteNote: (id: string) => boolean;
    getNoteById: (id: string) => Note | undefined;
    getNotesByNotebookId: (notebookId: string) => Note[];
    getNotesByTagId: (tagId: string) => Note[];
    getAllNotes: () => Note[];
    getPinnedNotes: () => Note[];
    getArchivedNotes: () => Note[];
  };

  notebookActions: {
    createNotebook: (input: CreateNotebookInput) => Notebook;
    updateNotebook: (id: string, input: UpdateNotebookInput) => Notebook | undefined;
    deleteNotebook: (id: string) => boolean;
    getNotebookById: (id: string) => Notebook | undefined;
    getAllNotebooks: () => Notebook[];
  };

  tagActions: {
    createTag: (input: CreateTagInput) => Tag;
    updateTag: (id: string, input: UpdateTagInput) => Tag | undefined;
    deleteTag: (id: string) => boolean;
    getTagById: (id: string) => Tag | undefined;
    getAllTags: () => Tag[];
  };
}

const useNoteStore = create<NoteStoreState>()(
  persist(
    (set, get) => ({
      notes: [],
      notebooks: [],
      tags: [],
      isInitialized: false,

      initialize: () => {
        if (get().isInitialized) return;
        const notes = storage.getNotes();
        const notebooks = storage.getNotebooks();
        const tags = storage.getTags();
        set({ notes, notebooks, tags, isInitialized: true });
      },

      noteActions: {
        createNote: (input) => {
          const now = Date.now();
          const newNote: Note = {
            ...input,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ notes: [...state.notes, newNote] }));
          storage.saveNotes(get().notes);
          return newNote;
        },

        updateNote: (id, input) => {
          let updatedNote: Note | undefined;
          set((state) => ({
            notes: state.notes.map((note) => {
              if (note.id === id) {
                updatedNote = { ...note, ...input, updatedAt: Date.now() };
                return updatedNote;
              }
              return note;
            }),
          }));
          storage.saveNotes(get().notes);
          return updatedNote;
        },

        deleteNote: (id) => {
          const initialLength = get().notes.length;
          set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
          storage.saveNotes(get().notes);
          return get().notes.length < initialLength;
        },

        getNoteById: (id) => {
          return get().notes.find((note) => note.id === id);
        },

        getNotesByNotebookId: (notebookId) => {
          return get().notes.filter((note) => note.notebookId === notebookId);
        },

        getNotesByTagId: (tagId) => {
          return get().notes.filter((note) => note.tagIds.includes(tagId));
        },

        getAllNotes: () => {
          return get().notes.filter((note) => !note.isArchived);
        },

        getPinnedNotes: () => {
          return get().notes.filter((note) => note.isPinned && !note.isArchived);
        },

        getArchivedNotes: () => {
          return get().notes.filter((note) => note.isArchived);
        },
      },

      notebookActions: {
        createNotebook: (input) => {
          const now = Date.now();
          const newNotebook: Notebook = {
            ...input,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ notebooks: [...state.notebooks, newNotebook] }));
          storage.saveNotebooks(get().notebooks);
          return newNotebook;
        },

        updateNotebook: (id, input) => {
          let updatedNotebook: Notebook | undefined;
          set((state) => ({
            notebooks: state.notebooks.map((notebook) => {
              if (notebook.id === id) {
                updatedNotebook = { ...notebook, ...input, updatedAt: Date.now() };
                return updatedNotebook;
              }
              return notebook;
            }),
          }));
          storage.saveNotebooks(get().notebooks);
          return updatedNotebook;
        },

        deleteNotebook: (id) => {
          const initialLength = get().notebooks.length;
          set((state) => ({
            notebooks: state.notebooks.filter((notebook) => notebook.id !== id),
            notes: state.notes.map((note) =>
              note.notebookId === id ? { ...note, notebookId: '' } : note
            ),
          }));
          storage.saveNotebooks(get().notebooks);
          storage.saveNotes(get().notes);
          return get().notebooks.length < initialLength;
        },

        getNotebookById: (id) => {
          return get().notebooks.find((notebook) => notebook.id === id);
        },

        getAllNotebooks: () => {
          return get().notebooks;
        },
      },

      tagActions: {
        createTag: (input) => {
          const now = Date.now();
          const newTag: Tag = {
            ...input,
            id: generateId(),
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({ tags: [...state.tags, newTag] }));
          storage.saveTags(get().tags);
          return newTag;
        },

        updateTag: (id, input) => {
          let updatedTag: Tag | undefined;
          set((state) => ({
            tags: state.tags.map((tag) => {
              if (tag.id === id) {
                updatedTag = { ...tag, ...input, updatedAt: Date.now() };
                return updatedTag;
              }
              return tag;
            }),
          }));
          storage.saveTags(get().tags);
          return updatedTag;
        },

        deleteTag: (id) => {
          const initialLength = get().tags.length;
          set((state) => ({
            tags: state.tags.filter((tag) => tag.id !== id),
            notes: state.notes.map((note) => ({
              ...note,
              tagIds: note.tagIds.filter((tagId) => tagId !== id),
            })),
          }));
          storage.saveTags(get().tags);
          storage.saveNotes(get().notes);
          return get().tags.length < initialLength;
        },

        getTagById: (id) => {
          return get().tags.find((tag) => tag.id === id);
        },

        getAllTags: () => {
          return get().tags;
        },
      },
    }),
    {
      name: 'notes-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        notebooks: state.notebooks,
        tags: state.tags,
      }),
    }
  )
);

export default useNoteStore;
