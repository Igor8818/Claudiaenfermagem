const fs = require('fs');
const https = require('https');
const path = require('path');

function extractVideoUrl(html) {
  const marker = 'video_url';
  const idx = html.indexOf(marker);
  if (idx === -1) return null;

  // Find https: after idx
  const httpIdx = html.indexOf('https', idx);
  if (httpIdx === -1) return null;

  // Let's find where the URL ends: either at \" or " or &efg=...
  // In the string, it ends before the next quote (escaped or not)
  let endIdx = httpIdx;
  while (endIdx < html.length) {
    if (html[endIdx] === '"') {
      break;
    }
    endIdx++;
  }

  let raw = html.substring(httpIdx, endIdx);
  // Remove any trailing backslashes
  while (raw.endsWith('\\')) {
    raw = raw.substring(0, raw.length - 1);
  }

  // Replace all backslashes before slashes: \/ -> /
  let cleaned = raw.replace(/\\+\//g, '/');
  // Replace \u0026 -> &
  cleaned = cleaned.replace(/\\u0026/g, '&');
  cleaned = cleaned.replace(/&amp;/g, '&');
  // Also decode any HTML entities or % escapes if needed
  return cleaned;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log('\nFetching: ' + url.substring(0, 100) + '...');
    const file = fs.createWriteStream(dest);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.instagram.com/'
      }
    }, res => {
      console.log('Status:', res.statusCode);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        console.log('Redirecting...');
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => reject(new Error('HTTP ' + res.statusCode + ': ' + body)));
        return;
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

async function run() {
  const reels = [
    { code: 'DQE5Zz9ja6k', name: 'reel_procedimento.mp4' },
    { code: 'DNRXiYayOW5', name: 'reel_domiciliar.mp4' }
  ];

  for (const r of reels) {
    console.log('\n================================');
    console.log('Processing:', r.code);
    const htmlFile = `scripts/embed_${r.code}.html`;
    if (!fs.existsSync(htmlFile)) {
      console.log('HTML file not found:', htmlFile);
      continue;
    }
    const html = fs.readFileSync(htmlFile, 'utf8');
    const url = extractVideoUrl(html);
    console.log('Extracted URL:');
    console.log(url);

    if (url) {
      const dest = path.join('videos', r.name);
      try {
        await downloadFile(url, dest);
        const stats = fs.statSync(dest);
        console.log(`SUCCESS! Saved ${dest} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      } catch (e) {
        console.error('Failed to download:', e.message);
      }
    }
  }
}

run();
