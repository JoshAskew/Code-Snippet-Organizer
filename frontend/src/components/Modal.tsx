import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

interface Snippet {
  code: string;
  title: string;
  category: string;
  id: number;
  tags?: string[];
}

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  onSave: (title: string, code: string, category: string, tags: string[]) => void;
  snippet?: Snippet | null;
}

const Modal: React.FC<ModalProps> = ({ showModal, onClose, onSave, snippet }) => {
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title || '');
      setCode(snippet.code || '');
      setCategory(snippet.category || '');
      setTags(snippet.tags || []);
    } else {
      setTitle('');
      setCode('');
      setCategory('');
      setTags([]);
    }
  }, [snippet]);

  const handleSave = () => {
    if (!title.trim() || !code.trim() || !category.trim()) {
      alert('Title, Code, and Category cannot be empty!');
      return;
    }
    onSave(title, code, category, tags);
    onClose();
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3 className='new-snippet-header'>{snippet ? 'Edit Snippet' : 'Add Snippet'}</h3>

          {/* Title Input */}
          <label className='label'>Title:</label>
          <input
            className="title-input"
            type="text"
            placeholder="Snippet Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Code Input (Syntax Highlighted) */}
            <CodeMirror
            value={code}
            height="200px"
            extensions={[javascript()]}
            theme={oneDark}
            onChange={(value: string) => setCode(value)}
            />

          {/* Category Input */}
          <label className='label'>Category:</label>
          <input
            className="category-input"
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* Tags Input */}
          <label className='label'>Tags:</label>
          <input
            className="tags-input"
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          />

          <div className="modal-buttons">
            <button className='close-button' onClick={onClose}>Close</button>
            <button className='save-button' onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
