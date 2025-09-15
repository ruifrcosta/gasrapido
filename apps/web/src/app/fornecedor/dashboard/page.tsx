'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FornecedorDashboard() {
  const [activeTab, setActiveTab] = useState('pedidos')
  
  // Dados de exemplo para pedidos
  const pedidos = [
    { id: '001', cliente: 'João Silva', produto: 'Botija 13kg', quantidade: 1, status: 'Pendente', valor: '8.500 Kz', data: '2025-09-15' },
    { id: '002', cliente: 'Maria Santos', produto: 'Botija 6kg', quantidade: 2, status: 'Em Processamento', valor: '12.000 Kz', data: '2025-09-15' },
    { id: '003', cliente: 'Carlos Alberto', produto: 'Botija 13kg', quantidade: 1, status: 'Enviado', valor: '8.500 Kz', data: '2025-09-14' },
  ]
  
  // Dados de exemplo para produtos
  const produtos = [
    { id: 1, nome: 'Botija de Gás 13kg', preco: '8.500 Kz', estoque: 50, status: 'Disponível' },
    { id: 2, nome: 'Botija de Gás 6kg', preco: '6.000 Kz', estoque: 30, status: 'Disponível' },
    { id: 3, nome: 'Botija de Gás 3kg', preco: '3.500 Kz', estoque: 15, status: 'Baixo Estoque' },
  ]
  
  // Dados de exemplo para estatísticas
  const estatisticas = [
    { titulo: 'Total de Pedidos', valor: '1,234', variacao: '+12%', tipo: 'positivo' },
    { titulo: 'Receita Total', valor: 'AOA 854.200', variacao: '+8%', tipo: 'positivo' },
    { titulo: 'Produtos em Estoque', valor: '95', variacao: '-3', tipo: 'negativo' },
    { titulo: 'Avaliação Média', valor: '4.8/5', variacao: '+0.2', tipo: 'positivo' },
  ]

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
                  <Link href="/fornecedor/dashboard" className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Bem-vindo ao painel de controle do fornecedor GasRápido</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {estatisticas.map((stat, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 text-gray-400">
                      {stat.titulo === 'Total de Pedidos' && (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                      {stat.titulo === 'Receita Total' && (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {stat.titulo === 'Produtos em Estoque' && (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                      {stat.titulo === 'Avaliação Média' && (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.titulo}</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">{stat.valor}</div>
                        <div className={`ml-2 flex items-baseline text-sm font-semibold ${stat.tipo === 'positivo' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.tipo === 'positivo' ? (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {stat.variacao}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Abas */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'pedidos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos Recentes
              </button>
              <button
                onClick={() => setActiveTab('produtos')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'produtos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meus Produtos
              </button>
            </nav>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {activeTab === 'pedidos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Pedidos Recentes</h2>
                  <Link href="#" className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                    Ver todos
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
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
                          Valor
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Ações</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pedidos.map((pedido) => (
                        <tr key={pedido.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pedido.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.cliente}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.produto}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.quantidade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.valor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pedido.data}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              pedido.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                              pedido.status === 'Em Processamento' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {pedido.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href="#" className="text-primary-600 hover:text-primary-900">
                              Ver detalhes
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'produtos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Meus Produtos</h2>
                  <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                    Adicionar Produto
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {produtos.map((produto) => (
                    <div key={produto.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{produto.nome}</h3>
                            <p className="mt-1 text-2xl font-semibold text-gray-900">{produto.preco}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            produto.status === 'Disponível' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {produto.status}
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">Estoque: {produto.estoque} unidades</p>
                        </div>
                        <div className="mt-6 flex justify-between">
                          <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                            Editar
                          </button>
                          <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}