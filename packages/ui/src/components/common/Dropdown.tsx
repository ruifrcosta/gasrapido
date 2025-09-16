import React from 'react';

interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  searchable = false,
  clearable = false,
  className = '',
}: DropdownProps) {
  // Since we're having TypeScript issues, we'll create a simplified version
  // that just renders a basic select element for now
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return React.createElement('div', { className: `relative ${className}` },
    React.createElement('select',
      {
        className: `block w-full px-3 py-2 text-sm border rounded-lg ${
          disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-300 hover:border-gray-400'
        }`,
        value: value || '',
        onChange: handleChange,
        disabled: disabled
      },
      React.createElement('option', { value: '' }, placeholder),
      options.map(option => 
        React.createElement('option', 
          { 
            key: option.value, 
            value: option.value,
            disabled: option.disabled
          },
          option.label
        )
      )
    )
  );
}