const https = require('https');

https.get('https://html.duckduckgo.com/html/?q=claudiafontesenfermagem', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    console.log('Status:', res.statusCode, 'Length:', body.length);
    const matches = body.match(/https%3A%2F%2Fwww\.instagram\.com%2F[^\s"&]+/g);
    console.log('Matches:', matches ? matches.map(m => decodeURIComponent(m)) : 'None');
  });
});
