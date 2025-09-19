import React from 'react';

interface PaymentProofUploadProps {
  orderId: string;
  onUploadComplete?: (paymentProofId: string) => void;
  onError?: (error: string) => void;
}

export function PaymentProofUpload(props: PaymentProofUploadProps) {
  return React.createElement(
    'div',
    { className: 'max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md' },
    React.createElement(
      'h2',
      { className: 'text-2xl font-bold text-gray-800 mb-6 text-center' },
      'Enviar Comprovativo de Pagamento'
    ),
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'label',
        { className: 'block text-sm font-medium text-gray-700 mb-2' },
        'Método de Pagamento'
      ),
      React.createElement(
        'div',
        { className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2' },
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 text-sm rounded-md border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          },
          'Multicaixa Express'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 text-sm rounded-md border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          },
          'KWiK'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 text-sm rounded-md border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          },
          'Unitel Money'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 text-sm rounded-md border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          },
          'PayPay'
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            className: 'px-4 py-2 text-sm rounded-md border bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
          },
          'Transferência Bancária'
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'label',
        { htmlFor: 'amount', className: 'block text-sm font-medium text-gray-700 mb-2' },
        'Valor Pago (AOA)'
      ),
      React.createElement(
        'div',
        { className: 'relative' },
        React.createElement(
          'span',
          { className: 'absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500' },
          'AOA'
        ),
        React.createElement('input', {
          id: 'amount',
          type: 'number',
          step: '0.01',
          placeholder: '0.00',
          className: 'pl-12 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500'
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'label',
        { className: 'block text-sm font-medium text-gray-700 mb-2' },
        'Comprovativo'
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          className: 'w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors'
        },
        React.createElement(
          'div',
          { className: 'flex flex-col items-center' },
          React.createElement('div', {
            className: 'w-12 h-12 text-gray-400 mb-2',
            dangerouslySetInnerHTML: {
              __html: `
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
              `
            }
          }),
          React.createElement(
            'p',
            { className: 'text-gray-600 mb-1' },
            'Clique para selecionar o comprovativo'
          ),
          React.createElement(
            'p',
            { className: 'text-sm text-gray-500' },
            'Formatos: JPEG, PNG, GIF, PDF (Máx. 10MB)'
          )
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'mb-6' },
      React.createElement(
        'label',
        { htmlFor: 'notes', className: 'block text-sm font-medium text-gray-700 mb-2' },
        'Notas Adicionais (Opcional)'
      ),
      React.createElement('textarea', {
        id: 'notes',
        placeholder: 'Referência bancária, número de transação, etc.',
        rows: 3,
        className: 'w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500'
      })
    ),
    React.createElement(
      'div',
      { className: 'mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md' },
      React.createElement(
        'p',
        { className: 'text-blue-700 text-sm' },
        'Nota: Em uma implementação completa, este componente seria controlado por um componente pai que gerencia o estado.'
      )
    ),
    React.createElement(
      'button',
      {
        type: 'button',
        className: 'w-full py-3 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      },
      'Enviar Comprovativo'
    )
  );
}