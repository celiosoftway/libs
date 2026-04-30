# dynamic-env-manager

Um utilitário leve e eficiente para manipular arquivos .env programaticamente durante a execução de scripts Node.js. 

Diferente do dotenv padrão, que foca apenas na leitura inicial das variáveis, este utilitário permite atualizar e persistir novas variáveis de ambiente no disco em tempo real.

## 🌟 Caso de Uso Principal: Web3 & Hardhat

Este projeto é ideal para gerenciar endereços de contratos e chaves privadas geradas automaticamente durante testes ou deploys em redes locais (como Hardhat ou Anvil). 

Com este utilitário, seus scripts de deploy podem salvar o endereço de um contrato recém-criado diretamente no arquivo .env, permitindo que scripts de teste subsequentes ou o frontend leiam o valor atualizado sem a necessidade de copiar e colar manualmente.

## 🚀 Instalação

npm install dynamic-env-manager

## 🛠️ Como usar

### Uso Geral
```
const { updateEnv, getEnv } = require('dynamic-env-manager');

// Adiciona ou atualiza uma variável no arquivo .env
updateEnv('API_KEY', 'abc-123-xyz');

// Recupera o valor atualizado
const key = getEnv('API_KEY');
console.log(key); // Saída: abc-123-xyz
```

### Exemplo em Scripts de Deploy (Hardhat)
```
const env = require('dynamic-env-manager');
const { ethers } = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  // Salva o endereço automaticamente para uso futuro
  env.updateEnv('LAST_CONTRACT_ADDRESS', address);
  
  console.log("Endereço do contrato salvo no .env!");
}

main().catch(console.error);
```

## 📖 API

### updateEnv(key, value)
Lê o arquivo .env atual na raiz do projeto, insere ou atualiza a chave fornecida e salva o arquivo novamente.
- key: Nome da variável (String).
- value: Valor a ser atribuído (String/Number).
- Nota: Se o arquivo .env não existir, ele será criado automaticamente.

### getEnv(key)
Retorna o valor de uma chave específica diretamente do arquivo .env.
- Retorna String ou undefined.

### getAllEnv()
Lê todo o arquivo e retorna um objeto Map contendo todos os pares chave-valor processados.

## 🔍 Detalhes Técnicos
- Sincronização: Utiliza métodos síncronos do módulo fs para garantir a integridade da escrita durante scripts de automação.
- Limpeza: O parser ignora linhas vazias e comentários ao carregar as variáveis para o Map interno.
- Zero Dependências: Construído puramente com módulos nativos do Node.js (fs e path).

## 📄 Licença
MIT