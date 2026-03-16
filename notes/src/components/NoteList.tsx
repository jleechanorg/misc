import useNoteStore from '../store/noteStore';

interface NoteListProps {
  selectedNoteId: string | null;
  onNoteSelect: (id: string) => void;
  filter: 'all' | 'pinned' | 'archived';
  notebookId: string | null;
  tagId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function NoteList({
  selectedNoteId,
  onNoteSelect,
  filter,
  notebookId,
  tagId,
  searchQuery,
  onSearchChange,
}: NoteListProps) {
  const { notes, notebooks, tags, noteActions } = useNoteStore();

  const filteredNotes = notes
    .filter((note) => {
      if (filter === 'archived') return note.isArchived;
      if (filter === 'pinned') return note.isPinned && !note.isArchived;
      if (notebookId) return note.notebookId === notebookId && !note.isArchived;
      if (tagId) return note.tagIds.includes(tagId) && !note.isArchived;
      return !note.isArchived;
    })
    .filter((note) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);

  const handleCreateNote = () => {
    const defaultNotebookId = notebookId || (notebooks[0]?.id ?? '');
    const newNote = noteActions.createNote({
      title: 'Untitled',
      content: '',
      notebookId: defaultNotebookId,
      tagIds: [],
      isPinned: false,
      isArchived: false,
    });
    onNoteSelect(newNote.id);
  };

  const getNotebookName = (notebookId: string) => {
    return notebooks.find((n) => n.id === notebookId)?.name || 'No Notebook';
  };

  const getTagNames = (tagIds: string[]) => {
    return tagIds
      .map((id) => tags.find((t) => t.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-72 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={handleCreateNote}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
            title="New note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p className="text-sm">No notes yet</p>
            <button
              onClick={handleCreateNote}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Create your first note
            </button>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => onNoteSelect(note.id)}
              className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 ${
                selectedNoteId === note.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-gray-900 truncate flex-1">
                  {note.title || 'Untitled'}
                </h3>
                {note.isPinned && (
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {note.content || 'No content'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(note.updatedAt)}
                </span>
                {note.notebookId && (
                  <span className="text-xs text-gray-400">
                    {getNotebookName(note.notebookId)}
                  </span>
                )}
                {note.tagIds.length > 0 && (
                  <span className="text-xs text-gray-400 truncate">
                    {getTagNames(note.tagIds)}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
