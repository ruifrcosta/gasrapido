import React from 'react';

interface PaymentProofVerificationProps {
  paymentProof: any; // In a real implementation, this would be a typed object
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export function PaymentProofVerification(props: PaymentProofVerificationProps) {
  return React.createElement(
    'div',
    { className: 'max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md' },
    React.createElement(
      'h2',
      { className: 'text-2xl font-bold text-gray-800 mb-6 text-center' },
      'Verificar Comprovativo de Pagamento'
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
      // Payment proof details
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'h3',
          { className: 'text-lg font-semibold text-gray-800' },
          'Detalhes do Comprovativo'
        ),
        React.createElement(
          'div',
          { className: 'space-y-3' },
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'ID do Comprovativo'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              'pp_1234567890'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'ID do Pedido'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              'order_1234567890'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Método de Pagamento'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              'Multicaixa Express'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Valor'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              'AOA 15,000.00'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Data de Envio'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              '15/09/2025 14:30'
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Status'
            ),
            React.createElement(
              'span',
              { className: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800' },
              'Pendente de Verificação'
            )
          )
        )
      ),
      // Document preview
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'h3',
          { className: 'text-lg font-semibold text-gray-800' },
          'Documento do Comprovativo'
        ),
        React.createElement(
          'div',
          { className: 'border border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50' },
          React.createElement(
            'div',
            { className: 'text-center' },
            React.createElement('div', {
              className: 'w-16 h-16 text-gray-400 mx-auto mb-2',
              dangerouslySetInnerHTML: {
                __html: `
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                `
              }
            }),
            React.createElement(
              'p',
              { className: 'text-gray-600' },
              'comprovativo_multicaixa_express.pdf'
            ),
            React.createElement(
              'p',
              { className: 'text-sm text-gray-500 mt-1' },
              '2.4 MB'
            ),
            React.createElement(
              'button',
              { className: 'mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' },
              'Visualizar Documento'
            )
          )
        )
      )
    ),
    // Verification actions
    React.createElement(
      'div',
      { className: 'mt-8 pt-6 border-t border-gray-200' },
      React.createElement(
        'h3',
        { className: 'text-lg font-semibold text-gray-800 mb-4' },
        'Ações de Verificação'
      ),
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'label',
            { htmlFor: 'rejectionReason', className: 'block text-sm font-medium text-gray-700 mb-2' },
            'Motivo da Rejeição (se aplicável)'
          ),
          React.createElement('textarea', {
            id: 'rejectionReason',
            placeholder: 'Explique por que o comprovativo foi rejeitado...',
            rows: 3,
            className: 'w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-blue-500 focus:border-blue-500'
          })
        ),
        React.createElement(
          'div',
          { className: 'flex flex-col sm:flex-row gap-3' },
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            },
            'Rejeitar Comprovativo'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              className: 'flex-1 py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            },
            'Aprovar Comprovativo'
          )
        )
      )
    )
  );
}