const fs = require('fs');
const path = require('path');

// Ajuste o caminho se o seu JSON estiver em outro lugar
const charactersPath = path.join(__dirname, 'src', 'data', 'characters.json');
const imagesDir = path.join(__dirname, 'public', 'assets', 'characters');
const extensions = ['.png', '.webp', '.jpg'];

const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

let missingDefault = [];
let missingMini = [];

console.log("🔍 Verificando integridade das imagens...\n");

characters.forEach(char => {
    const id = char.id;

    // Verifica se existe alguma variação de extensão para o default e para o mini (agora nas pastas 'default' e 'mini' sem sufixo no nome)
    const hasDefault = extensions.some(ext => fs.existsSync(path.join(imagesDir, 'default', `${id}${ext}`)));
    const hasMini = extensions.some(ext => fs.existsSync(path.join(imagesDir, 'mini', `${id}${ext}`)));

    if (!hasDefault) missingDefault.push(`- ${char.name} (ID: ${id})`);
    if (!hasMini) missingMini.push(`- ${char.name} (ID: ${id})`);
});

console.log(`⚠️ Faltam ${missingDefault.length} imagens DEFAULT (Cartas Retangulares):`);
console.log(missingDefault.join('\n'));

console.log(`\n⚠️ Faltam ${missingMini.length} imagens MINI (Ícones Redondos/Quadrados):`);
console.log(missingMini.join('\n'));