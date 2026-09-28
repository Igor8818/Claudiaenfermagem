const https = require('https');
const url = 'https://www.instagram.com/reel/DOuFTSbCZ0T/';

https.get(url, { headers: { 'User-Agent': 'facebookexternalhit/1.1' } }, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const videoMatch = body.match(/<meta\s+property="og:video(?::secure_url)?"\s+content="([^"]+)"/i);
    console.log('Video match:', videoMatch ? videoMatch[1].replace(/&amp;/g, '&') : 'No video match');
  });
});
