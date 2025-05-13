const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const BASE_URL = 'https://www.wawjr3d.com';
const PUBLIC_DIR = path.join(__dirname, '../public');
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

const EXCLUDED_FILES = [
    'missing.html',
];

function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    let results = [];

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(findHtmlFiles(filePath));
            return;
        }

        if (!file.endsWith('.html')) {
            return;
        }

        // Get the relative path from public directory
        const relativePath = path.relative(PUBLIC_DIR, filePath);
        // Convert backslashes to forward slashes
        let urlPath = relativePath.replace(/\\/g, '/');
        // Only remove .html extension from index files
        if (urlPath.endsWith('index.html')) {
            urlPath = urlPath.replace(/index\.html$/, '');
        }

        results.push({
            path: urlPath,
            lastmod: stat.mtime.toISOString()
        });
    });

    return results;
}

function generateSitemap() {
    const htmlFiles = findHtmlFiles(PUBLIC_DIR);
    const urls = [];

    // Add all HTML files
    htmlFiles.forEach(file => {
        if (EXCLUDED_FILES.includes(file.path)) {
            return;
        }
        
        urls.push({
            loc: `${BASE_URL}/${file.path}`,
            lastmod: file.lastmod
        });
    });

    const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{#urls}}
  <url>
    <loc>{{loc}}</loc>
    <lastmod>{{lastmod}}</lastmod>
  </url>
{{/urls}}
</urlset>`;

    const sitemap = mustache.render(sitemapTemplate, { urls });
    fs.writeFileSync(OUTPUT_FILE, sitemap);
    
    console.log('Sitemap generated successfully!');
}

generateSitemap(); 