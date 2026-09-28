const https = require('https');
const fs = require('fs');
const path = require('path');

const posts = [
  'https://www.instagram.com/reel/DYzp6dIBLbI/',
  'https://www.instagram.com/reel/DYPkgmYBIPl/',
  'https://www.instagram.com/p/DV02FxXjmWQ/',
  'https://www.instagram.com/p/DbEhZShjoId/',
  'https://www.instagram.com/reel/DOuFTSbCZ0T/',
  'https://www.instagram.com/reel/DU-4qnXEft_/',
  'https://www.instagram.com/reel/DPyq4VrjQ-x/'
];

const outDir = path.join(__dirname, '..', 'images', 'instagram');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function fetchPost(url, index) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const ogMatch = body.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        const descMatch = body.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) || body.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
        if (ogMatch && ogMatch[1]) {
          const imgUrl = ogMatch[1].replace(/&amp;/g, '&');
          let caption = descMatch ? descMatch[1] : '';
          caption = caption.replace(/&#x1f49c;/g, '💜').replace(/&#xe7;/g, 'ç').replace(/&#xe3;/g, 'ã').replace(/&#xfa;/g, 'ú').replace(/&quot;/g, '"');
          console.log(`[+] Post ${index}: Found image`);
          downloadImage(imgUrl, path.join(outDir, `post_${index}.jpg`)).then((ok) => {
            if (ok) {
              resolve({ index, url, imgPath: `images/instagram/post_${index}.jpg`, caption });
            } else {
              resolve(null);
            }
          });
        } else {
          console.log(`[-] Post ${index}: No og:image found`);
          resolve(null);
        }
      });
    });
    req.on('error', err => {
      console.log(`[!] Error fetching ${url}: ${err.message}`);
      resolve(null);
    });
  });
}

function downloadImage(url, dest) {
  return new Promise(resolve => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      console.log(`Error downloading image: ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('Fetching Instagram posts...');
  const results = [];
  for (let i = 0; i < posts.length; i++) {
    const res = await fetchPost(posts[i], i + 1);
    if (res) results.push(res);
  }
  fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`SUCCESS! Saved ${results.length} real Instagram photos and metadata.`);
}

run();
