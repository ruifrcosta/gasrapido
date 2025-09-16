import React from 'react';

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}: ToggleProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return React.createElement('div', { className: `flex items-center ${className}` },
    React.createElement('button',
      {
        type: 'button',
        className: `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          disabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : checked 
              ? 'bg-blue-600' 
              : 'bg-gray-300'
        }`,
        role: 'switch',
        'aria-checked': checked,
        disabled: disabled,
        onClick: handleChange
      },
      React.createElement('span',
        {
          className: `pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`
        },
        React.createElement('span',
          {
            className: `absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
              checked ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200'
            }`
          },
          React.createElement('svg', {
            className: 'h-3 w-3 text-gray-400',
            fill: 'none',
            viewBox: '0 0 12 12'
          },
            React.createElement('path', {
              d: 'M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2',
              stroke: 'currentColor',
              strokeWidth: 2,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            })
          )
        ),
        React.createElement('span',
          {
            className: `absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
              checked ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
            }`
          },
          React.createElement('svg', {
            className: 'h-3 w-3 text-blue-600',
            fill: 'currentColor',
            viewBox: '0 0 12 12'
          },
            React.createElement('path', {
              d: 'M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z'
            })
          )
        )
      )
    ),
    label && React.createElement('span', {
      className: `ml-3 text-sm font-medium ${
        disabled ? 'text-gray-400' : 'text-gray-700'
      }`
    }, label)
  );
}