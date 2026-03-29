const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const SKIP = new Set(['node_modules', '.git', '.claude', 'private', 'dist', 'image', 'real exterior', 'iphone icons', 'playlists covers', 'ig videos', 'ig bone patrol icon']);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean dist
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
fs.mkdirSync(DIST);

// Copy only site files
for (const entry of fs.readdirSync(__dirname, { withFileTypes: true })) {
  if (SKIP.has(entry.name)) continue;
  if (entry.name.startsWith('.')) continue;
  if (entry.name === 'build.js') continue;
  const src = path.join(__dirname, entry.name);
  const dest = path.join(DIST, entry.name);
  if (entry.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Build complete → dist/');
