const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'public', 'assets', 'characters', 'mini'),
  path.join(__dirname, 'public', 'assets', 'characters', 'default')
];

let count = 0;

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      // Procura por formato "id-hash.extensão"
      const match = file.match(/^(\d+)-[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)$/);
      if (match) {
        const id = match[1];
        const ext = match[2];
        const newName = `${id}${ext}`;
        const oldPath = path.join(dir, file);
        const newPath = path.join(dir, newName);
        fs.renameSync(oldPath, newPath);
        console.log(`Renomeado: ${file} -> ${newName}`);
        count++;
      }
    });
  }
});

console.log(`\n✅ Sucesso! ${count} imagens renomeadas e padronizadas.`);
