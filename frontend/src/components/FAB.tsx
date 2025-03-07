import React from 'react';

interface FABProps {
  onClick: () => void;
}

const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button className="fab" onClick={onClick}>
      +
    </button>
  );
};

export default FAB;
