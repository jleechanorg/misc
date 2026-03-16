import { describe, it, expect, beforeEach, vi } from 'vitest';
import useNoteStore from '../store/noteStore';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
vi.stubGlobal('localStorage', localStorageMock);

const TEST_NOTEBOOK_ID = 'test-notebook-1';
const TEST_TAG_ID = 'test-tag-1';

function createTestNotebook() {
  return {
    name: 'Test Notebook',
    description: 'Test description',
    coverColor: '#FF5733',
  };
}

function createTestTag() {
  return {
    name: 'Test Tag',
    color: '#00FF00',
  };
}

function createTestNote() {
  return {
    title: 'Test Note',
    content: 'Test content',
    notebookId: TEST_NOTEBOOK_ID,
    tagIds: [TEST_TAG_ID],
    isPinned: false,
    isArchived: false,
  };
}

describe('NoteStore', () => {
  beforeEach(() => {
    useNoteStore.setState({
      notes: [],
      notebooks: [],
      tags: [],
      isInitialized: true,
    });
    localStorage.clear();
  });

  describe('Notebook CRUD', () => {
    it('should create a notebook', () => {
      const { notebookActions } = useNoteStore.getState();
      const input = createTestNotebook();
      const notebook = notebookActions.createNotebook(input);

      expect(notebook).toBeDefined();
      expect(notebook.id).toBeDefined();
      expect(notebook.name).toBe(input.name);
      expect(notebook.description).toBe(input.description);
      expect(notebook.coverColor).toBe(input.coverColor);
      expect(notebook.createdAt).toBeDefined();
      expect(notebook.updatedAt).toBeDefined();
    });

    it('should update a notebook', () => {
      const { notebookActions } = useNoteStore.getState();
      const notebook = notebookActions.createNotebook(createTestNotebook());

      const updated = notebookActions.updateNotebook(notebook.id, {
        name: 'Updated Name',
      });

      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated Name');
    });

    it('should delete a notebook', () => {
      const { notebookActions } = useNoteStore.getState();
      const notebook = notebookActions.createNotebook(createTestNotebook());
      const initialCount = useNoteStore.getState().notebooks.length;

      const deleted = notebookActions.deleteNotebook(notebook.id);

      expect(deleted).toBe(true);
      expect(useNoteStore.getState().notebooks.length).toBe(initialCount - 1);
    });

    it('should get notebook by id', () => {
      const { notebookActions } = useNoteStore.getState();
      const notebook = notebookActions.createNotebook(createTestNotebook());

      const found = notebookActions.getNotebookById(notebook.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(notebook.id);
    });

    it('should get all notebooks', () => {
      const { notebookActions } = useNoteStore.getState();
      notebookActions.createNotebook(createTestNotebook());
      notebookActions.createNotebook({ ...createTestNotebook(), name: 'Notebook 2' });

      const notebooks = notebookActions.getAllNotebooks();

      expect(notebooks.length).toBe(2);
    });
  });

  describe('Tag CRUD', () => {
    it('should create a tag', () => {
      const { tagActions } = useNoteStore.getState();
      const input = createTestTag();
      const tag = tagActions.createTag(input);

      expect(tag).toBeDefined();
      expect(tag.id).toBeDefined();
      expect(tag.name).toBe(input.name);
      expect(tag.color).toBe(input.color);
    });

    it('should update a tag', () => {
      const { tagActions } = useNoteStore.getState();
      const tag = tagActions.createTag(createTestTag());

      const updated = tagActions.updateTag(tag.id, {
        name: 'Updated Tag',
      });

      expect(updated?.name).toBe('Updated Tag');
    });

    it('should delete a tag', () => {
      const { tagActions } = useNoteStore.getState();
      const tag = tagActions.createTag(createTestTag());
      const initialCount = useNoteStore.getState().tags.length;

      const deleted = tagActions.deleteTag(tag.id);

      expect(deleted).toBe(true);
      expect(useNoteStore.getState().tags.length).toBe(initialCount - 1);
    });

    it('should get all tags', () => {
      const { tagActions } = useNoteStore.getState();
      tagActions.createTag(createTestTag());
      tagActions.createTag({ ...createTestTag(), name: 'Tag 2' });

      const tags = tagActions.getAllTags();

      expect(tags.length).toBe(2);
    });
  });

  describe('Note CRUD', () => {
    beforeEach(() => {
      useNoteStore.getState().notebookActions.createNotebook(createTestNotebook());
      useNoteStore.getState().tagActions.createTag(createTestTag());
    });

    it('should create a note', () => {
      const { noteActions } = useNoteStore.getState();
      const input = createTestNote();
      const note = noteActions.createNote(input);

      expect(note).toBeDefined();
      expect(note.id).toBeDefined();
      expect(note.title).toBe(input.title);
      expect(note.content).toBe(input.content);
      expect(note.notebookId).toBe(input.notebookId);
      expect(note.tagIds).toEqual(input.tagIds);
    });

    it('should update a note', () => {
      const { noteActions } = useNoteStore.getState();
      const note = noteActions.createNote(createTestNote());

      const updated = noteActions.updateNote(note.id, {
        title: 'Updated Title',
      });

      expect(updated?.title).toBe('Updated Title');
    });

    it('should delete a note', () => {
      const { noteActions } = useNoteStore.getState();
      const note = noteActions.createNote(createTestNote());
      const initialCount = useNoteStore.getState().notes.length;

      const deleted = noteActions.deleteNote(note.id);

      expect(deleted).toBe(true);
      expect(useNoteStore.getState().notes.length).toBe(initialCount - 1);
    });

    it('should get note by id', () => {
      const { noteActions } = useNoteStore.getState();
      const note = noteActions.createNote(createTestNote());

      const found = noteActions.getNoteById(note.id);

      expect(found?.id).toBe(note.id);
    });

    it('should get notes by notebook id', () => {
      const { noteActions, notebookActions } = useNoteStore.getState();
      const notebook2 = notebookActions.createNotebook({
        name: 'Notebook 2',
        description: '',
        coverColor: '#000000',
      });

      noteActions.createNote({ ...createTestNote(), notebookId: notebook2.id });
      noteActions.createNote({ ...createTestNote(), notebookId: notebook2.id });
      noteActions.createNote({ ...createTestNote(), notebookId: TEST_NOTEBOOK_ID });

      const notes = noteActions.getNotesByNotebookId(notebook2.id);

      expect(notes.length).toBe(2);
    });

    it('should get notes by tag id', () => {
      const { noteActions, tagActions } = useNoteStore.getState();
      const tag2 = tagActions.createTag({
        name: 'Tag 2',
        color: '#FF0000',
      });

      noteActions.createNote({ ...createTestNote(), tagIds: [tag2.id] });
      noteActions.createNote({ ...createTestNote(), tagIds: [tag2.id] });
      noteActions.createNote({ ...createTestNote(), tagIds: [TEST_TAG_ID] });

      const notes = noteActions.getNotesByTagId(tag2.id);

      expect(notes.length).toBe(2);
    });

    it('should get all non-archived notes', () => {
      const { noteActions } = useNoteStore.getState();
      noteActions.createNote({ ...createTestNote(), isArchived: false });
      noteActions.createNote({ ...createTestNote(), isArchived: false });
      noteActions.createNote({ ...createTestNote(), isArchived: true });

      const notes = noteActions.getAllNotes();

      expect(notes.length).toBe(2);
    });

    it('should get pinned notes', () => {
      const { noteActions } = useNoteStore.getState();
      noteActions.createNote({ ...createTestNote(), isPinned: true });
      noteActions.createNote({ ...createTestNote(), isPinned: true });
      noteActions.createNote({ ...createTestNote(), isPinned: false });

      const notes = noteActions.getPinnedNotes();

      expect(notes.length).toBe(2);
    });

    it('should get archived notes', () => {
      const { noteActions } = useNoteStore.getState();
      noteActions.createNote({ ...createTestNote(), isArchived: true });
      noteActions.createNote({ ...createTestNote(), isArchived: true });
      noteActions.createNote({ ...createTestNote(), isArchived: false });

      const notes = noteActions.getArchivedNotes();

      expect(notes.length).toBe(2);
    });
  });

  describe('Data Persistence', () => {
    it('should persist notes across store re-initialization', () => {
      const { noteActions, notebookActions, tagActions } = useNoteStore.getState();
      notebookActions.createNotebook(createTestNotebook());
      tagActions.createTag(createTestTag());
      noteActions.createNote(createTestNote());

      const newStore = useNoteStore.getState();
      expect(newStore.notes.length).toBe(1);
    });

    it('should cascade delete tag from notes', () => {
      const { tagActions, noteActions, notebookActions } = useNoteStore.getState();
      notebookActions.createNotebook(createTestNotebook());
      const tag = tagActions.createTag(createTestTag());
      noteActions.createNote({ ...createTestNote(), tagIds: [tag.id] });

      tagActions.deleteTag(tag.id);

      const note = useNoteStore.getState().notes[0];
      expect(note.tagIds).not.toContain(tag.id);
    });

    it('should clear notebook reference from notes when notebook is deleted', () => {
      const { notebookActions, noteActions } = useNoteStore.getState();
      const notebook = notebookActions.createNotebook(createTestNotebook());
      noteActions.createNote({ ...createTestNote(), notebookId: notebook.id });

      notebookActions.deleteNotebook(notebook.id);

      const note = useNoteStore.getState().notes[0];
      expect(note.notebookId).toBe('');
    });
  });
});
