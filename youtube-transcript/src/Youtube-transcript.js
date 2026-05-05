const fetch = require('node-fetch').default;
const { parseStringPromise } = require('xml2js');
const fs = require('fs').promises;
const pathLib = require('path');

async function getTranscriptTxt(videoId, outputPath = null) {
  try {
    const transcriptArray = await getYoutubeTranscript(videoId, 'pt');
    const transcript = transcriptArray.map(item => item.caption).join(' ');

    // 👉 Só salva se vier path
    if (outputPath) {
      const dir = pathLib.dirname(outputPath);

      // garante que a pasta existe
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(outputPath, transcript, 'utf8');
      console.log(`Transcript salvo em: ${outputPath}`);
    }

    return transcript;

  } catch (error) {
    console.error('Erro ao obter ou salvar transcrição:', error);
    return '';
  }
}

async function getYoutubeTranscript(videoId, language = 'pt') {

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const userAgents = [
    'Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ];
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  // Step 1: Fetch INNERTUBE_API_KEY com headers
  const htmlResponse = await fetch(videoUrl, {
    headers: { 'User-Agent': randomUA }
  }).then(res => res.text());

  const apiKeyMatch = htmlResponse.match(/"INNERTUBE_API_KEY":"([^"]+)"/);

  if (!apiKeyMatch) throw new Error("INNERTUBE_API_KEY not found.");
  const apiKey = apiKeyMatch[1];

  // Step 2: Get player response com headers e body
  const playerData = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'User-Agent': randomUA
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: "ANDROID", // Ou "WEB" para variar
          clientVersion: "20.10.38"
        }
      },
      videoId
    })
  }).then(res => res.json());

  // Step 3: Extract caption track URL
  const tracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!tracks) throw new Error("No captions found.");
  const track = tracks.find(t => t.languageCode === language);

  if (!track) throw new Error(`No captions for language: ${language}`);
  const baseUrl = track.baseUrl.replace(/&fmt=\w+$/, "");

  // Step 4: Fetch and parse XML com delay e headers
  const xml = await fetch(baseUrl, {
    headers: { 'User-Agent': randomUA }
  }).then(res => res.text());

  const parsed = await parseStringPromise(xml);

  return parsed.transcript.text.map(entry => ({
    caption: entry._,
    startTime: parseFloat(entry.$.start),
    endTime: parseFloat(entry.$.start) + parseFloat(entry.$.dur)
  }));
}

module.exports = { getTranscriptTxt };