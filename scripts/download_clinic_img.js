const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('scripts/embed_clinic.html', 'utf8');
const idx = html.indexOf('display_url');
const httpIdx = html.indexOf('https', idx);
let endIdx = httpIdx;
while (endIdx < html.length && html[endIdx] !== '"') endIdx++;

let raw = html.substring(httpIdx, endIdx);
while (raw.endsWith('\\')) raw = raw.substring(0, raw.length - 1);
const cleanUrl = raw.replace(/\\+\//g, '/').replace(/\\u0026/g, '&');
console.log('Clean display_url:', cleanUrl);

const file = fs.createWriteStream('images/clinic_real.jpg');
https.get(cleanUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.instagram.com/'
  }
}, res => {
  console.log('Status:', res.statusCode);
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Saved images/clinic_real.jpg. Size:', fs.statSync('images/clinic_real.jpg').size);
  });
});
