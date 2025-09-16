import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return React.createElement('div', {
    className: 'fixed inset-0 z-50 overflow-y-auto',
    onClick: handleBackdropClick
  },
    React.createElement('div', {
      className: 'flex min-h-screen items-center justify-center p-4'
    },
      React.createElement('div', {
        className: `relative w-full ${sizes[size]} bg-white rounded-lg shadow-xl transform transition-all`
      },
        React.createElement('div', {
          className: 'absolute top-0 right-0 pt-4 pr-4'
        },
          React.createElement('button', {
            type: 'button',
            className: 'text-gray-400 hover:text-gray-500 focus:outline-none',
            onClick: onClose
          },
            React.createElement('svg', {
              className: 'h-6 w-6',
              fill: 'none',
              viewBox: '0 0 24 24',
              stroke: 'currentColor'
            },
              React.createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: 2,
                d: 'M6 18L18 6M6 6l12 12'
              })
            )
          )
        ),
        title && React.createElement('div', {
          className: 'px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-4'
        },
          React.createElement('h3', {
            className: 'text-lg leading-6 font-medium text-gray-900'
          }, title)
        ),
        React.createElement('div', {
          className: 'px-4 pb-5 sm:px-6 sm:pb-6'
        }, children)
      )
    )
  );
}