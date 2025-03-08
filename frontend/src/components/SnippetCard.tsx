import React from 'react';
import { Pencil, Trash2, Copy } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python'; // Add Python support
import { oneDark } from '@codemirror/theme-one-dark';
import '../index.css';

interface SnippetCardProps {
  title: string;
  code: string;
  category: string;
  tags: string[];
  language: string; // Add language as a prop
  onEdit: () => void;
  onDelete: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, code, category, tags, language, onEdit, onDelete }) => {

  // Function to copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
      });
  };

  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <h3 className="snippet-title">{title}</h3>
        <div className="snippet-icons">
          <Pencil className="icon edit-icon" onClick={onEdit} />
          <Trash2 className="icon delete-icon" onClick={onDelete} />
          <Copy className="icon copy-icon" onClick={handleCopyCode} /> {/* Add Copy icon */}
        </div>
      </div>
      <div className="snippet-body">
        <div className="snippet-meta">
          <span className="category-badge">{category}</span>
          <div className="tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">#{tag}</span>
            ))}
          </div>
        </div>

        {/* CodeMirror to show the code */}
        <CodeMirror
          value={code}
          height="200px"
          extensions={[language === "javascript" ? javascript() : python()]}
          theme={oneDark}
          readOnly
        />
      </div>
    </div>
  );
};

export default SnippetCard;
