import { useState } from 'react';
import useNoteStore from '../store/noteStore';

export type SidebarFilter = 'all' | 'pinned' | 'archived';

interface SidebarProps {
  selectedFilter: SidebarFilter;
  selectedNotebookId: string | null;
  selectedTagId: string | null;
  onFilterChange: (filter: SidebarFilter) => void;
  onNotebookSelect: (id: string | null) => void;
  onTagSelect: (id: string | null) => void;
}

const NOTEBOOK_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function Sidebar({
  selectedFilter,
  selectedNotebookId,
  selectedTagId,
  onFilterChange,
  onNotebookSelect,
  onTagSelect,
}: SidebarProps) {
  const { notebooks, tags, notebookActions, tagActions } = useNoteStore();
  const [isAddingNotebook, setIsAddingNotebook] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [editingNotebookId, setEditingNotebookId] = useState<string | null>(null);
  const [editingNotebookName, setEditingNotebookName] = useState('');

  const handleCreateNotebook = () => {
    if (newNotebookName.trim()) {
      notebookActions.createNotebook({
        name: newNotebookName.trim(),
        description: '',
        coverColor: NOTEBOOK_COLORS[notebooks.length % NOTEBOOK_COLORS.length],
      });
      setNewNotebookName('');
      setIsAddingNotebook(false);
    }
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      tagActions.createTag({
        name: newTagName.trim(),
        color: NOTEBOOK_COLORS[tags.length % NOTEBOOK_COLORS.length],
      });
      setNewTagName('');
      setIsAddingTag(false);
    }
  };

  const handleUpdateNotebook = (id: string) => {
    if (editingNotebookName.trim()) {
      notebookActions.updateNotebook(id, { name: editingNotebookName.trim() });
      setEditingNotebookId(null);
      setEditingNotebookName('');
    }
  };

  const handleDeleteNotebook = (id: string) => {
    notebookActions.deleteNotebook(id);
    if (selectedNotebookId === id) {
      onNotebookSelect(null);
    }
  };

  const handleDeleteTag = (id: string) => {
    tagActions.deleteTag(id);
    if (selectedTagId === id) {
      onTagSelect(null);
    }
  };

  return (
    <div className="w-56 h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-800">Notes</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button
            onClick={() => {
              onFilterChange('all');
              onNotebookSelect(null);
              onTagSelect(null);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selectedFilter === 'all' && !selectedNotebookId && !selectedTagId
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Notes
          </button>
          <button
            onClick={() => {
              onFilterChange('pinned');
              onNotebookSelect(null);
              onTagSelect(null);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selectedFilter === 'pinned'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pinned
          </button>
          <button
            onClick={() => {
              onFilterChange('archived');
              onNotebookSelect(null);
              onTagSelect(null);
            }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${
              selectedFilter === 'archived'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Archived
          </button>
        </div>

        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Notebooks</span>
            <button
              onClick={() => setIsAddingNotebook(true)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              +
            </button>
          </div>
          {isAddingNotebook && (
            <div className="px-3 py-2">
              <input
                type="text"
                value={newNotebookName}
                onChange={(e) => setNewNotebookName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNotebook()}
                onBlur={() => !newNotebookName && setIsAddingNotebook(false)}
                placeholder="Notebook name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                autoFocus
              />
            </div>
          )}
          {notebooks.map((notebook) => (
            <div key={notebook.id} className="group flex items-center">
              {editingNotebookId === notebook.id ? (
                <input
                  type="text"
                  value={editingNotebookName}
                  onChange={(e) => setEditingNotebookName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdateNotebook(notebook.id);
                    if (e.key === 'Escape') setEditingNotebookId(null);
                  }}
                  onBlur={() => handleUpdateNotebook(notebook.id)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => {
                    onNotebookSelect(notebook.id);
                    onFilterChange('all');
                    onTagSelect(null);
                  }}
                  className={`flex-1 text-left px-3 py-2 rounded-md text-sm truncate ${
                    selectedNotebookId === notebook.id
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: notebook.coverColor }}
                  />
                  {notebook.name}
                </button>
              )}
              <div className="hidden group-hover:flex items-center pr-2">
                <button
                  onClick={() => {
                    setEditingNotebookId(notebook.id);
                    setEditingNotebookName(notebook.name);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteNotebook(notebook.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {notebooks.length === 0 && !isAddingNotebook && (
            <p className="px-3 py-2 text-xs text-gray-400">No notebooks yet</p>
          )}
        </div>

        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase">Tags</span>
            <button
              onClick={() => setIsAddingTag(true)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              +
            </button>
          </div>
          {isAddingTag && (
            <div className="px-3 py-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                onBlur={() => !newTagName && setIsAddingTag(false)}
                placeholder="Tag name"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                autoFocus
              />
            </div>
          )}
          {tags.map((tag) => (
            <div key={tag.id} className="group flex items-center">
              <button
                onClick={() => {
                  onTagSelect(tag.id);
                  onFilterChange('all');
                  onNotebookSelect(null);
                }}
                className={`flex-1 text-left px-3 py-2 rounded-md text-sm truncate ${
                  selectedTagId === tag.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
              <div className="hidden group-hover:flex items-center pr-2">
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {tags.length === 0 && !isAddingTag && (
            <p className="px-3 py-2 text-xs text-gray-400">No tags yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
