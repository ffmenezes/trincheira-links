import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const linksDir = path.join(process.cwd(), 'gerenciador-bookmarks', 'src', 'content', 'links');
const thumbsDir = path.join(process.cwd(), 'gerenciador-bookmarks', 'public', 'ogthumbs');

const files = fs.readdirSync(thumbsDir).filter(f => f.endsWith('.png'));

async function compressAll() {
  console.log(`Iniciando a compressão de ${files.length} imagens para WebP...`);
  
  for (const file of files) {
    const filePath = path.join(thumbsDir, file);
    const slug = path.basename(file, '.png');
    const webpPath = path.join(thumbsDir, `${slug}.webp`);
    const webpPublicPath = `/ogthumbs/${slug}.webp`;

    try {
      // Compressão via Sharp
      await sharp(filePath)
        .resize({ width: 600, withoutEnlargement: true }) // Máximo 600px
        .webp({ quality: 80 }) // WebP com 80% de qualidade
        .toFile(webpPath);

      console.log(`  [+] Comprimido: ${slug}.webp`);

      // Atualizar o arquivo MDX correspondente
      const mdxPath = path.join(linksDir, `${slug}.mdx`);
      if (fs.existsSync(mdxPath)) {
        let content = fs.readFileSync(mdxPath, 'utf-8');
        const ogThumbRegex = /^ogthumb:\s*".*?"/m;
        if (content.match(ogThumbRegex)) {
          content = content.replace(ogThumbRegex, `ogthumb: "${webpPublicPath}"`);
          fs.writeFileSync(mdxPath, content, 'utf-8');
          console.log(`  [MDX] Atualizado: ${slug}.mdx`);
        }
      }

      // Remover o PNG original
      fs.unlinkSync(filePath);
      
    } catch (err) {
      console.error(`  [!] Erro ao processar ${file}: ${err.message}`);
    }
  }
  console.log("Compressão finalizada.");
}

compressAll().catch(console.error);
