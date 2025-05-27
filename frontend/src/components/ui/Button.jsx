// src/components/ui/Button.jsx
import React from 'react';

export default function Button({
  children,
  variant = 'solid', // 'solid' | 'outline'
  ...props
}) {
  const baseClasses =
    'font-medium rounded-lg px-6 py-3 focus:outline-none focus:ring-2 focus:ring-offset-2 transition';
  const variantClasses =
    variant === 'outline'
      ? 'border-2 border-white text-white hover:bg-white hover:text-indigo-600 focus:ring-white'
      : 'bg-white text-indigo-600 hover:bg-gray-100 focus:ring-indigo-500';

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      {...props}
    >
      {children}
    </button>
  );
}
