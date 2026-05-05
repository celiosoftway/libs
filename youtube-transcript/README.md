# 📺 YouTube Transcript Lib

Uma biblioteca Node.js simples e robusta para extrair transcrições de vídeos do YouTube.

---

## ✨ Features

* 🔍 Extração automática de captions via API interna do YouTube
* 🌎 Suporte a múltiplos idiomas
* 📄 Retorno em texto puro
* 💾 Salvamento opcional em arquivo
* 📁 Criação automática de diretórios
* ⚡ Zero dependência de browser

---

## 📦 Instalação

```bash
npm install youtube-transcript-lib
```

---

## 🚀 Uso básico

```js
const { getTranscriptTxt } = require('youtube-transcript-lib');

(async () => {
  const transcript = await getTranscriptTxt('kkUzhl02eac');
  console.log(transcript);
})();
```

---

## 💾 Salvando em arquivo

```js
const path = require('path');
const { getTranscriptTxt } = require('youtube-transcript-lib');

(async () => {
  const outputPath = path.resolve(process.cwd(), 'output', 'video.txt');

  const transcript = await getTranscriptTxt('kkUzhl02eac', outputPath);
  console.log(transcript);
})();
```

---

## ⚙️ API

### `getTranscriptTxt(videoId, outputPath?)`

Obtém a transcrição de um vídeo do YouTube.

#### Parâmetros

| Parâmetro    | Tipo   | Obrigatório | Descrição                              |
| ------------ | ------ | ----------- | -------------------------------------- |
| `videoId`    | string | ✅ Sim       | ID do vídeo no YouTube                 |
| `outputPath` | string | ❌ Não       | Caminho completo para salvar o arquivo |

#### Retorno

* `string` → Transcrição do vídeo

---

## 📁 Comportamento de salvamento

* Se `outputPath` for informado:

  * O diretório é criado automaticamente (caso não exista)
  * O arquivo `.txt` é salvo

* Se não for informado:

  * Apenas retorna a transcrição

---

## ⚠️ Observações

* O vídeo precisa ter captions disponíveis
* Idioma padrão: `pt`
* Pode falhar em vídeos com restrições do YouTube

---

## 🔧 Roadmap

* [ ] Suporte a JSON
* [ ] Exportação em SRT
* [ ] Seleção automática de idioma
* [ ] Cache de transcrições

---

## 📄 Licença

MIT
