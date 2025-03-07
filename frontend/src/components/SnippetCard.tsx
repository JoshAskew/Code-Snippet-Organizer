import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface SnippetCardProps {
  title: string;
  code: string;
  category: string;
  tags: string[];
}

const SnippetCard: React.FC<SnippetCardProps> = ({ title, code }) => {
  return (
    <div className="snippet-card">
      <h3>{title}</h3>
      <SyntaxHighlighter language="javascript" style={okaidia}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default SnippetCard;
