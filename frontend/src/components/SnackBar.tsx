import React from 'react';

interface SnackbarProps {
  message: string;
  isVisible: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isVisible }) => {
  return (
    <div className={`snackbar ${!isVisible ? 'hide' : ''}`}>
      {message}
    </div>
  );
};

export default Snackbar;
