const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

if (!fs.existsSync('videos')) {
  fs.mkdirSync('videos', { recursive: true });
}

function fetchEmbed(shortcode) {
  return new Promise((resolve, reject) => {
    const url = `https://www.instagram.com/reel/${shortcode}/embed/`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(dest));
      });
    }).on('error', err => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

function extractVideoUrl(html) {
  const idx = html.indexOf('video_url');
  if (idx === -1) return null;
  // From idx, find the quote or escaped quote
  const slice = html.substring(idx, idx + 1000);
  // Match :\"(https:[^\"\\]+) or :"(https:[^"]+)
  const match = slice.match(/video_url\\?"?\s*:\s*\\?"(https:[^"\\]+)/);
  if (match) {
    return match[1].replace(/\\\//g, '/').replace(/\\u0026/g, '&');
  }
  // Try another approach: search for http inside the slice
  const httpIdx = slice.indexOf('https');
  if (httpIdx !== -1) {
    let raw = slice.substring(httpIdx);
    // Find ending quote
    let endQuote = raw.indexOf('"');
    let endSlashQuote = raw.indexOf('\\"');
    let end = raw.length;
    if (endSlashQuote !== -1) end = Math.min(end, endSlashQuote);
    if (endQuote !== -1) end = Math.min(end, endQuote);
    let finalUrl = raw.substring(0, end).replace(/\\\//g, '/').replace(/\\u0026/g, '&');
    return finalUrl;
  }
  return null;
}

async function run() {
  const items = [
    { code: 'DQE5Zz9ja6k', filename: 'reel_procedimento.mp4' },
    { code: 'DNRXiYayOW5', filename: 'reel_domiciliar.mp4' }
  ];

  for (const item of items) {
    console.log(`\n========================================`);
    console.log(`Processing reel: ${item.code}`);
    try {
      const html = await fetchEmbed(item.code);
      fs.writeFileSync(`scripts/embed_${item.code}.html`, html);
      console.log(`Embed HTML saved (${html.length} bytes)`);

      const videoUrl = extractVideoUrl(html);
      if (videoUrl) {
        console.log(`Extracted video URL: ${videoUrl.substring(0, 100)}...`);
        const dest = path.join('videos', item.filename);
        console.log(`Downloading to ${dest}...`);
        await downloadFile(videoUrl, dest);
        const stats = fs.statSync(dest);
        console.log(`Success! File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      } else {
        console.log(`No video_url found for ${item.code}`);
      }
    } catch (err) {
      console.error(`Error with ${item.code}:`, err.message);
    }
  }
}

run();
