const https = require('https');
const fs = require('fs');

https.get('https://www.instagram.com/reel/DYzp6dIBLbI/embed/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/embed_clinic.html', body);
    console.log('Saved embed_clinic.html. Length:', body.length);
    const idx = body.indexOf('display_url');
    if (idx !== -1) {
      console.log('display_url slice:', body.substring(idx, idx + 300));
    }
  });
});
