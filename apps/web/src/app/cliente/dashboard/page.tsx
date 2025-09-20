'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ShoppingCartIcon, 
  TruckIcon,
  ClockIcon,
  CreditCardIcon,
  HeartIcon,
  UserIcon,
  MapPinIcon,
  BellIcon,
  ChartBarIcon,
  GiftIcon
} from '@heroicons/react/24/outline'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'preparing' | 'in_transit' | 'delivered' | 'cancelled'
  totalAmount: number
  createdAt: string
  estimatedDelivery?: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

interface RecentProduct {
  id: string
  name: string
  price: number
  image: string
  supplier: string
}

export default function ClienteDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [user] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '+244 912 345 678',
    address: 'Rua Principal, 123, Luanda',
    memberSince: '2024-01-15'
  })

  // Mock data
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ord-001',
        orderNumber: 'GR-2024-001',
        status: 'in_transit',
        totalAmount: 9500,
        createdAt: '2024-09-20T10:30:00Z',
        estimatedDelivery: '2024-09-20T11:30:00Z',
        items: [
          { name: 'Botija de Gás 13kg', quantity: 1, price: 8500 },
          { name: 'Taxa de Entrega', quantity: 1, price: 1000 }
        ]
      },
      {
        id: 'ord-002',
        orderNumber: 'GR-2024-002',
        status: 'delivered',
        totalAmount: 13000,
        createdAt: '2024-09-18T14:15:00Z',
        items: [
          { name: 'Botija de Gás 6kg', quantity: 2, price: 6500 }
        ]
      },
      {
        id: 'ord-003',
        orderNumber: 'GR-2024-003',
        status: 'pending',
        totalAmount: 4000,
        createdAt: '2024-09-19T16:45:00Z',
        items: [
          { name: 'Regulador de Pressão', quantity: 1, price: 2500 },
          { name: 'Mangueira 1.5m', quantity: 1, price: 1500 }
        ]
      }
    ]

    const mockRecentProducts: RecentProduct[] = [
      {
        id: 'gas-001',
        name: 'Botija de Gás 6kg',
        price: 6500,
        image: '/assets/products/gas-6kg.jpg',
        supplier: 'Posto Central'
      },
      {
        id: 'gas-002',
        name: 'Botija de Gás 13kg',
        price: 8500,
        image: '/assets/products/gas-13kg.jpg',
        supplier: 'Gás Express'
      },
      {
        id: 'acc-001',
        name: 'Regulador Universal',
        price: 2500,
        image: '/assets/products/regulator.jpg',
        supplier: 'Posto Central'
      }
    ]

    setOrders(mockOrders)
    setRecentProducts(mockRecentProducts)
    setLoading(false)
  }, [])

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'preparing':
        return 'bg-purple-100 text-purple-800'
      case 'in_transit':
        return 'bg-orange-100 text-orange-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'confirmed':
        return 'Confirmado'
      case 'preparing':
        return 'Preparando'
      case 'in_transit':
        return 'Em Trânsito'
      case 'delivered':
        return 'Entregue'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconhecido'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = [
    {
      name: 'Pedidos Este Mês',
      value: '12',
      change: '+3',
      changeType: 'increase',
      icon: ShoppingCartIcon,
    },
    {
      name: 'Total Gasto',
      value: formatPrice(125000),
      change: '+8%',
      changeType: 'increase',
      icon: CreditCardIcon,
    },
    {
      name: 'Tempo Médio de Entrega',
      value: '28 min',
      change: '-5 min',
      changeType: 'decrease',
      icon: ClockIcon,
    },
    {
      name: 'Fornecedores Favoritos',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: HeartIcon,
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
              </div>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/cliente/dashboard" className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/cliente/marketplace" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Marketplace
                  </Link>
                  <Link href="/cliente/pedidos" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Meus Pedidos
                  </Link>
                  <Link href="/cliente/favoritos" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Favoritos
                  </Link>
                </div>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
              </button>
              <Link 
                href="/cliente/carrinho" 
                className="relative p-1 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">C</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta, {user.name}!</h1>
          <p className="mt-2 text-gray-600">Aqui está o resumo da sua atividade</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                          stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.changeType === 'increase' ? (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Pedidos Recentes</h2>
                <Link href="/cliente/pedidos" className="text-sm text-primary-600 hover:text-primary-800">
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">{formatPrice(order.totalAmount)}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      {order.items[0].name} {order.items.length > 1 ? `e mais ${order.items.length - 1} item${order.items.length - 1 > 1 ? 's' : ''}` : ''}
                    </p>
                    {order.estimatedDelivery && order.status === 'in_transit' && (
                      <p className="text-xs text-orange-600 mt-1">
                        Entrega prevista: {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Ações Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/cliente/marketplace"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <ShoppingCartIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Comprar Gás</span>
                </Link>
                
                <Link
                  href="/cliente/pedidos"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <ClockIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Histórico</span>
                </Link>
                
                <Link
                  href="/cliente/favoritos"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <HeartIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Favoritos</span>
                </Link>
                
                <Link
                  href="/cliente/perfil"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <UserIcon className="h-8 w-8 text-primary-600 mb-2" />
                  <span className="text-sm font-medium text-gray-900">Perfil</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Produtos Recentes</h2>
              <Link href="/cliente/marketplace" className="text-sm text-primary-600 hover:text-primary-800">
                Ver marketplace
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Produto</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.supplier}</p>
                      <p className="text-sm font-medium text-primary-600">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Link
                      href={`/cliente/marketplace?product=${product.id}`}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors block text-center"
                    >
                      Comprar Novamente
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Informações da Conta</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Dados Pessoais</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-900"><span className="font-medium">Nome:</span> {user.name}</p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Email:</span> {user.email}</p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Telefone:</span> {user.phone}</p>
                  <p className="text-sm text-gray-900"><span className="font-medium">Membro desde:</span> {formatDate(user.memberSince)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Endereço Principal</h3>
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-sm text-gray-900">{user.address}</p>
                </div>
                <div className="mt-4">
                  <Link
                    href="/cliente/perfil"
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    Editar informações →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}