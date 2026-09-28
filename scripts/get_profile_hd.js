const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://www.instagram.com/claudiafontesenfermagem/', {
  headers: {
    'User-Agent': 'facebookexternalhit/1.1'
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    fs.writeFileSync(path.join(__dirname, 'raw_profile.html'), body, 'utf8');
    const regex = /https:\/\/[^"'\s]+(?:profile_pic|scontent)[^"'\s]+/g;
    let match;
    const urls = new Set();
    while ((match = regex.exec(body)) !== null) {
      urls.add(match[0].replace(/&amp;/g, '&'));
    }
    console.log('Found image URLs:', Array.from(urls));
  });
});
