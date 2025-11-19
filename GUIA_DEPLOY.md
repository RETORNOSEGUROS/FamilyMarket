# 🚀 GUIA COMPLETO DE DEPLOY

## 📋 Índice
1. [Criar Projeto no Firebase](#1-criar-projeto-no-firebase)
2. [Configurar Firestore](#2-configurar-firestore)
3. [Criar Repositório no GitHub](#3-criar-repositório-no-github)
4. [Deploy na Vercel](#4-deploy-na-vercel)
5. [Testar o App](#5-testar-o-app)

---

## 1. 🔥 Criar Projeto no Firebase

### Passo 1.1: Acessar o Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em **"Adicionar projeto"** ou **"Create a project"**

### Passo 1.2: Configurar o Projeto

1. **Nome do projeto**: `lista-supermercado` (ou outro nome)
2. Clique em **Continuar**
3. **Google Analytics**: Pode desativar por enquanto (não é necessário no início)
4. Clique em **Criar projeto**
5. Aguarde 30-60 segundos
6. Clique em **Continuar**

### Passo 1.3: Adicionar App Web

1. Na tela inicial, clique no ícone **</>** (Web)
2. **Apelido do app**: `Lista Supermercado Web`
3. ✅ Marque **"Configurar também o Firebase Hosting"**
4. Clique em **Registrar app**

### Passo 1.4: Copiar Configurações (IMPORTANTE!)

Você verá um código assim:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "lista-supermercado-xxxxx.firebaseapp.com",
  projectId: "lista-supermercado-xxxxx",
  storageBucket: "lista-supermercado-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**⚠️ GUARDE ESSAS INFORMAÇÕES!** Você vai precisar delas!

Clique em **Continuar no console**

---

## 2. 🗄️ Configurar Firestore

### Passo 2.1: Criar Banco de Dados

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"** ou **"Create database"**
3. **Modo de produção** ou **Modo de teste**:
   - Escolha **"Modo de teste"** por enquanto (mais fácil para começar)
   - Você pode mudar depois
4. Clique em **Próximo**

### Passo 2.2: Escolher Localização

1. Selecione: **`southamerica-east1` (São Paulo)** ← Mais rápido para Brasil
2. Clique em **Ativar**
3. Aguarde a criação (30-60 segundos)

### Passo 2.3: Configurar Regras de Segurança

1. Na aba **"Regras"**, substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para usuários
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Regras para famílias
    match /families/{familyId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      allow write: if request.auth != null && 
                      request.auth.uid in resource.data.members;
    }
    
    // Regras para produtos
    match /products/{productId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid in get(/databases/$(database)/documents/families/$(resource.data.familyId)).data.members;
    }
    
    // Regras para compras
    match /purchases/{purchaseId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid in get(/databases/$(database)/documents/families/$(resource.data.familyId)).data.members;
    }
    
    // Regras para listas de compras
    match /shoppingLists/{listId} {
      allow read, write: if request.auth != null && 
                            request.auth.uid in get(/databases/$(database)/documents/families/$(resource.data.familyId)).data.members;
    }
  }
}
```

2. Clique em **Publicar**

### Passo 2.4: Ativar Autenticação

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Vamos começar"** ou **"Get started"**
3. Clique na aba **"Sign-in method"**
4. Ative os métodos:
   - ✅ **Email/Senha** (clique, ative, salve)
   - ✅ **Google** (clique, ative, salve)

---

## 3. 📁 Criar Repositório no GitHub

### Passo 3.1: Criar Repositório

1. Acesse: https://github.com/new
2. **Repository name**: `lista-supermercado`
3. **Description**: `App colaborativo de lista de supermercado para famílias`
4. Escolha: **Public** (ou Private se preferir)
5. ❌ **NÃO** marque nenhuma opção de inicializar (README, .gitignore, license)
6. Clique em **Create repository**

### Passo 3.2: Subir o Código

**No seu computador**, abra o terminal na pasta do projeto e execute:

```bash
# 1. Inicializar Git (se ainda não fez)
git init

# 2. Adicionar todos os arquivos
git add .

# 3. Primeiro commit
git commit -m "Initial commit: Lista de Supermercado v1.0"

# 4. Adicionar o repositório remoto (SUBSTITUA pelo SEU usuário!)
git remote add origin https://github.com/SEU-USUARIO/lista-supermercado.git

# 5. Renomear branch para main (padrão GitHub)
git branch -M main

# 6. Enviar para o GitHub
git push -u origin main
```

**Pronto!** Atualize a página do GitHub e verá o código lá! 🎉

---

## 4. ☁️ Deploy na Vercel

### Passo 4.1: Criar Conta na Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize a Vercel a acessar sua conta
4. Complete o cadastro

### Passo 4.2: Importar Projeto

1. No dashboard da Vercel, clique em **"Add New..."** → **"Project"**
2. Encontre o repositório `lista-supermercado`
3. Clique em **"Import"**

### Passo 4.3: Configurar Variáveis de Ambiente (IMPORTANTE!)

Antes de fazer deploy, você precisa adicionar as variáveis do Firebase:

1. Na tela de configuração, encontre **"Environment Variables"**
2. Adicione as seguintes variáveis **UMA POR UMA**:

```
Nome: NEXT_PUBLIC_FIREBASE_API_KEY
Valor: [Cole o apiKey do Firebase]

Nome: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Valor: [Cole o authDomain do Firebase]

Nome: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Valor: [Cole o projectId do Firebase]

Nome: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Valor: [Cole o storageBucket do Firebase]

Nome: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Valor: [Cole o messagingSenderId do Firebase]

Nome: NEXT_PUBLIC_FIREBASE_APP_ID
Valor: [Cole o appId do Firebase]
```

**Exemplo:**
```
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyC1234567890abcdefghijklmnop
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = lista-supermercado-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = lista-supermercado-xxxxx
...
```

### Passo 4.4: Deploy!

1. Depois de adicionar todas as variáveis, clique em **"Deploy"**
2. Aguarde 2-5 minutos
3. 🎉 **Sucesso!** Você verá uma tela de comemoração
4. Clique em **"Visit"** para ver seu app no ar!

### Passo 4.5: Configurar Domínio (Opcional)

A Vercel gera um domínio automático tipo: `lista-supermercado-xxxxx.vercel.app`

Se quiser um domínio personalizado:
1. Vá em **"Settings"** → **"Domains"**
2. Digite seu domínio
3. Siga as instruções para configurar DNS

---

## 5. ✅ Testar o App

### Passo 5.1: Primeiro Acesso

1. Abra a URL do seu app
2. Clique em **"Criar conta"**
3. Cadastre-se com email e senha
4. Confirme o email (Firebase envia automático)
5. Faça login

### Passo 5.2: Criar Primeira Família

1. No dashboard, clique em **"Criar Nova Família"**
2. Digite um nome (ex: "Família Silva")
3. Clique em **"Criar"**

### Passo 5.3: Adicionar Primeiro Produto

1. Vá em **"Estoque"**
2. Clique em **"+ Adicionar Produto"**
3. Preencha:
   - Nome: Azeite de Oliva
   - Quantidade: 1
   - Unidade: Litro
   - Estoque mínimo: 0.2
   - Marque como essencial
4. Clique em **"Salvar"**

### Passo 5.4: Registrar uma Compra

1. Vá em **"Nova Compra"**
2. Selecione o produto
3. Informe quantidade comprada e preço
4. Clique em **"Registrar"**
5. Veja o estoque atualizar automaticamente! ✨

### Passo 5.5: Criar Lista de Compras

1. Vá em **"Listas"**
2. Clique em **"+ Nova Lista"**
3. Dê um nome (ex: "Compras da Semana")
4. Adicione produtos
5. Compartilhe com a família!

### Passo 5.6: Convidar Membros da Família

1. Vá em **"Configurações da Família"**
2. Copie o **"Código de Convite"**
3. Envie para familiares via WhatsApp
4. Eles criam conta e inserem o código
5. Pronto! Agora todos veem as mesmas listas em tempo real! 🎉

---

## 🔄 Atualizações Futuras

### Como atualizar o código:

```bash
# 1. Faça suas alterações no código

# 2. Adicione ao Git
git add .

# 3. Commit
git commit -m "Descrição da mudança"

# 4. Envie para GitHub
git push

# 5. Vercel faz deploy automático! ✨
```

A Vercel detecta automaticamente e faz novo deploy em 2-3 minutos!

---

## 🐛 Solução de Problemas Comuns

### Erro: "Firebase not initialized"
**Solução:** Verifique se copiou TODAS as variáveis de ambiente na Vercel

### Erro: "Permission denied" no Firestore
**Solução:** Verifique as regras de segurança no Firebase Console

### Build falha na Vercel
**Solução:** 
1. Rode `npm run build` localmente
2. Corrija os erros mostrados
3. Faça commit e push novamente

### App não atualiza em tempo real
**Solução:** 
1. Verifique se está logado
2. Confira conexão com internet
3. Teste em aba anônima

### Notificações não funcionam
**Solução:**
1. Aceite permissões no navegador
2. Teste em navegador diferente (Chrome funciona melhor)
3. Verifique configuração do FCM no Firebase

---

## 📊 Monitoramento

### Ver quantos usuários tem:

1. Firebase Console → **Authentication** → Veja total de usuários
2. Firebase Console → **Firestore** → Veja documentos criados
3. Vercel Dashboard → **Analytics** → Veja acessos

### Ver erros:

1. Vercel Dashboard → **Logs** → Veja erros em tempo real
2. Firebase Console → **Firestore** → **Uso** → Monitore leituras/escritas

---

## 🎯 Checklist Final

Antes de compartilhar com usuários:

- [ ] ✅ App funcionando na Vercel
- [ ] ✅ Firebase conectado e funcionando
- [ ] ✅ Consegue criar conta
- [ ] ✅ Consegue criar família
- [ ] ✅ Consegue adicionar produtos
- [ ] ✅ Consegue registrar compras
- [ ] ✅ Consegue criar listas
- [ ] ✅ Testou em celular
- [ ] ✅ Testou instalar como PWA
- [ ] ✅ Convidou pelo menos 1 pessoa e ela conseguiu entrar

---

## 🚀 Próximos Passos

1. **Teste com 3-5 famílias conhecidas**
2. **Colete feedback**
3. **Ajuste baseado no uso real**
4. **Adicione funcionalidades da Fase 2** (QR Code, etc)
5. **Marketing e crescimento!**

---

## 💡 Dicas de Sucesso

1. **Comece pequeno** - Teste com sua família primeiro
2. **Ouça feedback** - Usuários vão pedir coisas que você não imaginou
3. **Itere rápido** - Faça melhorias semanais
4. **Mantenha simples** - Não adicione tudo de uma vez
5. **Monitore uso** - Veja quais features são mais usadas

---

## 📞 Precisa de Ajuda?

- 📧 Abra uma issue no GitHub
- 💬 Entre em contato comigo
- 📚 Leia a documentação do Firebase: https://firebase.google.com/docs
- 📚 Leia a documentação da Vercel: https://vercel.com/docs

---

**Parabéns! 🎉 Seu app está no ar!**

Agora é só compartilhar e ver ele crescer! 🚀
