import React, { useState, useEffect } from 'react';

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
  onSave: (code: string, title: string, category: string, tags: string[]) => void;
  snippet?: Snippet | null; // Optional if editing
}



const Modal: React.FC<ModalProps> = ({ showModal, onClose, onSave, snippet }) => {
  const [title, setTitle] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);


  // When the modal opens for editing, prefill the values
  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setCategory(snippet.category);
    } else {
      setTitle('');
      setCode('');
      setCategory('');
    }
  }, [snippet]);

  const handleSave = () => {
    onSave(title, code, category, tags);
    onClose();
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h3>{snippet ? 'Edit Snippet' : 'Add Snippet'}</h3>
          <input
            type="text"
            placeholder="Snippet Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="Type your code here"
          />
           <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)} 
            />
          <input
            type="text"
            placeholder="Tags"
            value={tags.join(', ')}
            onChange={e => setTags(e.target.value.split(',').map(tag => tag.trim()))}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    )
  );
};

export default Modal;
