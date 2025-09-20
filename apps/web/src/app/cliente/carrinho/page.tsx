'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface CartItem {
  id: string
  productId: string
  name: string
  description: string
  price: number
  quantity: number
  image: string
  supplier: {
    id: string
    name: string
  }
  weight: string
  inStock: boolean
}

interface DeliveryOption {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
  icon: any
}

export default function CarrinhoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState('')
  const [selectedDelivery, setSelectedDelivery] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('multicaixa')
  const [promoCode, setPromoCode] = useState('')
  const [loading, setLoading] = useState(true)

  // Mock cart data
  useEffect(() => {
    const mockCartItems: CartItem[] = [
      {
        id: 'cart-001',
        productId: 'gas-001',
        name: 'Botija de Gás 6kg',
        description: 'Botija de gás butano de 6kg, ideal para uso doméstico pequeno',
        price: 6500,
        quantity: 2,
        image: '/assets/products/gas-6kg.jpg',
        supplier: {
          id: 'sup-001',
          name: 'Posto Central'
        },
        weight: '6kg',
        inStock: true
      },
      {
        id: 'cart-002',
        productId: 'gas-002',
        name: 'Botija de Gás 13kg',
        description: 'Botija de gás butano de 13kg, perfeita para famílias grandes',
        price: 8500,
        quantity: 1,
        image: '/assets/products/gas-13kg.jpg',
        supplier: {
          id: 'sup-002',
          name: 'Gás Express'
        },
        weight: '13kg',
        inStock: true
      },
      {
        id: 'cart-003',
        productId: 'acc-001',
        name: 'Regulador de Pressão Universal',
        description: 'Regulador de pressão universal compatível com todas as botijas',
        price: 2500,
        quantity: 1,
        image: '/assets/products/regulator.jpg',
        supplier: {
          id: 'sup-001',
          name: 'Posto Central'
        },
        weight: '200g',
        inStock: true
      }
    ]
    
    setCartItems(mockCartItems)
    setLoading(false)
  }, [])

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'express',
      name: 'Entrega Expressa',
      description: 'Entrega em até 30 minutos',
      price: 2000,
      estimatedTime: '30 min',
      icon: TruckIcon
    },
    {
      id: 'standard',
      name: 'Entrega Padrão',
      description: 'Entrega em até 2 horas',
      price: 1500,
      estimatedTime: '2 horas',
      icon: TruckIcon
    },
    {
      id: 'scheduled',
      name: 'Entrega Agendada',
      description: 'Escolha o melhor horário',
      price: 1000,
      estimatedTime: 'Agendada',
      icon: TruckIcon
    }
  ]

  const paymentMethods = [
    { id: 'multicaixa', name: 'Multicaixa Express', description: 'Pagamento via telefone' },
    { id: 'card', name: 'Cartão de Crédito/Débito', description: 'Visa, Mastercard' },
    { id: 'cash', name: 'Dinheiro na Entrega', description: 'Pague ao receber' }
  ]

  const addresses = [
    'Rua Principal, 123, Luanda',
    'Avenida Central, 456, Luanda',
    'Bairro Maianga, Rua 15, Casa 789, Luanda'
  ]

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId)
      return
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryPrice = () => {
    const option = deliveryOptions.find(opt => opt.id === selectedDelivery)
    return option?.price || 0
  }

  const getTax = () => {
    return Math.round(getSubtotal() * 0.14) // 14% IVA
  }

  const getTotal = () => {
    return getSubtotal() + getDeliveryPrice() + getTax()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert('Por favor, selecione um endereço de entrega')
      return
    }
    
    // Redirect to checkout or process order
    alert('Redirecionando para finalização do pedido...')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando carrinho...</p>
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
              <Link href="/cliente/marketplace" className="flex items-center text-gray-500 hover:text-gray-700 mr-4">
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Voltar ao Marketplace
              </Link>
              <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">C</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carrinho de Compras</h1>
          <p className="mt-2 text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} no seu carrinho
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-12">
            <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Seu carrinho está vazio</h3>
            <p className="mt-1 text-sm text-gray-500">
              Adicione alguns produtos para começar suas compras.
            </p>
            <div className="mt-6">
              <Link
                href="/cliente/marketplace"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Itens do Carrinho</h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Limpar Carrinho
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-start">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-gray-400 text-xs">Produto</span>
                        </div>

                        {/* Product Details */}
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Fornecedor: <span className="font-medium">{item.supplier.name}</span>
                              </p>
                              <p className="text-sm text-gray-500">Peso: {item.weight}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-medium text-gray-900">{formatPrice(item.price)}</p>
                              <p className="text-sm text-gray-500">por unidade</p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="mx-3 text-lg font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded-md border border-gray-300 hover:bg-gray-50"
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-4">
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    Endereço de Entrega
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {addresses.map((address, index) => (
                      <label key={index} className="flex items-start">
                        <input
                          type="radio"
                          name="address"
                          value={address}
                          checked={selectedAddress === address}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-900">{address}</span>
                      </label>
                    ))}
                  </div>
                  <button className="mt-4 text-sm text-primary-600 hover:text-primary-800">
                    + Adicionar novo endereço
                  </button>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 flex items-center">
                    <TruckIcon className="h-5 w-5 mr-2" />
                    Opções de Entrega
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <label key={option.id} className="flex items-start">
                        <input
                          type="radio"
                          name="delivery"
                          value={option.id}
                          checked={selectedDelivery === option.id}
                          onChange={(e) => setSelectedDelivery(e.target.value)}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{formatPrice(option.price)}</p>
                              <p className="text-sm text-gray-500">{option.estimatedTime}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white shadow rounded-lg sticky top-24">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Resumo do Pedido</h2>
                </div>

                <div className="p-6">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">{formatPrice(getSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Entrega</span>
                      <span className="text-gray-900">{formatPrice(getDeliveryPrice())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IVA (14%)</span>
                      <span className="text-gray-900">{formatPrice(getTax())}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-900">Total</span>
                        <span className="text-lg font-bold text-primary-600">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="mt-6">
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Código promocional"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium text-gray-700 hover:bg-gray-200">
                        Aplicar
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      Método de Pagamento
                    </h3>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-start">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{method.name}</p>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    Finalizar Pedido
                  </button>

                  <div className="mt-4 text-center">
                    <Link
                      href="/cliente/marketplace"
                      className="text-sm text-primary-600 hover:text-primary-800"
                    >
                      Continuar Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}