'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function CourierDeliveries() {
  const [activeTab, setActiveTab] = useState('ativos')
  
  // Dados de exemplo para entregas ativas
  const entregasAtivas = [
    { id: '001', cliente: 'João Silva', endereco: 'Av. 4 de Fevereiro, 123', distancia: '2.5 km', valor: '2.500 Kz', tempoEstimado: '15 min' },
    { id: '002', cliente: 'Maria Santos', endereco: 'Rua das Flores, 456', distancia: '1.8 km', valor: '2.200 Kz', tempoEstimado: '12 min' },
  ]
  
  // Dados de exemplo para histórico de entregas
  const historicoEntregas = [
    { id: '003', cliente: 'Carlos Alberto', endereco: 'Rua Direita, 789', distancia: '3.2 km', valor: '2.800 Kz', status: 'Entregue', data: '2025-09-14' },
    { id: '004', cliente: 'Ana Beatriz', endereco: 'Av. Brasil, 321', distancia: '1.5 km', valor: '2.000 Kz', status: 'Entregue', data: '2025-09-14' },
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
                  <Link href="/courier/deliveries" className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                    Entregas
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Histórico
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                    Ganhos
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
                    <span className="text-sm font-medium text-white">C</span>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Courier</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Entregas</h1>
          <p className="mt-2 text-gray-600">Acompanhe suas entregas em tempo real</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Entregas Hoje</dt>
                    <dd className="text-2xl font-semibold text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Ganhos Hoje</dt>
                    <dd className="text-2xl font-semibold text-gray-900">32.500 Kz</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avaliação</dt>
                    <dd className="text-2xl font-semibold text-gray-900">4.9/5</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('ativos')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'ativos'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pedidos Ativos
              </button>
              <button
                onClick={() => setActiveTab('historico')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'historico'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Histórico
              </button>
            </nav>
          </div>

          {/* Conteúdo das Abas */}
          <div className="p-6">
            {activeTab === 'ativos' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Pedidos Ativos</h2>
                {entregasAtivas.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pedido ativo</h3>
                    <p className="mt-1 text-sm text-gray-500">Não há pedidos ativos no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {entregasAtivas.map((entrega) => (
                      <div key={entrega.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">Pedido #{entrega.id}</h3>
                              <p className="mt-1 text-sm text-gray-500">{entrega.cliente}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Ativo
                            </span>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-500">
                              <svg className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {entrega.endereco}
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-gray-500">Distância</p>
                                <p className="text-sm font-medium text-gray-900">{entrega.distancia}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Tempo estimado</p>
                                <p className="text-sm font-medium text-gray-900">{entrega.tempoEstimado}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Valor</p>
                                <p className="text-sm font-medium text-gray-900">{entrega.valor}</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-between">
                            <button className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                              Ver detalhes
                            </button>
                            <button className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                              Aceitar Entrega
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'historico' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Histórico de Entregas</h2>
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
                          Endereço
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Distância
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {historicoEntregas.map((entrega) => (
                        <tr key={entrega.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{entrega.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.cliente}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.endereco}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.distancia}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.valor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.data}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {entrega.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}