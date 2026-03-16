import { useState, useEffect, useRef, useCallback } from 'react';
import useNoteStore from '../store/noteStore';
import { Tag } from '../types';

interface NoteEditorProps {
  noteId: string | null;
}

const TAG_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const { notes, notebooks, tags, noteActions, tagActions } = useNoteStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNotebookId, setSelectedNotebookId] = useState('');
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showNotebookPicker, setShowNotebookPicker] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const note = noteId ? notes.find((n) => n.id === noteId) : null;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSelectedNotebookId(note.notebookId);
    } else {
      setTitle('');
      setContent('');
      setSelectedNotebookId(notebooks[0]?.id || '');
    }
  }, [note, notebooks]);

  const saveNote = useCallback(() => {
    if (noteId) {
      noteActions.updateNote(noteId, {
        title,
        content,
        notebookId: selectedNotebookId,
      });
    }
  }, [noteId, title, content, selectedNotebookId, noteActions]);

  useEffect(() => {
    const timer = setTimeout(saveNote, 500);
    return () => clearTimeout(timer);
  }, [title, content, selectedNotebookId, saveNote]);

  const handleDelete = () => {
    if (noteId && confirm('Delete this note?')) {
      noteActions.deleteNote(noteId);
    }
  };

  const handleTogglePin = () => {
    if (noteId) {
      noteActions.updateNote(noteId, { isPinned: !note?.isPinned });
    }
  };

  const handleToggleArchive = () => {
    if (noteId) {
      noteActions.updateNote(noteId, { isArchived: !note?.isArchived });
    }
  };

  const handleTagToggle = (tagId: string) => {
    if (!noteId || !note) return;
    const newTagIds = note.tagIds.includes(tagId)
      ? note.tagIds.filter((id) => id !== tagId)
      : [...note.tagIds, tagId];
    noteActions.updateNote(noteId, { tagIds: newTagIds });
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag = tagActions.createTag({
        name: newTagName.trim(),
        color: TAG_COLORS[tags.length % TAG_COLORS.length],
      });
      if (noteId && note) {
        noteActions.updateNote(noteId, { tagIds: [...note.tagIds, newTag.id] });
      }
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const currentNotebook = notebooks.find((n) => n.id === selectedNotebookId);
  const currentTags = note?.tagIds.map((id) => tags.find((t) => t.id === id)).filter(Boolean) as Tag[] || [];

  if (!noteId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Select a note or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowNotebookPicker(!showNotebookPicker)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentNotebook?.coverColor || '#9ca3af' }}
              />
              {currentNotebook?.name || 'No Notebook'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showNotebookPicker && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {notebooks.map((nb) => (
                  <button
                    key={nb.id}
                    onClick={() => {
                      setSelectedNotebookId(nb.id);
                      setShowNotebookPicker(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                      selectedNotebookId === nb.id ? 'bg-gray-100' : ''
                    }`}
                  >
                    <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: nb.coverColor }} />
                    {nb.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleTogglePin}
            className={`p-2 rounded ${note?.isPinned ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
            title={note?.isPinned ? 'Unpin' : 'Pin'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
          </button>
          <button
            onClick={handleToggleArchive}
            className={`p-2 rounded ${note?.isArchived ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
            title={note?.isArchived ? 'Unarchive' : 'Archive'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
          <button
            onClick={() => setShowTagPicker(!showTagPicker)}
            className={`p-2 rounded ${note?.tagIds.length ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            title="Tags"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 rounded"
            title="Delete"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {showTagPicker && (
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-2">
            {currentTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full"
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
                <button
                  onClick={() => handleTagToggle(tag.id)}
                  className="hover:opacity-70"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.id)}
                className={`px-2 py-1 text-xs rounded-full transition-opacity ${
                  note?.tagIds.includes(tag.id) ? '' : 'opacity-50 hover:opacity-100'
                }`}
                style={{ backgroundColor: tag.color + '20', color: tag.color }}
              >
                {tag.name}
              </button>
            ))}
            {isAddingTag ? (
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                onBlur={() => !newTagName && setIsAddingTag(false)}
                placeholder="Tag name"
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded"
              >
                + Add tag
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full px-6 py-4 text-xl font-semibold text-gray-900 border-none focus:outline-none focus:ring-0"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 w-full px-6 py-4 text-gray-700 resize-none border-none focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  );
}
