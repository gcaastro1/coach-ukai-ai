const fs = require('fs');
const path = require('path');

const memoriesDir = path.join(__dirname, 'public/assets/memories');

fs.readdirSync(memoriesDir).forEach(file => {
  if (file.includes('-')) {
    const parts = file.split('-');
    // the last part is the hash, e.g. 210001-CYxN63e0.png
    // It could be 211103-C-0PLp8P.png
    
    // So let's split by '-' and the last one is the hash+extension.
    const ext = path.extname(file);
    const id = file.replace(/(-[^-]+)$/, ''); 
    // e.g. 210001-CYxN63e0.png -> 210001
    // 211103-C-0PLp8P.png -> 211103-C
    
    // Actually, looking at the list:
    // 211103-C-0PLp8P.png -> wait, is the ID '211103-C'? No, in memories.json, IDs are numbers like 211103.
    // If the ID is 211103, I should just match the first numbers.
    const match = file.match(/^(\w+)/);
    if (match) {
      const newName = match[1] + ext;
      fs.renameSync(path.join(memoriesDir, file), path.join(memoriesDir, newName));
      console.log(`Renamed ${file} to ${newName}`);
    }
  }
});
