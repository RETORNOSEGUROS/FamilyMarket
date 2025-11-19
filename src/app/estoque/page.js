'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc,
  deleteDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  Package,
  Plus,
  Search,
  ArrowLeft,
  Edit2,
  Trash2,
  AlertTriangle,
  Filter,
  X
} from 'lucide-react';
import Link from 'next/link';

// Categorias predefinidas
const CATEGORIES = [
  { id: 'frutas', name: '🍎 Frutas', color: 'red' },
  { id: 'vegetais', name: '🥬 Vegetais', color: 'green' },
  { id: 'laticinios', name: '🥛 Laticínios', color: 'blue' },
  { id: 'carnes', name: '🥩 Carnes', color: 'red' },
  { id: 'graos', name: '🌾 Grãos', color: 'yellow' },
  { id: 'bebidas', name: '🥤 Bebidas', color: 'purple' },
  { id: 'limpeza', name: '🧼 Limpeza', color: 'cyan' },
  { id: 'higiene', name: '🧴 Higiene', color: 'pink' },
  { id: 'outros', name: '📦 Outros', color: 'gray' }
];

export default function EstoquePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    quantity: '',
    unit: 'un',
    category: 'outros',
    minQuantity: '2'
  });

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

  // Buscar produtos do usuário
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'products'),
      where('userId', '==', user.uid),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProdutos(produtosData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar produtos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Adicionar produto
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name.trim() || !newProduct.quantity) return;

    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name.trim(),
        quantity: parseFloat(newProduct.quantity),
        unit: newProduct.unit,
        category: newProduct.category,
        minQuantity: parseFloat(newProduct.minQuantity) || 2,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      setNewProduct({
        name: '',
        quantity: '',
        unit: 'un',
        category: 'outros',
        minQuantity: '2'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      alert('Erro ao adicionar produto. Tente novamente.');
    }
  };

  // Atualizar produto
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    
    if (!editingProduct) return;

    try {
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.name.trim(),
        quantity: parseFloat(editingProduct.quantity),
        unit: editingProduct.unit,
        category: editingProduct.category,
        minQuantity: parseFloat(editingProduct.minQuantity),
        updatedAt: new Date().toISOString()
      });

      setShowEditModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Tente novamente.');
    }
  };

  // Deletar produto
  const handleDeleteProduct = async (productId) => {
    if (!confirm('Tem certeza que deseja remover este produto do estoque?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto. Tente novamente.');
    }
  };

  // Ajuste rápido de quantidade
  const handleQuickUpdate = async (product, newQuantity) => {
    try {
      const productRef = doc(db, 'products', product.id);
      await updateDoc(productRef, {
        quantity: parseFloat(newQuantity),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  // Filtrar e ordenar produtos
  const filteredProducts = produtos
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'quantity') {
        return a.quantity - b.quantity;
      } else if (sortBy === 'alert') {
        const aLow = a.quantity <= a.minQuantity;
        const bLow = b.quantity <= b.minQuantity;
        if (aLow && !bLow) return -1;
        if (!aLow && bLow) return 1;
        return 0;
      }
      return 0;
    });

  // Contar produtos com alerta
  const lowStockCount = produtos.filter(p => p.quantity <= p.minQuantity).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-primary-500 animate-bounce mx-auto mb-4" />
          <p className="text-gray-600">Carregando estoque...</p>
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
                <Package className="w-8 h-8 text-primary-500" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Estoque</h1>
                  <p className="text-sm text-gray-500">
                    {produtos.length} {produtos.length === 1 ? 'produto' : 'produtos'}
                    {lowStockCount > 0 && (
                      <span className="text-orange-600 ml-2">
                        • {lowStockCount} acabando
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </button>
          </div>

          {/* Barra de Busca e Filtros */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filtro de Categoria */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas Categorias</option>
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Ordenação */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">Ordenar: A-Z</option>
              <option value="quantity">Ordenar: Quantidade</option>
              <option value="alert">Ordenar: Alertas</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          // Estado vazio
          <div className="text-center py-20">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchTerm || filterCategory !== 'all' 
                ? 'Nenhum produto encontrado' 
                : 'Estoque vazio'}
            </h2>
            <p className="text-gray-600 mb-8">
              {searchTerm || filterCategory !== 'all'
                ? 'Tente outros filtros ou busca'
                : 'Adicione produtos para controlar seu estoque'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Adicionar Primeiro Produto
              </button>
            )}
          </div>
        ) : (
          // Grid de produtos
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteProduct}
                onQuickUpdate={handleQuickUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de Adicionar Produto */}
      {showAddModal && (
        <ProductModal
          title="Novo Produto"
          product={newProduct}
          onChange={setNewProduct}
          onSubmit={handleAddProduct}
          onClose={() => {
            setShowAddModal(false);
            setNewProduct({
              name: '',
              quantity: '',
              unit: 'un',
              category: 'outros',
              minQuantity: '2'
            });
          }}
          submitText="Adicionar"
        />
      )}

      {/* Modal de Editar Produto */}
      {showEditModal && editingProduct && (
        <ProductModal
          title="Editar Produto"
          product={editingProduct}
          onChange={setEditingProduct}
          onSubmit={handleUpdateProduct}
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }}
          submitText="Salvar"
        />
      )}
    </div>
  );
}

// Componente de Card de Produto
function ProductCard({ produto, onEdit, onDelete, onQuickUpdate }) {
  const isLowStock = produto.quantity <= produto.minQuantity;
  const category = CATEGORIES.find(c => c.id === produto.category) || CATEGORIES[CATEGORIES.length - 1];

  return (
    <div className={`card ${isLowStock ? 'border-2 border-orange-500' : ''}`}>
      {/* Alerta de Estoque Baixo */}
      {isLowStock && (
        <div className="flex items-center gap-2 text-orange-600 text-sm font-medium mb-3 pb-3 border-b border-orange-200">
          <AlertTriangle className="w-4 h-4" />
          Estoque baixo!
        </div>
      )}

      {/* Categoria */}
      <div className="text-2xl mb-2">{category.name.split(' ')[0]}</div>

      {/* Nome do Produto */}
      <h3 className="text-lg font-bold text-gray-800 mb-3">{produto.name}</h3>

      {/* Quantidade */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => onQuickUpdate(produto, Math.max(0, produto.quantity - 1))}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
        >
          -
        </button>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-gray-800">
            {produto.quantity}
          </div>
          <div className="text-sm text-gray-500">{produto.unit}</div>
        </div>
        <button
          onClick={() => onQuickUpdate(produto, produto.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold"
        >
          +
        </button>
      </div>

      {/* Mínimo */}
      <div className="text-xs text-gray-500 mb-4">
        Alerta abaixo de: {produto.minQuantity} {produto.unit}
      </div>

      {/* Ações */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(produto)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => onDelete(produto.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Remover
        </button>
      </div>
    </div>
  );
}

// Componente de Modal (Adicionar/Editar)
function ProductModal({ title, product, onChange, onSubmit, onClose, submitText }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Produto
            </label>
            <input
              type="text"
              value={product.name}
              onChange={(e) => onChange({ ...product, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: Arroz, Feijão, Leite..."
              required
              autoFocus
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              value={product.category}
              onChange={(e) => onChange({ ...product, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Quantidade e Unidade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={product.quantity}
                onChange={(e) => onChange({ ...product, quantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade
              </label>
              <select
                value={product.unit}
                onChange={(e) => onChange({ ...product, unit: e.target.value })}
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

          {/* Quantidade Mínima */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alertar quando chegar em:
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={product.minQuantity}
              onChange={(e) => onChange({ ...product, minQuantity: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Você será alertado quando a quantidade ficar abaixo deste valor
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3"
            >
              {submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
