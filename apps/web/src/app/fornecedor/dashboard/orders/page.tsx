'use client'

// @ts-ignore
import Link from 'next/link'
// @ts-ignore
import { useState } from 'react'
// @ts-ignore
import { Order } from '@gasrapido/shared'

// Definir tipos para os itens do checklist
interface ChecklistItem {
  id: number
  text: string
  completed: boolean
}

export default function FornecedorOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      order_number: 'ORD-001',
      customer_id: 'cust-001',
      vendor_id: 'vendor-001',
      courier_id: null,
      product_id: 'prod-001',
      quantity: 1,
      unit_price: 8500,
      total_amount: 8500,
      delivery_fee: 1500,
      final_amount: 10000,
      status: 'confirmed',
      delivery_address: 'Rua Principal, 123, Luanda',
      delivery_location: { lat: -8.839078, lng: 13.289393 },
      pickup_address: null,
      pickup_location: null,
      estimated_delivery: '2025-09-15T14:30:00Z',
      delivered_at: null,
      special_instructions: 'Portão verde',
      created_at: '2025-09-15T10:00:00Z',
      updated_at: '2025-09-15T10:15:00Z'
    },
    {
      id: '2',
      order_number: 'ORD-002',
      customer_id: 'cust-002',
      vendor_id: 'vendor-001',
      courier_id: null,
      product_id: 'prod-002',
      quantity: 2,
      unit_price: 6000,
      total_amount: 12000,
      delivery_fee: 1500,
      final_amount: 13500,
      status: 'preparing',
      delivery_address: 'Avenida Central, 456, Luanda',
      delivery_location: { lat: -8.838078, lng: 13.288393 },
      pickup_address: null,
      pickup_location: null,
      estimated_delivery: '2025-09-15T15:00:00Z',
      delivered_at: null,
      special_instructions: '',
      created_at: '2025-09-15T11:00:00Z',
      updated_at: '2025-09-15T11:30:00Z'
    },
    {
      id: '3',
      order_number: 'ORD-003',
      customer_id: 'cust-003',
      vendor_id: 'vendor-001',
      courier_id: 'courier-001',
      product_id: 'prod-001',
      quantity: 1,
      unit_price: 8500,
      total_amount: 8500,
      delivery_fee: 1500,
      final_amount: 10000,
      status: 'in_transit',
      delivery_address: 'Rua Secundária, 789, Luanda',
      delivery_location: { lat: -8.837078, lng: 13.287393 },
      pickup_address: null,
      pickup_location: null,
      estimated_delivery: '2025-09-15T13:00:00Z',
      delivered_at: null,
      special_instructions: 'Casa amarela',
      created_at: '2025-09-15T09:00:00Z',
      updated_at: '2025-09-15T09:45:00Z'
    }
  ])

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 1, text: 'Verificar integridade da botija', completed: false },
    { id: 2, text: 'Conferir data de validade', completed: false },
    { id: 3, text: 'Verificar selo de segurança', completed: false },
    { id: 4, text: 'Confirmar quantidade solicitada', completed: false },
    { id: 5, text: 'Verificar equipamentos de segurança', completed: false }
  ])

  const handleChecklistItemToggle = (id: number) => {
    setChecklistItems((items: ChecklistItem[]) => 
      items.map((item: ChecklistItem) => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  const handleConfirmOrder = () => {
    if (selectedOrder) {
      // Verificar se todos os itens do checklist foram concluídos
      const allCompleted = checklistItems.every((item: ChecklistItem) => item.completed)
      
      if (!allCompleted) {
        alert('Por favor, complete todos os itens do checklist antes de confirmar.')
        return
      }
      
      // Atualizar o status do pedido
      setOrders((orders: Order[]) => 
        orders.map((order: Order) => 
          order.id === selectedOrder.id 
            ? { ...order, status: 'in_transit' } 
            : order
        )
      )
      
      // Fechar o modal
      setShowChecklist(false)
      setSelectedOrder(null)
      
      // Resetar o checklist
      setChecklistItems((checklistItems: ChecklistItem[]) => 
        checklistItems.map((item: ChecklistItem) => ({ ...item, completed: false }))
      )
      
      alert('Pedido confirmado e enviado para entrega!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmado'
      case 'preparing': return 'Preparando'
      case 'in_transit': return 'Em Trânsito'
      case 'delivered': return 'Entregue'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/fornecedor/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/fornecedor/dashboard/orders" className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Pedidos
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Produtos
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Relatórios
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <span className="sr-only">Ver notificações</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">F</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Fornecedor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
          <p className="mt-2 text-gray-600">Confirme e acompanhe os pedidos recebidos</p>
        </div>

        {/* Lista de Pedidos */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Pedidos Recentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: Order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.order_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cliente ID: {order.customer_id.substring(0, 8)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Botija {order.product_id === 'prod-001' ? '13kg' : '6kg'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AOA {order.final_amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('pt-AO')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowChecklist(true)
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Confirmar Disponibilidade
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowChecklist(true)
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Finalizar Preparação
                          </button>
                        )}
                        {(order.status === 'in_transit' || order.status === 'delivered') && (
                          <span className="text-gray-500">Pedido em andamento</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checklist */}
      {showChecklist && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Checklist de Confirmação - Pedido #{selectedOrder.order_number}
                </h3>
                <button
                  onClick={() => {
                    setShowChecklist(false)
                    setSelectedOrder(null)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Por favor, verifique todos os itens antes de confirmar a disponibilidade do pedido.
                </p>
                <div className="space-y-3">
                  {checklistItems.map((item: ChecklistItem) => (
                    <div key={item.id} className="flex items-center">
                      <input
                        id={`item-${item.id}`}
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => handleChecklistItemToggle(item.id)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`item-${item.id}`} className="ml-3 block text-sm text-gray-700">
                        {item.text}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={handleConfirmOrder}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Confirmar e Enviar para Entrega
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}