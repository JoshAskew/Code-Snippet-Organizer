import React, { useState } from 'react';
import { Pencil, Trash2, Copy, Play } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';
import { runCode } from '../api.ts';
import '../index.css';

interface SnippetCardProps {
  title: string;
  code: string;
  category: string;
  language: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, code, category, language, onEdit, onDelete }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Function to copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert('Code copied to clipboard!'))
      .catch((err) => console.error('Failed to copy code: ', err));
  };

  // Function to run the code and open modal
  const handleRunCode = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const result = await runCode(language, code);
      setOutput(result);
      setIsModalOpen(true); // Open the modal when code runs successfully
    } catch (error) {
      setOutput("Error executing code.");
      setIsModalOpen(true); // Open the modal even if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Get the appropriate CodeMirror extension based on the passed language prop
  const getCodeMirrorExtension = () => {
    switch (language) {
      case 'javascript':
        return javascript();
      case 'html':
        return html();
      case 'css':
        return css();
      default:
        return javascript();
    }
  };

  return (
    <div className="snippet-card">
      <div className="snippet-header">
        <h3 className="snippet-title">{title}</h3>
        <div className="snippet-icons">
          <Pencil className="icon edit-icon" onClick={onEdit} />
          <Trash2 className="icon delete-icon" onClick={onDelete} />
          <Copy className="icon copy-icon" onClick={handleCopyCode} />
          <Play className="icon run-icon" onClick={handleRunCode} />
        </div>
      </div>
      
      <div className="snippet-body">
        <div className="snippet-meta">
          <span className="category-badge">{category}</span>
          <span className="language-badge">{language.toUpperCase()}</span>
        </div>

        {/* CodeMirror for displaying code */}
        <CodeMirror
          value={code}
          height="200px"
          extensions={[getCodeMirrorExtension()]}
          theme={oneDark}
          readOnly
        />
      </div>

      {/* Modal for Output */}
      {isModalOpen && (
  <div className="modal-overlay-output">
    <div className="modal-content-output" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h4>Output:</h4>
        <button className="close-button-output" onClick={handleCloseModal}>
          ×
        </button>
      </div>
      <div>
        {loading ? (
          <p>Running...</p>
        ) : output !== null ? (
          language === "html" || language === "css" ? (
            <div className="output-box" dangerouslySetInnerHTML={{ __html: output }} />
          ) : (
            <pre className="output-box">{output}</pre>
          )
        ) : null}
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SnippetCard;