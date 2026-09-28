const https = require('https');
const fs = require('fs');
const path = require('path');

const reelUrl = 'https://www.instagram.com/reel/DQE5Zz9ja6k/embed/';

https.get(reelUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/reel_page.html', body);
    const idx = body.indexOf('video_url');
    console.log('Index of video_url:', idx);
    if (idx !== -1) {
      const snippet = body.substring(idx - 10, idx + 400);
      console.log('Snippet:', snippet);
    }
  });
});
