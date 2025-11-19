# 🗄️ ESTRUTURA DO FIRESTORE

## 📋 Visão Geral

Este documento descreve TODA a estrutura do banco de dados Firestore do app.

---

## 🗂️ Coleções Principais

O Firestore é organizado em **coleções** (como pastas) que contêm **documentos** (como arquivos).

```
firestore/
├── users/              # Usuários do sistema
├── families/           # Famílias (grupos)
├── products/           # Produtos no estoque
├── purchases/          # Histórico de compras
├── shoppingLists/      # Listas de compras
└── priceHistory/       # Histórico de preços (futuro)
```

---

## 1. 👤 Coleção: `users`

**Caminho:** `/users/{userId}`

Armazena informações dos usuários cadastrados.

### Estrutura do Documento:

```javascript
{
  // ID do documento = UID do Firebase Auth
  
  // Dados básicos
  "name": "João Silva",
  "email": "joao.silva@email.com",
  "phone": "+5551999887766",
  "avatar": "https://...", // URL da foto (opcional)
  
  // Famílias que participa
  "families": [
    "family123abc",
    "family456def"
  ],
  
  // Família ativa no momento
  "activeFamilyId": "family123abc",
  
  // Preferências
  "preferences": {
    "notifications": true,
    "emailAlerts": true,
    "theme": "light", // light ou dark
    "language": "pt-BR"
  },
  
  // Metadados
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "lastLogin": Timestamp
}
```

### Exemplo Real:

```javascript
{
  "name": "Maria Santos",
  "email": "maria@email.com",
  "phone": "+5551987654321",
  "families": ["fam_xyz789"],
  "activeFamilyId": "fam_xyz789",
  "preferences": {
    "notifications": true,
    "emailAlerts": false,
    "theme": "light",
    "language": "pt-BR"
  },
  "createdAt": "2025-01-15T10:30:00Z",
  "updatedAt": "2025-01-15T10:30:00Z",
  "lastLogin": "2025-01-15T10:30:00Z"
}
```

---

## 2. 👨‍👩‍👧‍👦 Coleção: `families`

**Caminho:** `/families/{familyId}`

Representa uma família (grupo de usuários).

### Estrutura do Documento:

```javascript
{
  // ID do documento = gerado automaticamente
  
  // Informações básicas
  "name": "Família Silva",
  "description": "Nossa família feliz",
  "avatar": "https://...", // Logo/foto da família (opcional)
  
  // Membros (array de user IDs)
  "members": [
    "user123abc",
    "user456def",
    "user789ghi"
  ],
  
  // Admin da família (quem criou)
  "adminId": "user123abc",
  
  // Orçamento mensal
  "budget": {
    "monthly": 800.00, // R$ 800
    "alert": 700.00    // Avisa quando chegar em R$ 700
  },
  
  // Código de convite (para novos membros)
  "inviteCode": "SILVA2025",
  
  // Estatísticas
  "stats": {
    "totalProducts": 45,
    "totalPurchases": 127,
    "totalSpent": 3450.50,
    "membersCount": 3
  },
  
  // Metadados
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "createdBy": "user123abc"
}
```

### Exemplo Real:

```javascript
{
  "name": "Família Santos",
  "description": "Casa da vó Maria",
  "members": ["user_abc", "user_def", "user_ghi"],
  "adminId": "user_abc",
  "budget": {
    "monthly": 1200.00,
    "alert": 1000.00
  },
  "inviteCode": "SANTOS2025",
  "stats": {
    "totalProducts": 32,
    "totalPurchases": 89,
    "totalSpent": 2340.80,
    "membersCount": 3
  },
  "createdAt": "2025-01-10T08:00:00Z",
  "updatedAt": "2025-01-15T14:30:00Z",
  "createdBy": "user_abc"
}
```

---

## 3. 📦 Coleção: `products`

**Caminho:** `/products/{productId}`

Produtos no estoque de cada família.

### Estrutura do Documento:

```javascript
{
  // ID do documento = gerado automaticamente
  
  // Relação com família
  "familyId": "family123abc",
  
  // Informações do produto
  "name": "Azeite de Oliva Extra Virgem",
  "brand": "Gallo", // Marca (opcional)
  "category": "Temperos",
  "barcode": "7891234567890", // Código de barras (opcional)
  "image": "https://...", // URL da imagem (opcional)
  
  // Controle de estoque
  "currentStock": 0.5,    // Quantidade atual
  "maxStock": 1.0,        // Estoque máximo desejado
  "minStock": 0.2,        // Alerta quando chegar neste valor
  "unit": "litro",        // Unidade de medida
  
  // Classificação
  "isEssential": true,    // Produto essencial (sempre precisa ter)
  "isFavorite": false,    // Produto favorito
  
  // Preço
  "lastPrice": 12.50,     // Último preço pago
  "averagePrice": 13.20,  // Preço médio histórico
  
  // Consumo estimado
  "averageConsumption": {
    "value": 0.5,         // Consome 0.5L
    "period": "week"      // por semana
  },
  
  // Metadados
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "createdBy": "user123abc",
  "lastPurchase": Timestamp
}
```

### Categorias Sugeridas:

```javascript
const CATEGORIES = [
  "Alimentos Básicos",      // Arroz, feijão, macarrão
  "Carnes e Peixes",        // Carne, frango, peixe
  "Laticínios",             // Leite, queijo, iogurte
  "Frutas e Verduras",      // Frutas, legumes, verduras
  "Bebidas",                // Refrigerante, suco, água
  "Limpeza",                // Detergente, sabão, desinfetante
  "Higiene Pessoal",        // Shampoo, sabonete, pasta de dente
  "Temperos",               // Sal, azeite, vinagre
  "Congelados",             // Sorvete, lasanha congelada
  "Padaria",                // Pão, bolo, biscoitos
  "Outros"                  // Demais produtos
];
```

### Unidades de Medida:

```javascript
const UNITS = [
  "unidade",    // un
  "kg",         // quilograma
  "g",          // grama
  "litro",      // L
  "ml",         // mililitro
  "pacote",     // pacote
  "caixa",      // caixa
  "lata",       // lata
  "garrafa",    // garrafa
  "dúzia"       // dúzia
];
```

### Exemplo Real:

```javascript
{
  "familyId": "fam_xyz789",
  "name": "Arroz Tipo 1",
  "brand": "Tio João",
  "category": "Alimentos Básicos",
  "barcode": "7896000000001",
  "currentStock": 3.0,
  "maxStock": 5.0,
  "minStock": 1.0,
  "unit": "kg",
  "isEssential": true,
  "isFavorite": true,
  "lastPrice": 6.50,
  "averagePrice": 6.80,
  "averageConsumption": {
    "value": 2.0,
    "period": "week"
  },
  "createdAt": "2025-01-12T09:00:00Z",
  "updatedAt": "2025-01-15T16:20:00Z",
  "createdBy": "user_abc",
  "lastPurchase": "2025-01-15T16:20:00Z"
}
```

---

## 4. 🛒 Coleção: `purchases`

**Caminho:** `/purchases/{purchaseId}`

Histórico de todas as compras realizadas.

### Estrutura do Documento:

```javascript
{
  // ID do documento = gerado automaticamente
  
  // Relações
  "familyId": "family123abc",
  "userId": "user123abc",      // Quem comprou
  "productId": "product456def", // O que comprou
  
  // Informações da compra
  "productName": "Azeite de Oliva", // Nome no momento da compra
  "quantity": 1.0,
  "unit": "litro",
  "unitPrice": 12.50,
  "totalPrice": 12.50,
  
  // Onde comprou
  "market": {
    "name": "Carrefour",
    "branch": "Shopping Center", // Filial (opcional)
    "location": {
      "lat": -30.0346,
      "lng": -51.2177
    }
  },
  
  // Foto da nota fiscal (opcional)
  "receiptImage": "https://...",
  
  // Observações
  "notes": "Estava em promoção",
  
  // Data da compra
  "purchaseDate": Timestamp,
  "createdAt": Timestamp
}
```

### Exemplo Real:

```javascript
{
  "familyId": "fam_xyz789",
  "userId": "user_abc",
  "productId": "prod_123",
  "productName": "Feijão Preto",
  "quantity": 2.0,
  "unit": "kg",
  "unitPrice": 8.90,
  "totalPrice": 17.80,
  "market": {
    "name": "Atacadão",
    "branch": "Centro",
    "location": {
      "lat": -30.0346,
      "lng": -51.2177
    }
  },
  "notes": "Preço ótimo, promoção de fim de semana",
  "purchaseDate": "2025-01-15T10:30:00Z",
  "createdAt": "2025-01-15T10:35:00Z"
}
```

---

## 5. 📋 Coleção: `shoppingLists`

**Caminho:** `/shoppingLists/{listId}`

Listas de compras compartilhadas da família.

### Estrutura do Documento:

```javascript
{
  // ID do documento = gerado automaticamente
  
  // Relações
  "familyId": "family123abc",
  "createdBy": "user123abc",
  
  // Informações da lista
  "name": "Compras do Mês",
  "description": "Lista principal de janeiro",
  "icon": "🛒", // Emoji opcional
  
  // Status
  "status": "active", // active, completed, archived
  
  // Itens da lista
  "items": [
    {
      "productId": "product456def",
      "productName": "Arroz",
      "quantity": 5.0,
      "unit": "kg",
      "estimatedPrice": 32.50,
      "priority": "high",      // high, medium, low
      "isEssential": true,
      "completed": false,
      "completedBy": null,
      "completedAt": null,
      "notes": "Preferir tipo 1"
    },
    {
      "productId": "product789ghi",
      "productName": "Feijão",
      "quantity": 2.0,
      "unit": "kg",
      "estimatedPrice": 17.80,
      "priority": "medium",
      "isEssential": true,
      "completed": true,
      "completedBy": "user456def",
      "completedAt": Timestamp,
      "notes": ""
    }
  ],
  
  // Totais
  "totalItems": 2,
  "completedItems": 1,
  "estimatedTotal": 50.30,
  "actualTotal": 17.80,
  
  // Colaboração
  "sharedWith": ["user123abc", "user456def"],
  "lastEditedBy": "user456def",
  
  // Metadados
  "createdAt": Timestamp,
  "updatedAt": Timestamp,
  "completedAt": null
}
```

### Exemplo Real:

```javascript
{
  "familyId": "fam_xyz789",
  "createdBy": "user_abc",
  "name": "Compras da Semana",
  "description": "Lista para o fim de semana",
  "icon": "🛒",
  "status": "active",
  "items": [
    {
      "productId": "prod_123",
      "productName": "Leite Integral",
      "quantity": 3.0,
      "unit": "litro",
      "estimatedPrice": 12.00,
      "priority": "high",
      "isEssential": true,
      "completed": false,
      "completedBy": null,
      "completedAt": null,
      "notes": "Marca Piracanjuba"
    },
    {
      "productId": "prod_456",
      "productName": "Papel Higiênico",
      "quantity": 1.0,
      "unit": "pacote",
      "estimatedPrice": 15.90,
      "priority": "medium",
      "isEssential": false,
      "completed": true,
      "completedBy": "user_def",
      "completedAt": "2025-01-15T11:00:00Z",
      "notes": "Comprei o com 12 rolos"
    }
  ],
  "totalItems": 2,
  "completedItems": 1,
  "estimatedTotal": 27.90,
  "actualTotal": 15.90,
  "sharedWith": ["user_abc", "user_def"],
  "lastEditedBy": "user_def",
  "createdAt": "2025-01-14T08:00:00Z",
  "updatedAt": "2025-01-15T11:00:00Z",
  "completedAt": null
}
```

---

## 6. 💰 Coleção: `priceHistory` (Futuro - Fase 2)

**Caminho:** `/priceHistory/{priceId}`

Histórico de preços reportados por usuários.

### Estrutura do Documento:

```javascript
{
  // Informações do produto
  "productName": "Azeite de Oliva",
  "barcode": "7891234567890",
  "brand": "Gallo",
  
  // Preço
  "price": 12.50,
  
  // Onde
  "market": {
    "name": "Carrefour",
    "branch": "Shopping",
    "city": "Porto Alegre",
    "state": "RS",
    "location": {
      "lat": -30.0346,
      "lng": -51.2177
    }
  },
  
  // Quem reportou
  "userId": "user123abc",
  "userName": "João", // Opcional, para anonimato
  
  // Validação comunitária
  "votes": {
    "upvotes": 5,   // Pessoas que confirmaram o preço
    "downvotes": 0  // Pessoas que discordaram
  },
  
  // Foto da prateleira/etiqueta (opcional)
  "priceTagImage": "https://...",
  
  // Metadados
  "reportedAt": Timestamp,
  "expiresAt": Timestamp // Validade do preço (30 dias)
}
```

---

## 🔍 Queries Comuns (Consultas)

### Buscar produtos de uma família:

```javascript
const products = await db.collection('products')
  .where('familyId', '==', familyId)
  .orderBy('name')
  .get();
```

### Buscar produtos acabando:

```javascript
const lowStock = await db.collection('products')
  .where('familyId', '==', familyId)
  .where('currentStock', '<=', 'minStock')
  .get();
```

### Buscar compras do mês:

```javascript
const startOfMonth = new Date(2025, 0, 1); // Janeiro
const endOfMonth = new Date(2025, 0, 31);

const purchases = await db.collection('purchases')
  .where('familyId', '==', familyId)
  .where('purchaseDate', '>=', startOfMonth)
  .where('purchaseDate', '<=', endOfMonth)
  .orderBy('purchaseDate', 'desc')
  .get();
```

### Buscar listas ativas:

```javascript
const lists = await db.collection('shoppingLists')
  .where('familyId', '==', familyId)
  .where('status', '==', 'active')
  .orderBy('createdAt', 'desc')
  .get();
```

---

## 📊 Índices Necessários

Para queries compostas, você precisa criar índices no Firebase:

1. **products**:
   - `familyId` + `currentStock` (ASC)
   - `familyId` + `isEssential` (DESC)
   - `familyId` + `category` (ASC)

2. **purchases**:
   - `familyId` + `purchaseDate` (DESC)
   - `familyId` + `userId` (ASC)
   - `productId` + `purchaseDate` (DESC)

3. **shoppingLists**:
   - `familyId` + `status` (ASC)
   - `familyId` + `createdAt` (DESC)

**O Firebase pede para criar quando você faz a query pela primeira vez!**

---

## 🔒 Segurança (Regras já configuradas)

As regras do Firestore garantem que:

- ✅ Usuários só veem dados de famílias que participam
- ✅ Apenas membros podem editar dados da família
- ✅ Usuários não veem dados de outras famílias
- ✅ Produtos/compras/listas são privados por família

---

## 📈 Escalabilidade

### Limites do Firestore (Gratuito):

- **Leituras**: 50.000/dia
- **Escritas**: 20.000/dia
- **Deleções**: 20.000/dia
- **Armazenamento**: 1 GB

### Estimativa de uso:

**Para 100 famílias ativas:**
- ~300 leituras/dia por família = 30.000 leituras ✅
- ~50 escritas/dia por família = 5.000 escritas ✅
- Armazenamento: ~100 MB ✅

**Tudo dentro do plano gratuito! 🎉**

---

## 🎯 Próximas Coleções (Futuro)

### Fase 2:
- `notifications` - Notificações personalizadas
- `achievements` - Conquistas/gamificação
- `recipes` - Receitas integradas

### Fase 3:
- `marketPartners` - Supermercados parceiros
- `promotions` - Promoções/cupons
- `analytics` - Dados agregados (B2B)

---

**Pronto! Agora você entende toda a estrutura do banco de dados! 🎉**
