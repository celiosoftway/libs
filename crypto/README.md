# 🔐 Secure Key Crypto (Node.js)

Biblioteca simples e segura para **criptografia de dados sensíveis**, combinando:

* Senha do usuário
* Arquivo `.key` (alta entropia)
* Contexto opcional (device/environment)

Ideal para:

* Bots de blockchain (ex: Polygon)
* Proteção de chaves privadas
* Sistemas locais com múltiplas camadas de segurança

---

## 🚀 Features

* AES-256-GCM (confidencialidade + integridade)
* Derivação híbrida (`password + keyFile + context`)
* Versionamento automático (`v1`, `v2`)
* Geração segura de `.key`
* Suporte a contexto opcional
* Sem dependências externas

---

## 📦 Instalação

### Local (recomendado durante desenvolvimento)

```bash
npm install ../minha-lib
```

### Ou via `.tgz`

```bash
npm install ./minha-lib-1.0.0.tgz
```

---

## 🧠 Conceito de Segurança

A chave final é derivada de:

```
password + keyFile + context + salt
```

Isso garante:

* Senha fraca → protegida pela `.key`
* Vazamento de dados → inútil sem `.key`
* Execução fora do ambiente → bloqueada (com contexto)

---

## 🔧 Uso Básico

### 1. Gerar `.key`

```js
const { saveKeyToFile } = require("minha-lib");

await saveKeyToFile("key/my_secret_key.key");
```

---

### 2. Carregar `.key`

```js
const fs = require("fs");

const keyFile = fs.readFileSync("key/my_secret_key.key");
```

---

### 3. Criptografar

```js
const { encryptText } = require("minha-lib");

const password = "sua_senha";
const context = getContext(); // opcional

const encrypted = encryptText("abc123", password, keyFile, context);

console.log(encrypted);
```

---

### 4. Descriptografar

```js
const { decryptText } = require("minha-lib");

const decrypted = decryptText(encrypted, password, keyFile, context);

console.log(decrypted);
```

---

## 🌐 Contexto (Opcional)

Exemplo de geração:

```js
const os = require("os");

function getContext() {
  return JSON.stringify({
    hostname: os.hostname(),
    platform: process.platform,
    arch: process.arch
  });
}
```

---

## 🔑 Formato do Payload

```
v1:salt:iv:tag:data
v2:salt:iv:tag:data
```

* `v1` → sem contexto
* `v2` → com contexto

---

## ⚠️ Boas Práticas

### 🔒 Segurança

* Nunca versionar `.key` no Git
* Não armazenar `.key` junto com dados criptografados
* Usar permissões restritas (`chmod 600`)
* Nunca logar `.key`

---

### 🔐 Senha

* Evitar hardcoded
* Usar variáveis de ambiente:

```js
const password = process.env.APP_PASSWORD;
```

---

### 📁 `.key`

* Gerar uma única vez
* Não sobrescrever
* Fazer backup seguro

---

## 🧪 Testes recomendados

* Senha incorreta → deve falhar
* `.key` incorreta → deve falhar
* Contexto diferente → deve falhar (v2)
* Dados alterados → deve falhar

---

## 🧱 Arquitetura

| Versão | Componentes              |
| ------ | ------------------------ |
| v1     | password + key           |
| v2     | password + key + context |

---

## ⚡ Limitações

* Contexto deve ser consistente
* Perda da `.key` = perda de acesso
* Não substitui HSM em ambientes críticos

---

## 🛠️ API

### `saveKeyToFile(path)`

Gera e salva uma `.key` segura.

---

### `encryptText(text, password, keyFile, context?)`

Criptografa dados.

---

### `decryptText(data, password, keyFile, context?)`

Descriptografa dados.

---

## 📌 Roadmap (futuro)

* Key rotation
* Multi-key (recovery)
* Device binding avançado
* Hardening de memória

---

## 📄 Licença

MIT

---

## 💡 Observação

Essa biblioteca foi projetada para ser:

> **simples o suficiente para uso real**
> **segura o suficiente para proteger ativos críticos**

---
