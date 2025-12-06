import React from 'react';

// Primary button using DaisyUI styles
export const PrimaryButton = ({ children, onClick, type = 'button', className = '', disabled = false }: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-primary ${className}`.trim()}
  >
    {children}
  </button>
);

// Outline button using DaisyUI styles
export const OutlineButton = ({ children, onClick, type = 'button', className = '', disabled = false }: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`btn btn-outline ${className}`.trim()}
  >
    {children}
  </button>
);
