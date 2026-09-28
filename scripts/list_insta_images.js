const fs = require('fs');
const path = require('path');

const dir = 'images/instagram';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));

files.forEach(f => {
  const p = path.join(dir, f);
  const size = fs.statSync(p).size;
  console.log(`${f}: ${(size/1024).toFixed(1)} KB`);
});
