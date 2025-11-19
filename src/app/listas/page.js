'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  Calendar,
  Package,
  ArrowLeft,
  List as ListIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ListasPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);

  // Verificar autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // Buscar listas do usuário
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'shoppingLists'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListas(listasData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar listas:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Criar nova lista
  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newListName.trim()) return;
    
    setCreating(true);

    try {
      await addDoc(collection(db, 'shoppingLists'), {
        name: newListName,
        userId: user.uid,
        userName: user.displayName || user.email,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: false,
        totalItems: 0,
        completedItems: 0
      });

      setNewListName('');
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao criar lista:', error);
      alert('Erro ao criar lista. Tente novamente.');
    } finally {
      setCreating(false);
    }
  };

  // Deletar lista
  const handleDeleteList = async (listId) => {
    if (!confirm('Tem certeza que deseja excluir esta lista?')) return;

    try {
      await deleteDoc(doc(db, 'shoppingLists', listId));
    } catch (error) {
      console.error('Erro ao deletar lista:', error);
      alert('Erro ao deletar lista. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-primary-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Carregando listas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <ListIcon className="w-8 h-8 text-primary-500" />
                <h1 className="text-2xl font-bold text-gray-800">Minhas Listas</h1>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nova Lista
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {listas.length === 0 ? (
          // Estado vazio
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhuma lista ainda
            </h2>
            <p className="text-gray-600 mb-8">
              Crie sua primeira lista de compras para começar!
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Primeira Lista
            </button>
          </div>
        ) : (
          // Grid de listas
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listas.map((lista) => (
              <ListCard
                key={lista.id}
                lista={lista}
                onDelete={handleDeleteList}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de Nova Lista */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Nova Lista
            </h2>
            <form onSubmit={handleCreateList}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Lista
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Supermercado desta semana"
                  autoFocus
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewListName('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3"
                  disabled={creating || !newListName.trim()}
                >
                  {creating ? 'Criando...' : 'Criar Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Card de Lista
function ListCard({ lista, onDelete }) {
  const router = useRouter();
  const progress = lista.totalItems > 0 
    ? Math.round((lista.completedItems / lista.totalItems) * 100) 
    : 0;

  return (
    <div className="card hover:shadow-lg transition-all cursor-pointer group">
      <div onClick={() => router.push(`/listas/${lista.id}`)}>
        {/* Header do Card */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-500 transition-colors mb-1">
              {lista.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(lista.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary-500" />
            <span className="text-sm text-gray-600">
              {lista.totalItems || 0} {lista.totalItems === 1 ? 'item' : 'itens'}
            </span>
          </div>
          {lista.totalItems > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">
                {lista.completedItems || 0} comprados
              </div>
            </div>
          )}
        </div>

        {/* Barra de Progresso */}
        {lista.totalItems > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Status Badge */}
        {lista.completed && (
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mb-4">
            ✓ Concluída
          </div>
        )}
      </div>

      {/* Botão de Deletar */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(lista.id);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Excluir Lista
        </button>
      </div>
    </div>
  );
}
