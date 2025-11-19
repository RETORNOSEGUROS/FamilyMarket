// src/lib/firestore.js
// Funções para interagir com o Firestore de forma fácil

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// USUÁRIOS (users)
// ============================================

/**
 * Criar ou atualizar perfil do usuário
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    // Se não existe, cria
    try {
      await setDoc(doc(db, 'users', userId), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      console.error('Erro ao criar perfil:', err);
      return { success: false, error: err.message };
    }
  }
};

/**
 * Buscar perfil do usuário
 */
export const getUserProfile = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
    }
    return { success: false, error: 'Usuário não encontrado' };
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// FAMÍLIAS (families)
// ============================================

/**
 * Criar nova família
 */
export const createFamily = async (userId, familyData) => {
  try {
    const familyRef = await addDoc(collection(db, 'families'), {
      ...familyData,
      members: [userId],
      adminId: userId,
      inviteCode: generateInviteCode(),
      stats: {
        totalProducts: 0,
        totalPurchases: 0,
        totalSpent: 0,
        membersCount: 1,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    });

    // Adicionar família ao perfil do usuário
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      families: arrayUnion(familyRef.id),
      activeFamilyId: familyRef.id,
    });

    return { success: true, familyId: familyRef.id };
  } catch (error) {
    console.error('Erro ao criar família:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar famílias do usuário
 */
export const getUserFamilies = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return { success: false, error: 'Usuário não encontrado' };
    }

    const familyIds = userDoc.data().families || [];
    const families = [];

    for (const familyId of familyIds) {
      const familyDoc = await getDoc(doc(db, 'families', familyId));
      if (familyDoc.exists()) {
        families.push({ id: familyDoc.id, ...familyDoc.data() });
      }
    }

    return { success: true, data: families };
  } catch (error) {
    console.error('Erro ao buscar famílias:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Entrar em família com código de convite
 */
export const joinFamilyWithCode = async (userId, inviteCode) => {
  try {
    // Buscar família pelo código
    const q = query(
      collection(db, 'families'),
      where('inviteCode', '==', inviteCode.toUpperCase()),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, error: 'Código inválido' };
    }

    const familyDoc = querySnapshot.docs[0];
    const familyId = familyDoc.id;
    const familyData = familyDoc.data();

    // Verificar se já é membro
    if (familyData.members.includes(userId)) {
      return { success: false, error: 'Você já é membro desta família' };
    }

    // Adicionar usuário à família
    await updateDoc(doc(db, 'families', familyId), {
      members: arrayUnion(userId),
      'stats.membersCount': familyData.members.length + 1,
      updatedAt: serverTimestamp(),
    });

    // Adicionar família ao usuário
    await updateDoc(doc(db, 'users', userId), {
      families: arrayUnion(familyId),
      activeFamilyId: familyId,
    });

    return { success: true, familyId, familyName: familyData.name };
  } catch (error) {
    console.error('Erro ao entrar na família:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// PRODUTOS (products)
// ============================================

/**
 * Adicionar produto ao estoque
 */
export const addProduct = async (familyId, userId, productData) => {
  try {
    const productRef = await addDoc(collection(db, 'products'), {
      familyId,
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: userId,
    });

    // Atualizar contador na família
    const familyRef = doc(db, 'families', familyId);
    await updateDoc(familyRef, {
      'stats.totalProducts': increment(1),
    });

    return { success: true, productId: productRef.id };
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar produtos da família
 */
export const getFamilyProducts = async (familyId) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('familyId', '==', familyId),
      orderBy('name')
    );
    const querySnapshot = await getDocs(q);

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: products };
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar produtos acabando
 */
export const getLowStockProducts = async (familyId) => {
  try {
    const allProducts = await getFamilyProducts(familyId);
    if (!allProducts.success) return allProducts;

    // Filtrar produtos onde currentStock <= minStock
    const lowStock = allProducts.data.filter(
      (product) => product.currentStock <= product.minStock
    );

    return { success: true, data: lowStock };
  } catch (error) {
    console.error('Erro ao buscar produtos em falta:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Atualizar produto
 */
export const updateProduct = async (productId, updates) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// COMPRAS (purchases)
// ============================================

/**
 * Registrar compra
 */
export const registerPurchase = async (familyId, userId, purchaseData) => {
  try {
    // Adicionar compra
    const purchaseRef = await addDoc(collection(db, 'purchases'), {
      familyId,
      userId,
      ...purchaseData,
      purchaseDate: serverTimestamp(),
      createdAt: serverTimestamp(),
    });

    // Atualizar estoque do produto
    const productRef = doc(db, 'products', purchaseData.productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
      const currentStock = productDoc.data().currentStock || 0;
      await updateDoc(productRef, {
        currentStock: currentStock + purchaseData.quantity,
        lastPrice: purchaseData.unitPrice,
        lastPurchase: serverTimestamp(),
      });
    }

    // Atualizar stats da família
    const familyRef = doc(db, 'families', familyId);
    await updateDoc(familyRef, {
      'stats.totalPurchases': increment(1),
      'stats.totalSpent': increment(purchaseData.totalPrice),
    });

    return { success: true, purchaseId: purchaseRef.id };
  } catch (error) {
    console.error('Erro ao registrar compra:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar compras do mês
 */
export const getMonthlyPurchases = async (familyId, year, month) => {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const q = query(
      collection(db, 'purchases'),
      where('familyId', '==', familyId),
      where('purchaseDate', '>=', startDate),
      where('purchaseDate', '<=', endDate),
      orderBy('purchaseDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const purchases = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: purchases };
  } catch (error) {
    console.error('Erro ao buscar compras:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// LISTAS DE COMPRAS (shoppingLists)
// ============================================

/**
 * Criar lista de compras
 */
export const createShoppingList = async (familyId, userId, listData) => {
  try {
    const listRef = await addDoc(collection(db, 'shoppingLists'), {
      familyId,
      createdBy: userId,
      ...listData,
      status: 'active',
      items: listData.items || [],
      totalItems: listData.items?.length || 0,
      completedItems: 0,
      sharedWith: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, listId: listRef.id };
  } catch (error) {
    console.error('Erro ao criar lista:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Buscar listas ativas da família
 */
export const getActiveLists = async (familyId) => {
  try {
    const q = query(
      collection(db, 'shoppingLists'),
      where('familyId', '==', familyId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const lists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: lists };
  } catch (error) {
    console.error('Erro ao buscar listas:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Marcar item como comprado
 */
export const markItemCompleted = async (listId, itemIndex, userId) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    const listDoc = await getDoc(listRef);

    if (!listDoc.exists()) {
      return { success: false, error: 'Lista não encontrada' };
    }

    const items = listDoc.data().items;
    items[itemIndex].completed = true;
    items[itemIndex].completedBy = userId;
    items[itemIndex].completedAt = serverTimestamp();

    const completedCount = items.filter((item) => item.completed).length;

    await updateDoc(listRef, {
      items,
      completedItems: completedCount,
      lastEditedBy: userId,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao marcar item:', error);
    return { success: false, error: error.message };
  }
};

// ============================================
// UTILITÁRIOS
// ============================================

/**
 * Gerar código de convite aleatório
 */
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Ouvir mudanças em tempo real
 */
export const subscribeToCollection = (collectionName, conditions, callback) => {
  let q = collection(db, collectionName);

  if (conditions) {
    conditions.forEach((condition) => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
  }

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// Importações que faltaram
import { setDoc, arrayUnion, increment } from 'firebase/firestore';
