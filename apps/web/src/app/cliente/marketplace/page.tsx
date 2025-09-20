'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  CheckBadgeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Product {
  id: string
  name: string
  description: string
  price: number
  botija_type: '6kg' | '12kg' | '45kg' | 'outros'
  images: string[]
  supplier: {
    id: string
    name: string
    rating: number
    total_reviews: number
    verified: boolean
    distance_km: number
  }
  listing: {
    delivery_fee: number
    pickup_available: boolean
    estimated_delivery_time: number
    delivery_radius_km: number
  }
  safety_verified: boolean
  certification_expiry: string
  stock_quantity: number
  availability_status: 'available' | 'out_of_stock' | 'pending_verification'
}

interface SearchFilters {
  search: string
  botija_type: string
  price_min: number
  price_max: number
  delivery_type: 'all' | 'delivery' | 'pickup'
  max_distance: number
  min_rating: number
  verified_only: boolean
  sort_by: 'price_asc' | 'price_desc' | 'rating' | 'distance' | 'delivery_time'
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [cart, setCart] = useState<{[productId: string]: number}>({})
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    botija_type: 'all',
    price_min: 0,
    price_max: 50000,
    delivery_type: 'all',
    max_distance: 25,
    min_rating: 0,
    verified_only: false,
    sort_by: 'distance'
  })

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 'prod-001',
        name: 'Botija de Gás 6kg Premium',
        description: 'Botija de gás butano de alta qualidade, 6kg, ideal para uso doméstico',
        price: 6500,
        botija_type: '6kg',
        images: ['/assets/products/gas-6kg-1.jpg'],
        supplier: {
          id: 'sup-001',
          name: 'GasBom Fornecimentos',
          rating: 4.8,
          total_reviews: 152,
          verified: true,
          distance_km: 2.3
        },
        listing: {
          delivery_fee: 1500,
          pickup_available: true,
          estimated_delivery_time: 30,
          delivery_radius_km: 15
        },
        safety_verified: true,
        certification_expiry: '2025-12-31',
        stock_quantity: 45,
        availability_status: 'available'
      },
      {
        id: 'prod-002',
        name: 'Botija de Gás 12kg Económica',
        description: 'Botija de gás butano 12kg com ótimo custo-benefício para famílias',
        price: 7800,
        botija_type: '12kg',
        images: ['/assets/products/gas-12kg-1.jpg'],
        supplier: {
          id: 'sup-002',
          name: 'Distribuidora Luanda Gas',
          rating: 4.6,
          total_reviews: 89,
          verified: true,
          distance_km: 4.1
        },
        listing: {
          delivery_fee: 2000,
          pickup_available: false,
          estimated_delivery_time: 45,
          delivery_radius_km: 20
        },
        safety_verified: true,
        certification_expiry: '2025-08-15',
        stock_quantity: 23,
        availability_status: 'available'
      },
      {
        id: 'prod-003',
        name: 'Botija de Gás 45kg Industrial',
        description: 'Botija de gás propano 45kg para uso comercial e industrial',
        price: 15000,
        botija_type: '45kg',
        images: ['/assets/products/gas-45kg-1.jpg'],
        supplier: {
          id: 'sup-003',
          name: 'Industrial Gas Solutions',
          rating: 4.4,
          total_reviews: 67,
          verified: false,
          distance_km: 8.7
        },
        listing: {
          delivery_fee: 3500,
          pickup_available: true,
          estimated_delivery_time: 90,
          delivery_radius_km: 25
        },
        safety_verified: false,
        certification_expiry: '2024-11-30',
        stock_quantity: 8,
        availability_status: 'available'
      },
      {
        id: 'prod-004',
        name: 'Botija de Gás 6kg Standard',
        description: 'Botija de gás butano 6kg padrão para uso doméstico básico',
        price: 5800,
        botija_type: '6kg',
        images: ['/assets/products/gas-6kg-2.jpg'],
        supplier: {
          id: 'sup-004',
          name: 'EcoGas Luanda',
          rating: 4.2,
          total_reviews: 34,
          verified: true,
          distance_km: 12.5
        },
        listing: {
          delivery_fee: 1800,
          pickup_available: true,
          estimated_delivery_time: 60,
          delivery_radius_km: 18
        },
        safety_verified: true,
        certification_expiry: '2025-06-20',
        stock_quantity: 67,
        availability_status: 'available'
      }
    ]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setLoading(false)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.supplier.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Type filter
    if (filters.botija_type !== 'all') {
      filtered = filtered.filter(product => product.botija_type === filters.botija_type)
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.price_min && product.price <= filters.price_max
    )

    // Delivery type filter
    if (filters.delivery_type === 'delivery') {
      filtered = filtered.filter(product => product.listing.estimated_delivery_time > 0)
    } else if (filters.delivery_type === 'pickup') {
      filtered = filtered.filter(product => product.listing.pickup_available)
    }

    // Distance filter
    filtered = filtered.filter(product => product.supplier.distance_km <= filters.max_distance)

    // Rating filter
    filtered = filtered.filter(product => product.supplier.rating >= filters.min_rating)

    // Verified only filter
    if (filters.verified_only) {
      filtered = filtered.filter(product => product.supplier.verified && product.safety_verified)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sort_by) {
        case 'price_asc':
          return (a.price + a.listing.delivery_fee) - (b.price + b.listing.delivery_fee)
        case 'price_desc':
          return (b.price + b.listing.delivery_fee) - (a.price + a.listing.delivery_fee)
        case 'rating':
          return b.supplier.rating - a.supplier.rating
        case 'distance':
          return a.supplier.distance_km - b.supplier.distance_km
        case 'delivery_time':
          return a.listing.estimated_delivery_time - b.listing.estimated_delivery_time
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }, [products, filters])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev: SearchFilters) => ({ ...prev, [key]: value }))
  }

  const toggleFavorite = (productId: string) => {
    setFavorites((prev: string[]) => 
      prev.includes(productId) 
        ? prev.filter((id: string) => id !== productId)
        : [...prev, productId]
    )
  }

  const addToCart = (productId: string) => {
    setCart((prev: {[productId: string]: number}) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      botija_type: 'all',
      price_min: 0,
      price_max: 50000,
      delivery_type: 'all',
      max_distance: 25,
      min_rating: 0,
      verified_only: false,
      sort_by: 'distance'
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/cliente/dashboard" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <ShoppingCartIcon className="h-6 w-6" />
                {Object.keys(cart).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {Object.values(cart).reduce((sum: number, quantity: number) => sum + quantity, 0)}
                  </span>
                )}
              </button>
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">C</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar botijas de gás, fornecedores..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filtros
          </button>

          <div className="flex flex-wrap gap-2 flex-1">
            {/* Quick Filters */}
            <select
              value={filters.botija_type}
              onChange={(e) => updateFilter('botija_type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="6kg">6kg</option>
              <option value="12kg">12kg</option>
              <option value="45kg">45kg</option>
              <option value="outros">Outros</option>
            </select>

            <select
              value={filters.delivery_type}
              onChange={(e) => updateFilter('delivery_type', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">Entrega e Levantamento</option>
              <option value="delivery">Apenas Entrega</option>
              <option value="pickup">Apenas Levantamento</option>
            </select>

            <label className="flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm">
              <input
                type="checkbox"
                checked={filters.verified_only}
                onChange={(e) => updateFilter('verified_only', e.target.checked)}
                className="mr-2 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              Apenas Verificados
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Ordenar por:</span>
            <select
              value={filters.sort_by}
              onChange={(e) => updateFilter('sort_by', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="distance">Distância</option>
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="delivery_time">Entrega Mais Rápida</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filtros Avançados</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Faixa de Preço (AOA)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={filters.price_max}
                    onChange={(e) => updateFilter('price_max', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(filters.price_max)}</span>
                  </div>
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distância Máxima (km)
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.max_distance}
                    onChange={(e) => updateFilter('max_distance', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-sm text-gray-600">
                    {filters.max_distance} km
                  </div>
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação Mínima
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={filters.min_rating}
                    onChange={(e) => updateFilter('min_rating', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    {filters.min_rating}+
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-9 relative">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <BuildingStorefrontIcon className="h-12 w-12 text-gray-400" />
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:bg-gray-50"
                >
                  {favorites.includes(product.id) ? (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Verification Badge */}
                {product.safety_verified && (
                  <div className="absolute top-2 left-2">
                    <CheckBadgeIcon className="h-6 w-6 text-green-500" />
                  </div>
                )}

                {/* Stock Status */}
                {product.stock_quantity < 10 && (
                  <div className="absolute bottom-2 left-2 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                    Estoque Baixo
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                    {product.name}
                  </h3>
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded ml-2">
                    {product.botija_type}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Supplier Info */}
                <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
                  <div className="flex items-center">
                    <span className="font-medium">{product.supplier.name}</span>
                    {product.supplier.verified && (
                      <CheckBadgeIcon className="h-4 w-4 text-blue-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
                    <span>{product.supplier.rating.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">({product.supplier.total_reviews})</span>
                  </div>
                </div>

                {/* Distance and Delivery */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <MapPinIcon className="h-3 w-3 mr-1" />
                    {product.supplier.distance_km.toFixed(1)} km
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {product.listing.estimated_delivery_time} min
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3">
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.listing.delivery_fee > 0 && (
                      <span className="text-xs text-gray-500 ml-2">
                        + {formatPrice(product.listing.delivery_fee)} entrega
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    Total: {formatPrice(product.price + product.listing.delivery_fee)}
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="flex gap-1 mb-3">
                  {product.listing.estimated_delivery_time > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <TruckIcon className="h-3 w-3 mr-1" />
                      Entrega
                    </span>
                  )}
                  {product.listing.pickup_available && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <BuildingStorefrontIcon className="h-3 w-3 mr-1" />
                      Levantamento
                    </span>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={product.availability_status !== 'available'}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {product.availability_status === 'available' ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros de busca para encontrar mais produtos.
            </p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}