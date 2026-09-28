const https = require('https');
const fs = require('fs');

https.get('https://www.instagram.com/p/DV02FxXjmWQ/embed/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/embed_post3.html', body);
    console.log('Saved embed_post3.html. Length:', body.length);
    // Find all image URLs
    const matches = body.match(/https:\/\/[^"'\s\\]+\.jpg[^"'\s\\]*/g) || [];
    console.log('Found', matches.length, 'images in post 3 embed');
    matches.forEach((u, i) => {
      console.log(`[${i}]`, u.replace(/&amp;/g, '&').substring(0, 100));
    });
  });
});
