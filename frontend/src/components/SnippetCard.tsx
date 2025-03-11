import React, { useState } from 'react';
import { Pencil, Trash2, Copy, Play } from 'lucide-react'; // Add Play icon
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html'; // Add HTML support
import { css } from '@codemirror/lang-css'; // Add CSS support
import { oneDark } from '@codemirror/theme-one-dark';
import { runCode } from '../api.ts'; // Import the function to run code
import '../index.css';

interface SnippetCardProps {
  title: string;
  code: string;
  category: string;
  tags: string[];
  language: string;
  onEdit: () => void;
  onDelete: () => void;
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, code, category, tags, language, onEdit, onDelete }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
      .then(() => alert('Code copied to clipboard!'))
      .catch((err) => console.error('Failed to copy code: ', err));
  };

  // Function to run the code
  const handleRunCode = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const result = await runCode(language, code); // Use passed language prop
      setOutput(result);
    } catch (error) {
      setOutput("Error executing code.");
    } finally {
      setLoading(false);
    }
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
        return javascript(); // Default to JavaScript
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
          <Play className="icon run-icon" onClick={handleRunCode} /> {/* Run button */}
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

        {/* CodeMirror for displaying code */}
        <CodeMirror
          value={code}
          height="200px"
          extensions={[getCodeMirrorExtension()]}
          theme={oneDark}
          readOnly
        />

        {/* Execution Output */}
        <div className="output-container">
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
  );
};

export default SnippetCard;
