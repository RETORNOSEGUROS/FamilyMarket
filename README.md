# 🛒 Lista de Supermercado Familiar

## 📋 Sobre o Projeto

App colaborativo para famílias gerenciarem compras de supermercado, controlar estoque doméstico e economizar dinheiro.

### ✨ Funcionalidades

- 👨‍👩‍👧‍👦 **Múltiplas famílias** - Um usuário pode participar de várias famílias
- 📦 **Controle de estoque** - Visualize o que tem em casa em tempo real
- 🔔 **Alertas inteligentes** - Aviso quando produtos estão acabando
- 🛒 **Listas compartilhadas** - Toda família vê e atualiza em tempo real
- 💰 **Controle de gastos** - Acompanhe quanto gasta por mês
- ⭐ **Produtos essenciais** - Marque o que sempre precisa ter em casa
- 📊 **Gráficos e relatórios** - Visualize seus padrões de consumo
- 📱 **PWA** - Instala como app no celular

---

## 🚀 Tecnologias Usadas

- **Frontend**: Next.js 14 + React 18
- **Estilização**: Tailwind CSS
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Auth
- **Hospedagem**: Vercel
- **Notificações**: Firebase Cloud Messaging

---

## 📦 Estrutura do Projeto

```
lista-supermercado/
├── src/
│   ├── app/                    # Páginas Next.js 14
│   │   ├── layout.js          # Layout principal
│   │   ├── page.js            # Página inicial
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── estoque/           # Controle de estoque
│   │   ├── listas/            # Listas de compras
│   │   └── gastos/            # Relatório de gastos
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── ProductCard.jsx
│   │   ├── StockBar.jsx
│   │   ├── ShoppingList.jsx
│   │   └── ...
│   ├── lib/                   # Configurações e utilitários
│   │   ├── firebase.js       # Config Firebase
│   │   └── firestore.js      # Funções Firestore
│   └── styles/               # Estilos globais
├── public/                    # Arquivos estáticos
│   ├── icons/                # Ícones PWA
│   └── manifest.json         # Configuração PWA
├── firebase.json              # Config Firebase
├── .env.local.example         # Exemplo de variáveis
├── package.json
├── GUIA_DEPLOY.md            # 👈 IMPORTANTE: Guia passo a passo
└── FIRESTORE_ESTRUTURA.md    # 👈 Estrutura do banco de dados
```

---

## ⚡ Instalação Local (Testar antes de subir)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/lista-supermercado.git
cd lista-supermercado
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo:
```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas credenciais do Firebase (ver GUIA_DEPLOY.md)

### 4. Rode localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

---

## 🔥 Deploy (Colocar no ar)

### **LEIA O ARQUIVO `GUIA_DEPLOY.md` PARA INSTRUÇÕES COMPLETAS!**

Resumo rápido:
1. Criar projeto no Firebase
2. Criar repositório no GitHub
3. Conectar na Vercel
4. Configurar variáveis de ambiente
5. Deploy automático! ✨

---

## 🗄️ Estrutura do Firestore

### **LEIA O ARQUIVO `FIRESTORE_ESTRUTURA.md` PARA DETALHES COMPLETOS!**

Coleções principais:
- `users` - Dados dos usuários
- `families` - Informações das famílias
- `products` - Produtos no estoque
- `purchases` - Histórico de compras
- `shoppingLists` - Listas de compras ativas

---

## 🎯 Próximos Passos (Depois de funcionar)

### Fase 2 - Recursos Avançados
- [ ] Scanner de QR Code
- [ ] Comparação de preços
- [ ] Sugestões com IA
- [ ] Gamificação (rankings, conquistas)
- [ ] Receitas integradas

### Fase 3 - Monetização
- [ ] Versão Premium
- [ ] Dashboard para supermercados
- [ ] API para marcas/indústrias
- [ ] Programa de afiliados

---

## 📱 Como Instalar como App (PWA)

### Android (Chrome):
1. Abra o site no Chrome
2. Toque nos 3 pontos (⋮)
3. Selecione "Adicionar à tela inicial"
4. Pronto! Ícone na tela como app

### iOS (Safari):
1. Abra o site no Safari
2. Toque no ícone de compartilhar (↑)
3. Role e toque em "Adicionar à Tela de Início"
4. Toque em "Adicionar"

---

## 🐛 Problemas Comuns

### Firebase não conecta
- Verifique se copiou TODAS as variáveis do `.env.local`
- Confirme que o projeto Firebase está ativo
- Veja se as regras do Firestore estão corretas

### Build falha na Vercel
- Rode `npm run build` localmente primeiro
- Verifique se as variáveis de ambiente estão na Vercel
- Veja os logs de erro na Vercel

### Notificações não funcionam
- Verifique se o usuário aceitou permissões
- Confirme que o FCM está configurado
- Teste em navegador diferente

---

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar!

---

## 🤝 Contribuindo

Adoraríamos sua contribuição!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 👨‍💻 Autor

Criado com ❤️ para ajudar famílias a economizarem!

**Dúvidas?** Abra uma issue no GitHub!

---

## 🎯 Roadmap do Projeto

- [x] ✅ MVP Básico (v1.0)
- [ ] 🔄 Scanner QR Code (v1.1)
- [ ] 🔄 Comparação de preços (v1.2)
- [ ] 🔄 App nativo React Native (v2.0)
- [ ] 🔄 Dashboard B2B (v3.0)

---

**Vamos economizar juntos! 💰🛒**
