'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  ArrowLeft,
  Plus,
  Check,
  X,
  Trash2,
  ShoppingCart,
  Package
} from 'lucide-react';
import Link from 'next/link';

export default function ListaDetalhesPage() {
  const router = useRouter();
  const params = useParams();
  const listaId = params.id;

  const [user, setUser] = useState(null);
  const [lista, setLista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '1',
    unit: 'un'
  });
  const [adding, setAdding] = useState(false);

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

  // Buscar lista
  useEffect(() => {
    if (!user || !listaId) return;

    const fetchLista = async () => {
      try {
        const listaDoc = await getDoc(doc(db, 'shoppingLists', listaId));
        
        if (listaDoc.exists()) {
          const listaData = { id: listaDoc.id, ...listaDoc.data() };
          
          // Verificar se o usuário é o dono
          if (listaData.userId !== user.uid) {
            alert('Você não tem permissão para acessar esta lista');
            router.push('/listas');
            return;
          }
          
          setLista(listaData);
        } else {
          alert('Lista não encontrada');
          router.push('/listas');
        }
      } catch (error) {
        console.error('Erro ao buscar lista:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLista();

    // Atualizar em tempo real
    const interval = setInterval(fetchLista, 3000);
    return () => clearInterval(interval);
  }, [user, listaId, router]);

  // Adicionar item
  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.name.trim()) return;
    
    setAdding(true);

    try {
      const item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        quantity: newItem.quantity,
        unit: newItem.unit,
        completed: false,
        addedAt: new Date().toISOString()
      };

      const listaRef = doc(db, 'shoppingLists', listaId);
      await updateDoc(listaRef, {
        items: arrayUnion(item),
        totalItems: (lista.items?.length || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      // Atualizar localmente
      setLista(prev => ({
        ...prev,
        items: [...(prev.items || []), item],
        totalItems: (prev.items?.length || 0) + 1
      }));

      setNewItem({ name: '', quantity: '1', unit: 'un' });
      setShowModal(false);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      alert('Erro ao adicionar item. Tente novamente.');
    } finally {
      setAdding(false);
    }
  };

  // Marcar item como comprado/não comprado
  const handleToggleItem = async (item) => {
    try {
      const updatedItem = { ...item, completed: !item.completed };
      const listaRef = doc(db, 'shoppingLists', listaId);
      
      // Remover o item antigo e adicionar o atualizado
      await updateDoc(listaRef, {
        items: arrayRemove(item)
      });
      
      await updateDoc(listaRef, {
        items: arrayUnion(updatedItem),
        completedItems: lista.items.filter(i => i.id !== item.id && i.completed).length + (updatedItem.completed ? 1 : 0),
        updatedAt: new Date().toISOString()
      });

      // Atualizar localmente
      setLista(prev => ({
        ...prev,
        items: prev.items.map(i => i.id === item.id ? updatedItem : i),
        completedItems: prev.items.filter(i => i.id !== item.id && i.completed).length + (updatedItem.completed ? 1 : 0)
      }));
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
    }
  };

  // Remover item
  const handleRemoveItem = async (item) => {
    if (!confirm('Remover este item da lista?')) return;

    try {
      const listaRef = doc(db, 'shoppingLists', listaId);
      await updateDoc(listaRef, {
        items: arrayRemove(item),
        totalItems: (lista.items?.length || 1) - 1,
        completedItems: item.completed ? (lista.completedItems || 1) - 1 : lista.completedItems,
        updatedAt: new Date().toISOString()
      });

      // Atualizar localmente
      setLista(prev => ({
        ...prev,
        items: prev.items.filter(i => i.id !== item.id),
        totalItems: (prev.items?.length || 1) - 1,
        completedItems: item.completed ? (prev.completedItems || 1) - 1 : prev.completedItems
      }));
    } catch (error) {
      console.error('Erro ao remover item:', error);
      alert('Erro ao remover item. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-primary-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Carregando lista...</p>
        </div>
      </div>
    );
  }

  if (!lista) return null;

  const pendingItems = lista.items?.filter(item => !item.completed) || [];
  const completedItems = lista.items?.filter(item => item.completed) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/listas"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{lista.name}</h1>
                <p className="text-sm text-gray-500">
                  {lista.totalItems || 0} {lista.totalItems === 1 ? 'item' : 'itens'} • {lista.completedItems || 0} comprados
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {lista.items?.length === 0 ? (
          // Estado vazio
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Lista vazia
            </h2>
            <p className="text-gray-600 mb-8">
              Adicione itens para começar suas compras
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar Primeiro Item
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Itens Pendentes */}
            {pendingItems.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Para Comprar ({pendingItems.length})
                </h2>
                <div className="space-y-2">
                  {pendingItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onToggle={handleToggleItem}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Itens Comprados */}
            {completedItems.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Comprados ({completedItems.length})
                </h2>
                <div className="space-y-2">
                  {completedItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onToggle={handleToggleItem}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal de Adicionar Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Novo Item
            </h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: Leite, Pão, Arroz..."
                  autoFocus
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade
                  </label>
                  <input
                    type="text"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade
                  </label>
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                    <option value="cx">cx</option>
                    <option value="pct">pct</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewItem({ name: '', quantity: '1', unit: 'un' });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={adding}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-3"
                  disabled={adding || !newItem.name.trim()}
                >
                  {adding ? 'Adicionando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Item
function ItemCard({ item, onToggle, onRemove }) {
  return (
    <div className={`card flex items-center gap-4 ${item.completed ? 'bg-gray-50' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item)}
        className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
          item.completed
            ? 'bg-primary-500 border-primary-500'
            : 'border-gray-300 hover:border-primary-500'
        }`}
      >
        {item.completed && <Check className="w-4 h-4 text-white" />}
      </button>

      {/* Item Info */}
      <div className="flex-1">
        <h3 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
          {item.name}
        </h3>
        <p className="text-sm text-gray-500">
          {item.quantity} {item.unit}
        </p>
      </div>

      {/* Botão Remover */}
      <button
        onClick={() => onRemove(item)}
        className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
