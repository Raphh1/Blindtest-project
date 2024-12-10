// components/ui/Button.tsx
"use client";

import React from 'react';
import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, className, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded text-white font-medium transition-colors';
  const variantStyles = variant === 'primary'
    ? 'bg-purple-600 hover:bg-purple-700'
    : 'bg-zinc-800 hover:bg-zinc-700';

  return (
    <button
      className={classNames(baseStyles, variantStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
};
