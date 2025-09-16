import React from 'react';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export function Checkbox({
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
}: CheckboxProps) {
  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return React.createElement('div', { className: `flex items-center ${className}` },
    React.createElement('input',
      {
        type: 'checkbox',
        className: `h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`,
        checked: checked,
        onChange: handleChange,
        disabled: disabled
      }
    ),
    label && React.createElement('label', {
      className: `ml-2 block text-sm font-medium ${
        disabled ? 'text-gray-400' : 'text-gray-700'
      }`
    }, label)
  );
}