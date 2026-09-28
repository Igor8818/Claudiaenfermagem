const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const srcMatches = html.match(/src="([^"]+)"/g) || [];
console.log('--- SRC matches ---');
srcMatches.forEach(m => console.log(m));

const hrefMatches = html.match(/href="([^"]+)"/g) || [];
console.log('\n--- Local HREF matches ---');
hrefMatches.forEach(m => {
  if (!m.includes('#') && !m.includes('wa.me') && !m.includes('instagram.com') && !m.includes('http')) {
    console.log(m);
  }
});

const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/);
console.log('\nog:image:', ogImage ? ogImage[1] : 'none');
