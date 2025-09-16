import React from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Input } from './Input';
import { Alert } from './Alert';
import { LoadingSpinner, LoadingOverlay } from './Loading';
import { Dropdown } from './Dropdown';
import { Toggle } from './Toggle';
import { Checkbox } from './Checkbox';
import { Modal } from './Modal';
import { Toast } from './Toast';

export function UIDemo() {
  // Since we're having TypeScript issues with useState, we'll create a simplified demo
  // that doesn't require state management
  
  return React.createElement('div', { className: 'p-6 space-y-6' },
    React.createElement('h1', { className: 'text-2xl font-bold' }, 'UI Components Demo'),
    
    // Buttons
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Buttons'),
      React.createElement('div', { className: 'flex flex-wrap gap-2' },
        React.createElement(Button, { variant: 'primary' }, 'Primary'),
        React.createElement(Button, { variant: 'secondary' }, 'Secondary'),
        React.createElement(Button, { variant: 'outline' }, 'Outline'),
        React.createElement(Button, { variant: 'ghost' }, 'Ghost'),
        React.createElement(Button, { disabled: true }, 'Disabled')
      )
    ),
    
    // Inputs
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Inputs'),
      React.createElement('div', { className: 'space-y-4' },
        React.createElement(Input, { 
          label: 'Nome completo', 
          placeholder: 'Digite seu nome' 
        }),
        React.createElement(Input, { 
          label: 'Email', 
          type: 'email',
          placeholder: 'seu@email.com'
        })
      )
    ),
    
    // Dropdown
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Dropdown'),
      React.createElement('div', { className: 'w-64' },
        React.createElement(Dropdown, {
          options: [
            { value: 'option1', label: 'Opção 1' },
            { value: 'option2', label: 'Opção 2' },
            { value: 'option3', label: 'Opção 3' },
          ],
          placeholder: 'Selecione uma opção'
        })
      )
    ),
    
    // Toggles and Checkboxes
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Toggles & Checkboxes'),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement(Toggle, {
          label: 'Ativar notificações'
        }),
        React.createElement(Checkbox, {
          label: 'Aceitar termos e condições'
        })
      )
    ),
    
    // Alerts
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Alerts'),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement(Alert, { type: 'success', title: 'Sucesso' }, 'Operação realizada com sucesso!'),
        React.createElement(Alert, { type: 'error', title: 'Erro' }, 'Ocorreu um erro inesperado.'),
        React.createElement(Alert, { type: 'warning', title: 'Aviso' }, 'Verifique as informações fornecidas.'),
        React.createElement(Alert, { type: 'info', title: 'Informação' }, 'Nova atualização disponível.')
      )
    ),
    
    // Loading
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Loading States'),
      React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(LoadingSpinner, { size: 'sm' }),
          React.createElement('span', { className: 'text-sm' }, 'Small spinner')
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(LoadingSpinner, { size: 'md' }),
          React.createElement('span', { className: 'text-sm' }, 'Medium spinner')
        ),
        React.createElement('div', { className: 'flex items-center gap-2' },
          React.createElement(LoadingSpinner, { size: 'lg' }),
          React.createElement('span', { className: 'text-sm' }, 'Large spinner')
        )
      )
    ),
    
    // Modals
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Modals'),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement(Button, null, 'Open Modal (State management not available in demo)'),
        React.createElement(Modal, {
          isOpen: false,
          onClose: () => {},
          title: 'Exemplo de Modal'
        },
          React.createElement('p', { className: 'text-gray-600' }, 'Este é um exemplo de modal com conteúdo.'),
          React.createElement('div', { className: 'mt-4 flex justify-end space-x-2' },
            React.createElement(Button, { variant: 'outline' }, 'Cancelar'),
            React.createElement(Button, null, 'Confirmar')
          )
        )
      )
    ),
    
    // Toasts
    React.createElement(Card, { className: 'space-y-4' },
      React.createElement('h2', { className: 'text-xl font-semibold' }, 'Toasts'),
      React.createElement('div', { className: 'space-y-2' },
        React.createElement(Button, null, 'Show Toast (State management not available in demo)'),
        React.createElement(Toast, {
          message: 'Notificação de exemplo!',
          type: 'info'
        })
      )
    )
  );
}