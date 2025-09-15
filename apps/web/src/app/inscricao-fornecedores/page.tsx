'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function FornecedorInscricao() {
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    nomeResponsavel: '',
    email: '',
    telefone: '',
    endereco: '',
    nif: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log('Dados do formulário:', formData)
    alert('Inscrição de fornecedor enviada com sucesso!')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/landing" className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/assets/logo-wordmark.png" alt="GasRápido" />
              </Link>
            </div>
            <div>
              <Link
                href="/landing"
                className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium"
              >
                Voltar para Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold">Inscrição de Fornecedor</h1>
          <p className="mt-2 text-gray-400">
            Junte-se ao GasRápido e expanda seu negócio
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  id="nomeEmpresa"
                  name="nomeEmpresa"
                  value={formData.nomeEmpresa}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-300 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  id="nomeResponsavel"
                  name="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Nome completo do responsável"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="email@empresa.com"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="+244 900 000 000"
                />
              </div>

              <div>
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-300 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Endereço completo da empresa"
                />
              </div>

              <div>
                <label htmlFor="nif" className="block text-sm font-medium text-gray-300 mb-1">
                  NIF (Número de Identificação Fiscal)
                </label>
                <input
                  type="text"
                  id="nif"
                  name="nif"
                  value={formData.nif}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Número de identificação fiscal"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Palavra-passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="********"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirmar Palavra-passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="********"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-yellow-400 focus:ring-yellow-500 border-gray-600 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                Concordo com os <Link href="#" className="text-yellow-400 hover:text-yellow-300">Termos de Serviço</Link> e <Link href="#" className="text-yellow-400 hover:text-yellow-300">Política de Privacidade</Link>
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 w-full md:w-auto"
              >
                Tornar-me Fornecedor
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link href="#" className="text-yellow-400 hover:text-yellow-300">
                Iniciar sessão
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img className="h-8 w-auto mx-auto" src="/assets/logo-symbol.png" alt="GasRápido" />
            <p className="mt-4 text-gray-400">
              © 2025 GasRápido. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}