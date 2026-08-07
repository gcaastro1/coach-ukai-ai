const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'public', 'assets', 'others', 'bg'),
  path.join(__dirname, 'public', 'assets', 'others', 'minibg')
];

let count = 0;

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      // Procura por formato "background_{raridade}-hash.extensão"
      const match = file.match(/^(background_[a-z]+)-[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)$/);
      if (match) {
        const prefix = match[1];
        const ext = match[2];
        const newName = `${prefix}${ext}`;
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, newName);
        fs.renameSync(oldPath, newPath);
        console.log(`Renomeado: ${file} -> ${newName}`);
        count++;
      }
    });
  }
});

console.log(`\n✅ Sucesso! ${count} imagens de background renomeadas e padronizadas.`);
