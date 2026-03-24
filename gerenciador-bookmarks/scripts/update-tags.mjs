import fs from 'fs';
import path from 'path';

const linksDir = path.join(process.cwd(), 'gerenciador-bookmarks', 'src', 'content', 'links');
const files = fs.readdirSync(linksDir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(linksDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex para encontrar a linha: tags: ["...", "..."]
  const tagsRegex = /^tags:\s*\[(.*?)\]/m;
  const match = content.match(tagsRegex);

  if (match) {
    const tagsString = match[1];
    // Pegar as tags ignorando aspas
    let tags = tagsString.split(',').map(t => t.trim().replace(/^"|"$/g, '')).filter(t => t);
    
    let newTags = new Set(tags);

    // 1. Remover open-source
    newTags.delete('open-source');

    // 2. Unificar gpt -> ai
    if (newTags.has('gpt')) {
      newTags.delete('gpt');
      newTags.add('ai');
    }

    // 3. Unificar components -> ui
    if (newTags.has('components')) {
      newTags.delete('components');
      newTags.add('ui');
    }

    // 4. Remover utils e desmembrar
    if (newTags.has('utils')) {
      newTags.delete('utils');
      const devToolsIndicators = ['regex', 'qrcode', 'json', 'jwt', 'api', 'yaml', 'backend', 'postgres', 'supabase'];
      const hasDevTools = [...newTags].some(t => devToolsIndicators.includes(t));
      if (hasDevTools) {
        newTags.add('dev-tools');
      } else {
        newTags.add('ferramentas');
      }
    }

    const updatedTagsArray = Array.from(newTags);
    const updatedTagsString = `tags: [${updatedTagsArray.map(t => `"${t}"`).join(', ')}]`;
    
    content = content.replace(tagsRegex, updatedTagsString);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

console.log(`Updated tags in ${files.length} files.`);
