const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/contexts/products.ts');

console.log(`Processing file: ${filePath}`);

let fileContent;
try {
  fileContent = fs.readFileSync(filePath, 'utf-8');
} catch (error) {
  console.error(`Error reading file: ${error.message}`);
  process.exit(1);
}

const startIndex = fileContent.indexOf('export const sampleProducts: Product[] = [');
if (startIndex === -1) {
    console.error('Could not find the start of sampleProducts array.');
    process.exit(1);
}

const arrayStartIndex = fileContent.indexOf('[', startIndex);

let openBrackets = 0;
let arrayEndIndex = -1;
for (let i = arrayStartIndex; i < fileContent.length; i++) {
    if (fileContent[i] === '[') {
        openBrackets++;
    } else if (fileContent[i] === ']') {
        openBrackets--;
        if (openBrackets === 0) {
            arrayEndIndex = i;
            break;
        }
    }
}

if (arrayEndIndex === -1) {
    console.error('Could not find the end of sampleProducts array.');
    process.exit(1);
}

const oldArrayString = fileContent.substring(arrayStartIndex, arrayEndIndex + 1);

let sampleProducts;
try {
    sampleProducts = new Function(`return ${oldArrayString};`)();
} catch (e) {
    console.error('Failed to parse sampleProducts array:', e);
    process.exit(1);
}

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const productsByCategory = sampleProducts.reduce(
  (acc, product) => {
    const { category } = product;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  },
  {}
);

const sortedCategories = Object.keys(productsByCategory).sort();

const sortedProducts = [];
for (const category of sortedCategories) {
  const productsInCategory = productsByCategory[category];
  productsInCategory.sort((a, b) => a.name.localeCompare(b.name));
  sortedProducts.push(...productsInCategory);
}

const finalProducts = sortedProducts.map(product => ({
  ...product,
  id: `${slugify(product.category)}-${slugify(product.name)}`,
}));

const newArrayString = JSON.stringify(finalProducts, null, 2);

const finalContent = fileContent.replace(oldArrayString, newArrayString);

try {
  fs.writeFileSync(filePath, finalContent);
  console.log('Successfully updated products.ts');
} catch (error) {
  console.error(`Error writing to file: ${error.message}`);
  process.exit(1);
}
