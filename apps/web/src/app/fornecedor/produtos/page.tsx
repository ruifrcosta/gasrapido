'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string
  price: number
  botija_type: '6kg' | '12kg' | '45kg' | 'outros'
  stock_quantity: number
  images: string[]
  certification_photos: string[]
  availability_status: 'available' | 'out_of_stock' | 'pending_verification'
  safety_verified: boolean
  total_reviews: number
  supplier_rating: number
  created_at: string
  updated_at: string
}

interface MarketplaceListing {
  id: string
  product_id: string
  price: number
  delivery_fee: number
  listing_type: 'normal' | 'reserva' | 'entrega' | 'levantamento'
  reserved: boolean
  status: 'active' | 'inactive' | 'suspended'
  delivery_radius_km: number
  pickup_available: boolean
  pickup_address?: string
  estimated_delivery_time?: number
  priority_listing: boolean
}

export default function SupplierProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'out_of_stock' | 'pending_verification'>('all')

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 'prod-001',
        name: 'Botija de Gás 6kg Premium',
        description: 'Botija de gás butano de alta qualidade, 6kg, ideal para uso doméstico pequeno',
        price: 6500,
        botija_type: '6kg',
        stock_quantity: 45,
        images: ['/assets/products/gas-6kg-1.jpg', '/assets/products/gas-6kg-2.jpg'],
        certification_photos: ['/assets/certifications/cert-001.jpg'],
        availability_status: 'available',
        safety_verified: true,
        total_reviews: 28,
        supplier_rating: 4.7,
        created_at: '2024-09-01T10:00:00Z',
        updated_at: '2024-09-20T08:30:00Z',
      },
      {
        id: 'prod-002',
        name: 'Botija de Gás 13kg Familiar',
        description: 'Botija de gás butano de 13kg, perfeita para famílias grandes e restaurantes pequenos',
        price: 8500,
        botija_type: '12kg',
        stock_quantity: 12,
        images: ['/assets/products/gas-13kg-1.jpg'],
        certification_photos: ['/assets/certifications/cert-002.jpg'],
        availability_status: 'available',
        safety_verified: true,
        total_reviews: 42,
        supplier_rating: 4.9,
        created_at: '2024-08-15T14:20:00Z',
        updated_at: '2024-09-19T16:45:00Z',
      },
      {
        id: 'prod-003',
        name: 'Botija de Gás 45kg Industrial',
        description: 'Botija de gás propano de 45kg para uso industrial e comercial pesado',
        price: 15000,
        botija_type: '45kg',
        stock_quantity: 0,
        images: ['/assets/products/gas-45kg-1.jpg'],
        certification_photos: [],
        availability_status: 'out_of_stock',
        safety_verified: false,
        total_reviews: 8,
        supplier_rating: 4.2,
        created_at: '2024-07-20T09:15:00Z',
        updated_at: '2024-09-18T11:20:00Z',
      },
      {
        id: 'prod-004',
        name: 'Botija de Gás 12kg Standard',
        description: 'Botija de gás butano de 12kg, opção económica para uso doméstico',
        price: 7800,
        botija_type: '12kg',
        stock_quantity: 23,
        images: ['/assets/products/gas-12kg-1.jpg'],
        certification_photos: ['/assets/certifications/cert-003.jpg'],
        availability_status: 'pending_verification',
        safety_verified: false,
        total_reviews: 15,
        supplier_rating: 4.1,
        created_at: '2024-09-10T13:30:00Z',
        updated_at: '2024-09-20T07:10:00Z',
      }
    ]

    const mockListings: MarketplaceListing[] = [
      {
        id: 'list-001',
        product_id: 'prod-001',
        price: 6500,
        delivery_fee: 1500,
        listing_type: 'entrega',
        reserved: false,
        status: 'active',
        delivery_radius_km: 15,
        pickup_available: true,
        pickup_address: 'Rua Principal, 123, Luanda',
        estimated_delivery_time: 45,
        priority_listing: false,
      },
      {
        id: 'list-002',
        product_id: 'prod-002',
        price: 8500,
        delivery_fee: 2000,
        listing_type: 'normal',
        reserved: false,
        status: 'active',
        delivery_radius_km: 20,
        pickup_available: true,
        pickup_address: 'Rua Principal, 123, Luanda',
        estimated_delivery_time: 60,
        priority_listing: true,
      },
    ]

    setProducts(mockProducts)
    setListings(mockListings)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'out_of_stock':
        return 'bg-red-100 text-red-800'
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponível'
      case 'out_of_stock':
        return 'Sem Estoque'
      case 'pending_verification':
        return 'Pendente Verificação'
      default:
        return 'Desconhecido'
    }
  }

  const getListingForProduct = (productId: string) => {
    return listings.find((listing: MarketplaceListing) => listing.product_id === productId)
  }

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || product.availability_status === filterStatus
    
    return matchesSearch && matchesStatus
  })

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
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
              <Link href="/fornecedor/dashboard" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
              </Link>
              <nav className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <Link href="/fornecedor/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="/fornecedor/produtos" className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Produtos
                  </Link>
                  <Link href="/fornecedor/pedidos" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Pedidos
                  </Link>
                  <Link href="/fornecedor/relatorios" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Relatórios
                  </Link>
                </div>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">F</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Produtos</h1>
              <p className="mt-2 text-gray-600">Gerencie seus produtos e listagens no marketplace</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Adicionar Produto
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="search"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="min-w-0 flex-1 lg:max-w-xs">
              <select
                value={filterStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">Todos os Status</option>
                <option value="available">Disponível</option>
                <option value="out_of_stock">Sem Estoque</option>
                <option value="pending_verification">Pendente Verificação</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => {
            const listing = getListingForProduct(product.id)
            
            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-w-16 aspect-h-9 relative">
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.availability_status)}`}>
                      {getStatusText(product.availability_status)}
                    </span>
                  </div>

                  {/* Safety Verification Badge */}
                  {product.safety_verified && (
                    <div className="absolute top-2 right-2">
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    </div>
                  )}

                  {/* Priority Listing Badge */}
                  {listing?.priority_listing && (
                    <div className="absolute bottom-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
                      Premium
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center ml-2">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.supplier_rating.toFixed(1)}</span>
                      <span className="ml-1 text-xs text-gray-500">({product.total_reviews})</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                  {/* Product Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tipo:</span>
                      <span className="font-medium">{product.botija_type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Estoque:</span>
                      <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-600' : product.stock_quantity < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock_quantity} unidades
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Preço:</span>
                      <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                    </div>
                    {listing && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Taxa Entrega:</span>
                          <span className="font-medium">{formatPrice(listing.delivery_fee)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tempo Entrega:</span>
                          <span className="font-medium">{listing.estimated_delivery_time || 'N/A'} min</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Listing Status */}
                  {listing && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Status da Listagem:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' :
                          listing.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {listing.status === 'active' ? 'Ativo' : 
                           listing.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Ver
                    </button>
                    <button className="bg-red-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Last Updated */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Atualizado: {formatDate(product.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' ? 
                'Tente ajustar os filtros de busca.' : 
                'Comece adicionando seus primeiros produtos.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar Primeiro Produto
                </button>
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PhotoIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Produtos</dt>
                    <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Disponíveis</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter((p: Product) => p.availability_status === 'available').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <XCircleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sem Estoque</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter((p: Product) => p.availability_status === 'out_of_stock').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pendentes</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter((p: Product) => p.availability_status === 'pending_verification').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}