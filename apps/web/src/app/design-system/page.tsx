'use client'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar de demonstração */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-500">GasRápido</h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Design System</a>
                <a className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Componentes</a>
                <a className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Documentação</a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-primary-500 text-primary-500 hover:bg-primary-50 h-9 px-3 text-sm">
                Entrar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Design System</h1>
          <p className="mt-4 text-xl text-gray-600">
            Componentes reutilizáveis do GasRápido seguindo as especificações do design system
          </p>
        </div>

        {/* Seção de Botões */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Botões</h2>
          <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
            <div className="p-6 pt-0">
              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-10 px-4 py-2">
                  Primary
                </button>
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-accent-400 text-black hover:bg-accent-500 h-10 px-4 py-2">
                  Secondary
                </button>
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-primary-500 text-primary-500 hover:bg-primary-50 h-10 px-4 py-2">
                  Outline
                </button>
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-primary-500 hover:bg-primary-50 h-10 px-4 py-2">
                  Ghost
                </button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-9 px-3 text-sm">
                  Small
                </button>
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-10 px-4 py-2">
                  Medium
                </button>
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-11 px-8 text-lg">
                  Large
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Inputs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Inputs</h2>
          <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
            <div className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="seu.email@exemplo.com"
                    type="email"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="********"
                    type="password"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Erro
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-error-500 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-error-500"
                    placeholder="Campo com erro"
                  />
                  <p className="mt-1 text-sm text-error-500">Este campo é obrigatório</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Badges */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Badges</h2>
          <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
            <div className="p-6 pt-0">
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary-500 text-white">
                  Default
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-accent-400 text-black">
                  Secondary
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-error-500 text-white">
                  Destructive
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-900 border-gray-200">
                  Outline
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Formulários */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Formulários</h2>
          <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
            <div className="p-6 pt-0">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="seu.email@exemplo.com"
                      type="email"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Senha
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="********"
                      type="password"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar Senha
                    </label>
                    <input
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="********"
                      type="password"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    Concordo com os <a href="#" className="text-primary-500 hover:text-primary-700">Termos de Serviço</a>
                  </label>
                </div>
                <div className="flex justify-center">
                  <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-11 px-8 text-lg">
                    Registrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Tabelas */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tabelas</h2>
          <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
            <div className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">João Silva</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">joao.silva@exemplo.com</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Desenvolvedor</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary-500 text-white">
                          Ativo
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maria Santos</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">maria.santos@exemplo.com</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Designer</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-accent-400 text-black">
                          Pendente
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Carlos Alberto</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">carlos.alberto@exemplo.com</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Gerente</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-error-500 text-white">
                          Inativo
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Alertas */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Alertas</h2>
          <div className="space-y-6">
            <div className="rounded-md p-4 bg-blue-50 border border-blue-200">
              <h5 className="text-sm font-medium mb-1">Informação</h5>
              <div className="text-sm">Este é um alerta padrão com informações importantes.</div>
            </div>
            
            <div className="rounded-md p-4 bg-green-50 border border-green-200">
              <h5 className="text-sm font-medium mb-1">Sucesso</h5>
              <div className="text-sm">A operação foi concluída com sucesso.</div>
            </div>
            
            <div className="rounded-md p-4 bg-yellow-50 border border-yellow-200">
              <h5 className="text-sm font-medium mb-1">Aviso</h5>
              <div className="text-sm">Por favor, verifique as informações antes de continuar.</div>
            </div>
            
            <div className="rounded-md p-4 bg-red-50 border border-red-200">
              <h5 className="text-sm font-medium mb-1">Erro</h5>
              <div className="text-sm">Ocorreu um erro durante a operação. Por favor, tente novamente.</div>
            </div>
          </div>
        </section>

        {/* Seção de Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold">Card Simples</h3>
              </div>
              <div className="p-6 pt-0">
                <p className="text-gray-600">
                  Este é um exemplo de card simples com cabeçalho e conteúdo.
                </p>
              </div>
              <div className="p-6 pt-0">
                <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-10 px-4 py-2">
                  Ação
                </button>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold">Card com Badge</h3>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-accent-400 text-black mt-2">
                  Novo
                </span>
              </div>
              <div className="p-6 pt-0">
                <p className="text-gray-600">
                  Este card inclui um badge para mostrar status ou tags.
                </p>
              </div>
            </div>
            
            <div className="rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm">
              <div className="p-6 pt-0">
                <h3 className="text-lg font-bold">Card Sem Cabeçalho</h3>
                <p className="text-gray-600 mt-2">
                  Este card não tem cabeçalho separado, apenas conteúdo.
                </p>
                <div className="mt-4 flex justify-between">
                  <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-primary-500 text-primary-500 hover:bg-primary-50 h-10 px-4 py-2">
                    Cancelar
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary-500 text-white hover:bg-primary-600 h-10 px-4 py-2">
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer de demonstração */}
      <footer className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white">GasRápido</h3>
              <p className="mt-4 text-gray-400">
                © 2025 GasRápido. Todos os direitos reservados.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Links</h3>
              <div className="mt-4">
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Sobre</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Contato</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Ajuda</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Legal</h3>
              <div className="mt-4">
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Termos</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Privacidade</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Cookies</a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Redes Sociais</h3>
              <div className="mt-4">
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white block mt-2">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}