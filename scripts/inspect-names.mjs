import fs from 'fs';
import { execSync } from 'child_process';

const content = fs.readFileSync('./src/data/products.ts', 'utf8');
const jsonMatch = content.match(/export const PRODUCTS_DATA: Product\[\] = (\[[\s\S]*?\]);/);
const data = JSON.parse(jsonMatch[1]);

console.log('--- CALZADO CURADO (IDs 1 a 47) ---');
data.filter(p => p.id <= 47).forEach(p => {
  console.log(`ID ${p.id.toString().padStart(2, '0')}: [${p.brand}] "${p.name}" (Género: ${p.gender})`);
  console.log(`     Img: ${p.image}`);
});
