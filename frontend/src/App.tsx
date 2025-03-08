import React, { useState, useEffect } from 'react';
import SnippetCard from './components/SnippetCard';
import SearchBar from './components/Searchbar';
import FAB from './components/FAB';
import Snackbar from './components/SnackBar';
import Modal from './components/Modal';
import './index.css';

interface Snippet {
  id: number;
  title: string;
  code: string;
  category: string;
  tags: string[];
  language: string; // Add the language property
}

const App: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]); // Default to empty array
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentSnippet, setCurrentSnippet] = useState<Snippet | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState<boolean>(false);

  useEffect(() => {
    const savedSnippets = localStorage.getItem('snippets');
    if (savedSnippets) {
      try {
        const parsedSnippets = JSON.parse(savedSnippets);
        setSnippets(parsedSnippets || []);
      } catch (error) {
        console.error('Failed to parse snippets:', error);
        setSnippets([]); // Fallback to empty array if parse fails
      }
    } else {
      setSnippets([]); // Default to empty array if no snippets in localStorage
    }
  }, []);

  useEffect(() => {
    if (snippets.length > 0) {
      localStorage.setItem('snippets', JSON.stringify(snippets));
    }
  }, [snippets]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter snippets based on search query
  const filteredSnippets = snippets.filter(snippet => {
    const queryLower = searchQuery.toLowerCase();
    
    // Safely check each property before calling .toLowerCase()
    return (
      (snippet.title && snippet.title.toLowerCase().includes(queryLower)) ||
      (snippet.category && snippet.category.toLowerCase().includes(queryLower)) ||
      (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(queryLower))) ||
      (snippet.code && snippet.code.toLowerCase().includes(queryLower))
    );
  });

  const openModal = (snippet: Snippet | null = null) => {
    setCurrentSnippet(snippet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const saveSnippet = (title: string, code: string, category: string, tags: string[]) => {
    if (currentSnippet) {
      const updatedSnippets = snippets.map(snippet =>
        snippet.id === currentSnippet.id ? { ...snippet, title, code, category, tags } : snippet
      );
      setSnippets(updatedSnippets);
    } else {
      const newSnippet: Snippet = { id: Date.now(), title, code, category, tags, language: 'javascript' }; // Add a default language or get it from user input
      setSnippets([...snippets, newSnippet]);
    }
    setSnackbarMessage('Snippet saved successfully!');
    setIsSnackbarVisible(true);
    setTimeout(() => setIsSnackbarVisible(false), 3000);
  };

  const deleteSnippet = (id: number) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    setSnippets(updatedSnippets);
    setSnackbarMessage('Snippet deleted!');
    setIsSnackbarVisible(true);
    setTimeout(() => setIsSnackbarVisible(false), 3000);
  };

  return (
    <div className="container">
      {/* Header with Title */}
      <header className="app-header">
        <h1>DevCache</h1> {/* Title of the page */}
      </header>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />

      {/* Content area */}
      <div className="content">
        {/* Ensure we always render the container, even if no snippets match */}
        {filteredSnippets.length > 0 ? (
          filteredSnippets.map(snippet => (
            <div key={snippet.id} className="snippet-card-wrapper">
              <SnippetCard
              title={snippet.title}
              code={snippet.code}
              category={snippet.category}
              tags={snippet.tags}
              language={snippet.language} // Pass the language prop
              onEdit={() => openModal(snippet)}
              onDelete={() => deleteSnippet(snippet.id)}
            />
            </div>
          ))
        ) : (
          <div className="no-results-message">
            <p>No snippets found. Try searching with different terms.</p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FAB onClick={() => openModal()} />

      {/* Snackbar message */}
      <Snackbar message={snackbarMessage} isVisible={isSnackbarVisible} />

      {/* Modal for adding/editing snippet */}
      <Modal showModal={showModal} onClose={closeModal} onSave={saveSnippet} snippet={currentSnippet} />
    </div>
  );
};

export default App;
