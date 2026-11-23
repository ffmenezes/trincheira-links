import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const linksDir = path.join(process.cwd(), 'gerenciador-bookmarks', 'src', 'content', 'links');
const thumbsDir = path.join(process.cwd(), 'gerenciador-bookmarks', 'public', 'ogthumbs');

if (!fs.existsSync(thumbsDir)) {
  fs.mkdirSync(thumbsDir, { recursive: true });
}

// Uso: node gerenciador-bookmarks/scripts/take-screenshots-playwright.mjs [slug ...]
// Sem argumentos processa todos os links; com slugs, refaz só esses (sobrescrevendo a print).
const onlySlugs = process.argv.slice(2);
const files = fs.readdirSync(linksDir)
  .filter(f => f.endsWith('.mdx') && !f.startsWith('_'))
  .filter(f => onlySlugs.length === 0 || onlySlugs.includes(path.basename(f, '.mdx')));

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processFiles() {
  const browser = await chromium.launch({ headless: true });
  // Browser context com User-Agent real e viewport HD
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  
  let processed = 0;
  let skippedBooks = 0;
  let skippedExists = 0;
  let failed = 0;

  console.log(`Iniciando o processamento de ${files.length} arquivos via Playwright...`);

  for (const file of files) {
    const filePath = path.join(linksDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Analisar tags para ignorar livros
    const tagsMatch = content.match(/^tags:\s*\[(.*?)\]/m);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/^"|"$/g, '')) : [];
    
    if (tags.includes('livros')) {
      console.log(`[Skipped] ${file} - Livro detectado. Mantendo imagem original.`);
      skippedBooks++;
      continue;
    }

    const linkMatch = content.match(/^link:\s*"(.*?)"/m);
    if (!linkMatch) continue;
    
    const siteUrl = linkMatch[1];
    const slug = path.basename(file, '.mdx');
    const thumbFilename = `${slug}.webp`;
    const thumbFilePath = path.join(thumbsDir, thumbFilename);
    const thumbPublicPath = `/ogthumbs/${thumbFilename}`;

    // Verificação de imagem existente e tamanho (se < 10kb e não for livro, refazemos)
    if (onlySlugs.length === 0 && fs.existsSync(thumbFilePath)) {
      const stats = fs.statSync(thumbFilePath);
      const fileSizeKBytes = stats.size / 1024;
      
      if (fileSizeKBytes > 10) { // Reduzi para 10KB porque WebP é muito pequeno
        console.log(`[Skipped] ${slug} - Screenshot já existe e parece válida (${fileSizeKBytes.toFixed(2)} KB).`);
        skippedExists++;
        continue;
      } else {
        console.log(`[Retrying] ${slug} - Screenshot pequena demais (${fileSizeKBytes.toFixed(2)} KB). Refazendo...`);
      }
    }

    console.log(`[Capturing] ${slug} - URL: ${siteUrl}`);

    try {
      // Navegar com timeout de 30s
      await page.goto(siteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Sites com conexões persistentes (websocket, polling) nunca chegam em networkidle
      await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      
      // Pequeno scroll para disparar lazy loads de imagens
      await page.evaluate(() => window.scrollBy(0, 300));
      await delay(2000); // 2 segundos extra para renderização estável
      // Volta ao topo: a print mostra a dobra inicial da página
      await page.evaluate(() => window.scrollTo(0, 0));
      await delay(1000);

      // Captura o screenshot da parte visível em PNG (buffer)
      const buffer = await page.screenshot();

      // Compressão via Sharp para WebP
      // 600x338 = 16:9, mesmo formato das demais prints
      await sharp(buffer)
        .resize({ width: 600, height: 338, fit: 'cover', position: 'top' })
        .webp({ quality: 80 })
        .toFile(thumbFilePath);

      console.log(`  [+] Screenshot comprimida e salva em ${thumbFilePath}`);

      // Atualizar MDX caso precise (apontar para o path local em WebP)
      const ogThumbRegex = /^ogthumb:\s*".*?"/m;
      if (!content.match(ogThumbRegex)) {
          content = content.replace(/^link:\s*".*?"/m, `$&` + `\nogthumb: "${thumbPublicPath}"`);
          fs.writeFileSync(filePath, content, 'utf-8');
      } else if (!content.includes(thumbPublicPath)) {
          content = content.replace(ogThumbRegex, `ogthumb: "${thumbPublicPath}"`);
          fs.writeFileSync(filePath, content, 'utf-8');
      }
      
      processed++;
    } catch (err) {
      console.error(`  [!] Erro ao capturar ${siteUrl}: ${err.message}`);
      failed++;
    }

    // Delay de 3s para respeitar os sites e evitar sobrecarga de CPU do navegador
    await delay(3000);
  }

  await browser.close();
  console.log(`Finalizado. Processados: ${processed}, Livros Ignorados: ${skippedBooks}, Existentes Válidos: ${skippedExists}, Falhas: ${failed}`);
}

processFiles().catch(console.error);

