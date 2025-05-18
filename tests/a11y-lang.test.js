const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('all html files have lang attribute', () => {
  const PUBLIC_DIR = path.join(__dirname, '../public');

  function findHtmlFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results = results.concat(findHtmlFiles(filePath));
      } else if (file.endsWith('.html')) {
        results.push(filePath);
      }
    });

    return results;
  }
  
  function htmlTagHasLang(html) {
    const htmlTagHasLangRegex = /<html[^>]*lang=["']en-us["'][^>]*>/i;

    return htmlTagHasLangRegex.test(html);
  }

  findHtmlFiles(PUBLIC_DIR).forEach(file => {
    const relativePath = path.relative(PUBLIC_DIR, file);
    
    it(`${relativePath} should have lang attribute`, () => {
      const html = fs.readFileSync(file, 'utf8');
      expect(htmlTagHasLang(html)).to.be.true;
    });
  });
});
