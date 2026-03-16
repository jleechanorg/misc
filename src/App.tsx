import { useState, useEffect } from 'react';
import useNoteStore from './store/noteStore';
import Sidebar, { SidebarFilter } from './components/Sidebar';
import NoteList from './components/NoteList';
import NoteEditor from './components/NoteEditor';

function App() {
  const initialize = useNoteStore((state) => state.initialize);
  const [selectedFilter, setSelectedFilter] = useState<SidebarFilter>('all');
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        selectedFilter={selectedFilter}
        selectedNotebookId={selectedNotebookId}
        selectedTagId={selectedTagId}
        onFilterChange={setSelectedFilter}
        onNotebookSelect={setSelectedNotebookId}
        onTagSelect={setSelectedTagId}
      />
      <NoteList
        selectedNoteId={selectedNoteId}
        onNoteSelect={setSelectedNoteId}
        filter={selectedFilter}
        notebookId={selectedNotebookId}
        tagId={selectedTagId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <NoteEditor noteId={selectedNoteId} />
    </div>
  );
}

export default App;
