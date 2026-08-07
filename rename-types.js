const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'assets', 'others', 'types');

if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const match = file.match(/^([a-z]+)-[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)$/);
    if (match) {
      const newName = `${match[1]}${match[2]}`;
      fs.renameSync(path.join(dir, file), path.join(dir, newName));
      console.log(`Renomeado: ${file} -> ${newName}`);
    }
  });
}
