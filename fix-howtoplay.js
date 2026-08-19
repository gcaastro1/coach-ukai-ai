const fs = require('fs');
const path = require('path');

const charsDir = path.join(__dirname, 'docs', 'chars');
const guidesPath = path.join(__dirname, 'src', 'data', 'guides.json');
const guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));

const files = fs.readdirSync(charsDir);

for (const file of files) {
  if (!file.endsWith('.md')) continue;
  const id = file.replace('.md', '');
  if (!guides[id]) continue;

  const content = fs.readFileSync(path.join(charsDir, file), 'utf8');

  // Extract howToPlay: Everything under "## 5. Como Jogar" (or similar)
  // We can use a regex to capture everything after "Como Jogar" until the end of the file or next major section.
  const match = content.match(/##\s*\d+\.\s*Como Jogar\s*([\s\S]*)/i);
  if (match) {
    let howToPlay = match[1].trim();

    // The user wanted `- ` lists to become `* `, let's apply that (but ONLY at the start of a line, or after spaces)
    howToPlay = howToPlay.replace(/^- /gm, '* ');

    // The user wants "**Composição:**" to become "## Composição", etc.
    // Any bold text at the start of a line ending in a colon should become a header.
    // e.g. "**Mecânica Principal:**" -> "## Mecânica Principal"
    howToPlay = howToPlay.replace(/^\*\*(.*?):\*\*\s*/gm, '## $1\n');

    guides[id].howToPlay = howToPlay;
    console.log(`Restored howToPlay for ${id}`);
  }
}

fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2));
console.log('guides.json updated successfully!');
