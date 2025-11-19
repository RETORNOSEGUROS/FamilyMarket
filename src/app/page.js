'use client';

// src/app/page.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Users, TrendingDown, Bell, Check } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-8 h-8 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-800">Lista Mercado</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 text-primary-500 hover:text-primary-600"
          >
            Entrar
          </button>
          <button
            onClick={() => router.push('/cadastro')}
            className="btn-primary"
          >
            Começar Grátis
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-6">
          Sua família gasta <span className="text-danger-500">R$ 200/mês</span>
          <br />
          em comida que estraga.
          <br />
          <span className="text-primary-500">Nós evitamos isso.</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Organize as compras da família, controle o estoque de casa e economize dinheiro.
          Tudo em tempo real.
        </p>
        <button
          onClick={() => router.push('/cadastro')}
          className="btn-primary text-lg px-8 py-4"
        >
          Começar a Economizar - É Grátis! 🚀
        </button>
        <p className="text-sm text-gray-500 mt-4">
          ✅ Gratuito para sempre • ✅ Sem cartão de crédito • ✅ 2 minutos para começar
        </p>
      </section>

      {/* Funcionalidades */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Como Funciona
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature
            icon={<Users className="w-12 h-12" />}
            title="Família Conectada"
            description="Todos veem as mesmas listas em tempo real. Quem comprar, marca."
          />
          <Feature
            icon={<ShoppingCart className="w-12 h-12" />}
            title="Controle de Estoque"
            description="Veja o que tem em casa e quanto ainda resta de cada produto."
          />
          <Feature
            icon={<Bell className="w-12 h-12" />}
            title="Alertas Inteligentes"
            description="Receba aviso quando produtos estão acabando. Nunca mais fique sem."
          />
          <Feature
            icon={<TrendingDown className="w-12 h-12" />}
            title="Economize Dinheiro"
            description="Veja quanto gasta por mês e evite compras duplicadas."
          />
        </div>
      </section>

      {/* Benefícios */}
      <section className="bg-primary-50 py-20">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">
            Resultados Reais
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Stat number="R$ 250" label="Economia média/mês" />
            <Stat number="3 horas" label="Tempo economizado" />
            <Stat number="40%" label="Menos desperdício" />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          O que as famílias dizem
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Testimonial
            name="Maria Silva"
            text="Paramos de comprar coisas duplicadas! Economizamos R$ 180 no primeiro mês."
            avatar="👩"
          />
          <Testimonial
            name="João Santos"
            text="Finalmente conseguimos organizar as compras da casa. Super prático!"
            avatar="👨"
          />
          <Testimonial
            name="Ana Costa"
            text="Os alertas de produtos acabando são perfeitos. Nunca mais faltou nada."
            avatar="👱‍♀️"
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-primary-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">
            Comece a economizar hoje
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de famílias que já estão economizando
          </p>
          <button
            onClick={() => router.push('/cadastro')}
            className="bg-white text-primary-500 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-100"
          >
            Criar Conta Grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Lista Mercado. Feito com ❤️ para ajudar famílias.</p>
          <p className="text-sm text-gray-400 mt-2">
            Contato: contato@listamercado.com
          </p>
        </div>
      </footer>
    </div>
  );
}

// Componentes auxiliares
function Feature({ icon, title, description }) {
  return (
    <div className="card text-center">
      <div className="text-primary-500 flex justify-center mb-4">{icon}</div>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Stat({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary-500 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

function Testimonial({ name, text, avatar }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">{avatar}</div>
        <div className="font-bold">{name}</div>
      </div>
      <p className="text-gray-600 italic">"{text}"</p>
      <div className="flex text-yellow-400 mt-4">
        {'⭐'.repeat(5)}
      </div>
    </div>
  );
}
