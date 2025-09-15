'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    // Aqui você pode adicionar a lógica para enviar o email
    alert(`Obrigado! Enviaremos atualizações para ${email}`)
    setEmail('')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="#hero" className="flex-shrink-0 flex items-center animate-fade-in">
                <img className="h-8 w-auto" src="/assets/logo-wordmark.png" alt="GasRápido" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {[
                  { label: 'Início', href: '#hero' },
                  { label: 'Como Funciona', href: '#how-it-works' },
                  { label: 'Clientes', href: '#clientes' },
                  { label: 'Entregadores', href: '#entregadores' },
                  { label: 'Fornecedores', href: '#fornecedores' },
                  { label: 'Testemunhos', href: '#testemunhos' },
                  { label: 'Perguntas Frequentes', href: '#faq' },
                  { label: 'Contactos', href: '#footer' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-gray-300 hover:text-yellow-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <Link
                href="#inscricao"
                className="bg-yellow-400 text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-300 transition-colors duration-200 animate-pulse"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-16 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center animate-fade-in-up">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
                Receba Gás em <span className="text-yellow-400">Minutos</span>
              </h1>
              <p className="mt-4 text-xl text-gray-300 animate-fade-in delay-100">
                A forma mais rápida, simples e segura de ter gás em casa ou na sua empresa.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in delay-200">
                <Link
                  href="#clientes"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 text-center"
                >
                  Sou Cliente
                </Link>
                <Link
                  href="#entregadores"
                  className="bg-gray-800 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-gray-700 transition-colors duration-200 text-center"
                >
                  Quero Entregar
                </Link>
                <Link
                  href="#fornecedores"
                  className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-gray-800 transition-colors duration-200 text-center"
                >
                  Sou Fornecedor
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-8 animate-fade-in delay-300">
                {[
                  { number: '10k+', label: 'Clientes Satisfeitos' },
                  { number: '500+', label: 'Entregadores Activos' },
                  { number: '200+', label: 'Fornecedores Parceiros' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center transform hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-yellow-400">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in delay-400">
              <img
                src="/assets/hero-delivery.png"
                alt="Entrega de Gás"
                className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h2 className="text-3xl font-bold">Como Funciona o GasRápido?</h2>
            <p className="mt-4 text-xl text-gray-300">
              3 passos simples para garantir o seu gás em minutos
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: '/assets/icons/order.png',
                title: 'Faça o Pedido',
                description: 'Selecione o tipo de botija, quantidade e insira a morada de entrega.'
              },
              {
                icon: '/assets/icons/delivery.png',
                title: 'Entregador Aceita',
                description: 'O entregador mais próximo aceita a sua encomenda e inicia o percurso.'
              },
              {
                icon: '/assets/icons/fast.png',
                title: 'Receba em Minutos',
                description: 'Receba a botija à sua porta com total segurança e rapidez.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex justify-center">
                  <img src={step.icon} alt={step.title} className="h-16 w-16 transform hover:rotate-12 transition-transform duration-300" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center animate-fade-in delay-500">
            <Link
              href="#inscricao-clientes"
              className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 inline-block"
            >
              Peça Agora
            </Link>
          </div>
        </div>
      </section>

      {/* Clientes */}
      <section id="clientes" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="/assets/cliente-app.png"
                alt="App para Clientes"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold">Vantagens para Clientes</h2>
              <p className="mt-4 text-xl text-gray-300">
                Acabe com as filas e telefonemas demorados. No GasRápido, o processo é 100% digital e instantâneo.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Entrega rápida e confiável',
                  'Pagamento seguro na aplicação',
                  'Acompanhamento em tempo real',
                  'Histórico de encomendas disponível'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/inscricao-clientes"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 inline-block"
                >
                  Registar-me como Cliente
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entregadores */}
      <section id="entregadores" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:order-2">
              <img
                src="/assets/entregador-app.png"
                alt="App para Entregadores"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="md:w-1/2 md:pr-12 md:order-1">
              <h2 className="text-3xl font-bold">Ganhe Dinheiro Como Entregador</h2>
              <p className="mt-4 text-xl text-gray-300">
                Flexibilidade total. Escolha os pedidos que deseja aceitar e aumente a sua renda.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Receba por cada entrega realizada',
                  'Horários flexíveis',
                  'App simples e intuitiva',
                  'Suporte 24/7'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/inscricao-entregadores"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 inline-block"
                >
                  Inscrever-me como Entregador
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fornecedores */}
      <section id="fornecedores" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <img
                src="/assets/fornecedor-dashboard.png"
                alt="Dashboard para Fornecedores"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold">Parceiros Fornecedores</h2>
              <p className="mt-4 text-xl text-gray-300">
                Expanda o seu negócio ligando-se a milhares de clientes e entregadores através da nossa plataforma.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Mais visibilidade para o seu negócio',
                  'Gestão simplificada de encomendas',
                  'Pagamentos garantidos',
                  'Apoio dedicado'
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <svg className="h-6 w-6 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/inscricao-fornecedores"
                  className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 inline-block"
                >
                  Tornar-me Fornecedor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Porque escolher o GasRápido?</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '/assets/icons/speed.png',
                title: 'Entrega em Minutos',
                description: 'Priorizamos a rapidez. O entregador mais próximo é sempre acionado.'
              },
              {
                icon: '/assets/icons/security.png',
                title: 'Segurança em Primeiro Lugar',
                description: 'Todos os entregadores e fornecedores são verificados e validados.'
              },
              {
                icon: '/assets/icons/support.png',
                title: 'Suporte 24/7',
                description: 'Estamos disponíveis para si em qualquer momento.'
              },
              {
                icon: '/assets/icons/tracking.png',
                title: 'Acompanhamento em Tempo Real',
                description: 'Saiba exatamente onde está a sua encomenda a cada segundo.'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center">
                  <img src={feature.icon} alt={feature.title} className="h-12 w-12" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section id="testemunhos" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">O que dizem os nossos utilizadores?</h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Maria Silva',
                role: 'Cliente',
                photo: '/assets/users/maria.png',
                text: 'Nunca foi tão fácil pedir gás. Fiz o pedido no telemóvel e em menos de 20 minutos a botija estava em casa.'
              },
              {
                name: 'João Pereira',
                role: 'Entregador',
                photo: '/assets/users/joao.png',
                text: 'Consigo ganhar um bom rendimento extra. A aplicação é simples e os pagamentos são rápidos.'
              },
              {
                name: 'Fábrica Luz&Gás',
                role: 'Fornecedor',
                photo: '/assets/users/fornecedor.png',
                text: 'Conseguimos aumentar as vendas e ter mais clientes sem esforço. O GasRápido trouxe-nos visibilidade.'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center">
                  <img className="h-12 w-12 rounded-full" src={testimonial.photo} alt={testimonial.name} />
                  <div className="ml-4">
                    <h4 className="text-lg font-bold">{testimonial.name}</h4>
                    <p className="text-yellow-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-300">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Perguntas Frequentes</h2>
          </div>
          <div className="mt-16 space-y-6">
            {[
              {
                question: 'Quanto tempo demora a entrega?',
                answer: 'Em média, a entrega é realizada em menos de 30 minutos, dependendo da localização.'
              },
              {
                question: 'Posso pagar com cartão ou apenas dinheiro?',
                answer: 'Aceitamos cartão, transferência e também dinheiro no ato da entrega.'
              },
              {
                question: 'Sou entregador, preciso de viatura própria?',
                answer: 'Sim, é necessário ter um meio de transporte seguro para transportar botijas de gás.'
              },
              {
                question: 'Como funciona para fornecedores?',
                answer: 'Os fornecedores registam-se na plataforma e recebem pedidos diretamente, com pagamentos garantidos.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-black rounded-lg p-6">
                <h3 className="text-xl font-bold">{faq.question}</h3>
                <p className="mt-2 text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-black to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold">Pronto para experimentar o futuro da entrega de gás?</h2>
          <p className="mt-4 text-xl text-gray-300">
            Registe-se agora como Cliente, Entregador ou Fornecedor e faça parte da revolução.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/inscricao-clientes"
              className="bg-yellow-400 text-black px-6 py-3 rounded-md text-base font-bold hover:bg-yellow-300 transition-colors duration-200 text-center"
            >
              Sou Cliente
            </Link>
            <Link
              href="/inscricao-entregadores"
              className="bg-gray-800 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-gray-700 transition-colors duration-200 text-center"
            >
              Sou Entregador
            </Link>
            <Link
              href="/inscricao-fornecedores"
              className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-md text-base font-bold hover:bg-gray-800 transition-colors duration-200 text-center"
            >
              Sou Fornecedor
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img className="h-8 w-auto" src="/assets/logo-symbol.png" alt="GasRápido" />
              <p className="mt-4 text-gray-400">
                © 2025 GasRápido. Todos os direitos reservados.
              </p>
              <div className="mt-4 flex space-x-4">
                {[
                  { icon: 'facebook', href: 'https://facebook.com/gasrapido' },
                  { icon: 'instagram', href: 'https://instagram.com/gasrapido' },
                  { icon: 'whatsapp', href: 'https://wa.me/seunumerogasrapido' }
                ].map((social, index) => (
                  <a key={index} href={social.href} className="text-gray-400 hover:text-yellow-400">
                    <span className="sr-only">{social.icon}</span>
                    <div className="h-6 w-6 bg-gray-700 rounded-full flex items-center justify-center">
                      {social.icon.charAt(0).toUpperCase()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">Links</h3>
              <ul className="mt-4 space-y-2">
                {[
                  { label: 'Política de Privacidade', href: '/privacidade' },
                  { label: 'Termos de Uso', href: '/termos' },
                  { label: 'Ajuda & Suporte', href: '/suporte' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-gray-400 hover:text-yellow-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contactos</h3>
              <ul className="mt-4 space-y-2 text-gray-400">
                <li>suporte@gasrapido.com</li>
                <li>+244 900 000 000</li>
                <li>Luanda, Angola</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Newsletter</h3>
              <p className="mt-4 text-gray-400">
                Receba novidades e promoções exclusivas.
              </p>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    placeholder="Insira o seu email"
                    className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-yellow-400 text-black px-4 py-2 rounded-r-md font-bold hover:bg-yellow-300 transition-colors duration-200"
                  >
                    Subscrever
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}