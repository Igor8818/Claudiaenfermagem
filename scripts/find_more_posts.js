const https = require('https');
const fs = require('fs');

function searchDDG(query) {
  return new Promise(resolve => {
    const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(query);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const regex = /uddg=([^&]+)/g;
        let match;
        const urls = [];
        while ((match = regex.exec(body)) !== null) {
          const decoded = decodeURIComponent(match[1]);
          if (decoded.includes('instagram.com/p/') || decoded.includes('instagram.com/reel/')) {
            urls.push(decoded);
          }
        }
        resolve(urls);
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const queries = [
    'claudiafontesenfermagem',
    'site:instagram.com/claudiafontesenfermagem',
    'site:instagram.com/reel claudiafontesenfermagem',
    'site:instagram.com/p claudiafontesenfermagem',
    'claudiafontesenfermagem itabuna',
    'claudiafontesenfermagem podologia',
    'claudiafontesenfermagem laserterapia'
  ];

  const results = new Set();
  for (const q of queries) {
    const found = await searchDDG(q);
    found.forEach(u => results.add(u));
  }

  console.log('Found posts:', Array.from(results));
  fs.writeFileSync('scripts/all_found_posts.json', JSON.stringify(Array.from(results), null, 2));
}

run();
