const https = require('https');
const fs = require('fs');
const path = require('path');

const reelUrl = 'https://www.instagram.com/reel/DQE5Zz9ja6k/embed/';

https.get(reelUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const match = body.match(/"video_url":"([^"]+)"/);
    if (!match) {
      console.log('Video URL not found');
      return;
    }

    let videoUrl = match[1].replace(/\\\//g, '/').replace(/\\u0025/g, '%');
    console.log('Found Video URL:', videoUrl.substring(0, 100) + '...');

    const videoDir = path.join(__dirname, '..', 'videos');
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    const dest = path.join(videoDir, 'reel_claudia.mp4');
    const file = fs.createWriteStream(dest);

    https.get(videoUrl, vRes => {
      console.log('Download status:', vRes.statusCode, 'Content-Length:', vRes.headers['content-length']);
      vRes.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log('SUCCESS: Downloaded reel_claudia.mp4, size:', fs.statSync(dest).size, 'bytes');
        });
      });
    }).on('error', err => console.log('Error downloading video:', err));
  });
});
