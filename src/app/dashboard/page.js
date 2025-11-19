'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  LogOut,
  Plus,
  Bell,
  Menu,
  X,
  Home,
  BarChart3,
  List
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Buscar dados do usuário no Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-primary-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-8 h-8 text-primary-500" />
              <h1 className="text-xl font-bold text-gray-800">Lista Mercado</h1>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-600 hover:text-primary-500 flex items-center gap-2">
                <Home className="w-5 h-5" />
                Início
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Estoque
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 flex items-center gap-2">
                <List className="w-5 h-5" />
                Listas
              </a>
              <a href="#" className="text-gray-600 hover:text-primary-500 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Gastos
              </a>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-primary-500">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {userData?.name || user?.displayName || 'Usuário'}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {(userData?.name || user?.displayName || 'U')[0].toUpperCase()}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500"
                title="Sair"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-2">
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 inline mr-2" />
                Início
              </a>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 inline mr-2" />
                Estoque
              </a>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <List className="w-5 h-5 inline mr-2" />
                Listas
              </a>
              <a href="#" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Gastos
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5 inline mr-2" />
                Sair
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Olá, {userData?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Bem-vindo'}! 👋
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das suas compras e estoque
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<ShoppingCart className="w-8 h-8" />}
            title="Listas Ativas"
            value="3"
            change="+2 esta semana"
            color="blue"
          />
          <StatCard
            icon={<Package className="w-8 h-8" />}
            title="Produtos em Estoque"
            value="47"
            change="8 acabando"
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Gasto no Mês"
            value="R$ 1.240"
            change="-15% vs mês passado"
            color="purple"
          />
          <StatCard
            icon={<Users className="w-8 h-8" />}
            title="Membros da Família"
            value={userData?.familyId ? "4" : "Só você"}
            change={userData?.familyId ? "4 ativos" : "Convide sua família"}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nova Lista */}
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                <Plus className="w-6 h-6 text-primary-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Criar Nova Lista
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece uma nova lista de compras para o supermercado
                </p>
                <button className="btn-primary">
                  Criar Lista
                </button>
              </div>
            </div>
          </div>

          {/* Convidar Família */}
          <div className="card hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Users className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  Convidar Família
                </h3>
                <p className="text-gray-600 mb-4">
                  Compartilhe listas e organize compras juntos
                </p>
                <button className="px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-50">
                  Enviar Convite
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Atividade Recente
          </h3>
          <div className="space-y-4">
            <ActivityItem
              title="Lista de Supermercado criada"
              time="Há 2 horas"
              icon={<List className="w-5 h-5 text-blue-500" />}
            />
            <ActivityItem
              title="Produto 'Leite' adicionado ao estoque"
              time="Há 5 horas"
              icon={<Package className="w-5 h-5 text-green-500" />}
            />
            <ActivityItem
              title="Compra registrada - R$ 145,00"
              time="Ontem"
              icon={<ShoppingCart className="w-5 h-5 text-purple-500" />}
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-primary-500 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">
                🎉 Comece a economizar agora!
              </h3>
              <p className="opacity-90">
                Configure sua primeira lista e convide sua família para começar a organizar as compras
              </p>
            </div>
            <button className="bg-white text-primary-500 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 whitespace-nowrap">
              Começar Tour
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente de Card de Estatística
function StatCard({ icon, title, value, change, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500',
    orange: 'bg-orange-50 text-orange-500'
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{change}</p>
    </div>
  );
}

// Componente de Item de Atividade
function ActivityItem({ title, time, icon }) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{title}</p>
        <p className="text-sm text-gray-500">{time}</p>
      </div>
    </div>
  );
}
