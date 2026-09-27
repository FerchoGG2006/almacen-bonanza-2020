import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
const data = JSON.parse(jsonMatch[1]);

const outDir = path.resolve('C:/Users/ASUS/.gemini/antigravity-ide/brain/ef014832-1c47-407b-b59b-41f021767a18/scratch/images');
fs.mkdirSync(outDir, { recursive: true });

async function downloadImages() {
  const items = data.filter(p => p.id <= 47);
  console.log('Downloading ' + items.length + ' images...');
  for (const p of items) {
    const filename = path.join(outDir, `prod_${p.id.toString().padStart(2, '0')}.jpg`);
    if (!fs.existsSync(filename)) {
      try {
        const res = await fetch(p.image);
        if (res.ok) {
          const buffer = Buffer.from(await res.arrayBuffer());
          fs.writeFileSync(filename, buffer);
          console.log(`Downloaded ${p.id}: ${p.brand} - ${p.name}`);
        } else {
          console.warn(`Failed ${p.id}: ${res.status}`);
        }
      } catch (e) {
        console.error(`Error ${p.id}: ${e.message}`);
      }
    }
  }
  console.log('All downloads completed!');
}
downloadImages();
