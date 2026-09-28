const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://www.instagram.com/p/DbEhZShjoId/embed/';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/embed.html', body);
    const mediaMatch = body.match(/class="EmbeddedMediaImage"[^>]+src="([^"]+)"/i);
    const allImages = body.match(/https:\/\/[^"'\s\\]+\.jpg[^"'\s\\]*/g) || [];
    console.log('EmbeddedMediaImage:', mediaMatch ? mediaMatch[1] : 'None');
    console.log('All image links found:', allImages.length);

    allImages.forEach((imgUrl, i) => {
      const cleanUrl = imgUrl.replace(/&amp;/g, '&');
      console.log(`[${i}] ${cleanUrl.substring(0, 100)}...`);
      download(cleanUrl, path.join(__dirname, '..', 'images', 'instagram', `embed_photo_${i}.jpg`));
    });
  });
});

function download(u, dest) {
  const file = fs.createWriteStream(dest);
  https.get(u, res => {
    res.pipe(file);
    file.on('finish', () => file.close());
  }).on('error', () => fs.unlink(dest, () => {}));
}
