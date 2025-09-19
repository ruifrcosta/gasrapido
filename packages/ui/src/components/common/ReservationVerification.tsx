import React, { useState } from 'react';
import { Reservation } from '@shared/types';

interface ReservationVerificationProps {
  reservation: Reservation;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
}

export function ReservationVerification(props: ReservationVerificationProps) {
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const handleApprove = () => {
    if (props.onApprove) {
      props.onApprove(props.reservation.id);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Por favor, forneça um motivo para a rejeição');
      return;
    }
    
    if (props.onReject) {
      props.onReject(props.reservation.id, rejectionReason);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      'pending_reservation': { text: 'Pendente de Reserva', className: 'bg-yellow-100 text-yellow-800' },
      'payment_pending': { text: 'Pagamento Pendente', className: 'bg-blue-100 text-blue-800' },
      'proof_uploaded': { text: 'Comprovativo Enviado', className: 'bg-purple-100 text-purple-800' },
      'confirmed': { text: 'Confirmada', className: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Cancelada', className: 'bg-red-100 text-red-800' },
      'expired': { text: 'Expirada', className: 'bg-gray-100 text-gray-800' },
      'rejected': { text: 'Rejeitada', className: 'bg-red-100 text-red-800' }
    };

    const statusInfo = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };

    return React.createElement(
      'span',
      { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}` },
      statusInfo.text
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-AO');
  };

  const formatCurrency = (amount: number, currency: string = 'AOA') => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return React.createElement(
    'div',
    { className: 'max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md' },
    React.createElement(
      'h2',
      { className: 'text-2xl font-bold text-gray-800 mb-6 text-center' },
      'Verificar Comprovativo de Reserva'
    ),
    React.createElement(
      'div',
      { className: 'grid grid-cols-1 md:grid-cols-2 gap-8' },
      // Reservation details
      React.createElement(
        'div',
        { className: 'space-y-4' },
        React.createElement(
          'h3',
          { className: 'text-lg font-semibold text-gray-800' },
          'Detalhes da Reserva'
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
              'ID da Reserva'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              props.reservation.id
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Tipo de Reserva'
            ),
            React.createElement(
              'p',
              { className: 'font-medium capitalize' },
              props.reservation.type
            )
          ),
          props.reservation.type === 'entrega' && props.reservation.delivery_address && 
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Endereço de Entrega'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              typeof props.reservation.delivery_address === 'string' 
                ? props.reservation.delivery_address 
                : JSON.stringify(props.reservation.delivery_address)
            )
          ),
          props.reservation.type === 'levantamento' && props.reservation.pickup_point && 
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Ponto de Levantamento'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              props.reservation.pickup_point
            )
          ),
          React.createElement(
            'div',
            null,
            React.createElement(
              'p',
              { className: 'text-sm text-gray-600' },
              'Data/Hora Agendada'
            ),
            React.createElement(
              'p',
              { className: 'font-medium' },
              props.reservation.scheduled_time ? formatDate(props.reservation.scheduled_time) : 'N/A'
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
              formatCurrency(props.reservation.amount, props.reservation.currency)
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
              props.reservation.payment_method || 'N/A'
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
            getStatusBadge(props.reservation.status)
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
        props.reservation.proof_file_path ? 
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
              props.reservation.proof_file_path.split('/').pop() || 'comprovativo.pdf'
            ),
            React.createElement(
              'p',
              { className: 'text-sm text-gray-500 mt-1' },
              'Documento de comprovativo de pagamento'
            ),
            React.createElement(
              'button',
              { 
                className: 'mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                onClick: () => {
                  // In a real implementation, this would open the document
                  alert('Visualização do documento não implementada');
                }
              },
              'Visualizar Documento'
            )
          )
        ) :
        React.createElement(
          'div',
          { className: 'border border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50' },
          React.createElement(
            'div',
            { className: 'text-center text-gray-500' },
            'Nenhum comprovativo enviado'
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
            value: rejectionReason,
            onChange: (e) => setRejectionReason(e.target.value),
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
              onClick: handleReject,
              className: 'flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            },
            'Rejeitar Comprovativo'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: handleApprove,
              className: 'flex-1 py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            },
            'Aprovar Comprovativo'
          )
        )
      )
    )
  );
}            React.createElement('div', {
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
              props.reservation.proof_file_path.split('/').pop() || 'comprovativo.pdf'
            ),
            React.createElement(
              'p',
              { className: 'text-sm text-gray-500 mt-1' },
              'Documento de comprovativo de pagamento'
            ),
            React.createElement(
              'button',
              { 
                className: 'mt-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                onClick: () => {
                  // In a real implementation, this would open the document
                  alert('Visualização do documento não implementada');
                }
              },
              'Visualizar Documento'
            )
          )
        ) :
        React.createElement(
          'div',
          { className: 'border border-gray-300 rounded-lg p-4 flex items-center justify-center h-64 bg-gray-50' },
          React.createElement(
            'div',
            { className: 'text-center text-gray-500' },
            'Nenhum comprovativo enviado'
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
            value: rejectionReason,
            onChange: (e) => setRejectionReason(e.target.value),
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
              onClick: handleReject,
              className: 'flex-1 py-2 px-4 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            },
            'Rejeitar Comprovativo'
          ),
          React.createElement(
            'button',
            {
              type: 'button',
              onClick: handleApprove,
              className: 'flex-1 py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            },
            'Aprovar Comprovativo'
          )
        )
      )
    )
  );
}