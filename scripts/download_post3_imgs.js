const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('scripts/embed_post3.html', 'utf8');
const urls = html.match(/https:\/\/[^"'\s\\]+\.jpg[^"'\s\\]*/g) || [];

async function download(u, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(u.replace(/&amp;/g, '&'), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  const uniqueUrls = [...new Set(urls.map(u => u.replace(/&amp;/g, '&')))];
  console.log('Unique URLs:', uniqueUrls.length);
  for (let i = 0; i < uniqueUrls.length; i++) {
    const dest = `images/post3_${i}.jpg`;
    await download(uniqueUrls[i], dest);
    console.log(`Saved ${dest} (${(fs.statSync(dest).size/1024).toFixed(1)} KB)`);
  }
}

run();
