const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const BASE_URL = 'https://www.wawjr3d.com';
const TEMPLATES_DIR = path.join(__dirname, '../src/templates');
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

function getDirectories(dir) {
    return fs.readdirSync(dir)
        .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
        .filter(dir => !dir.startsWith('.'));
}

function generateSitemap() {
    const directories = getDirectories(TEMPLATES_DIR);
    const urls = [
        {
            loc: BASE_URL,
            changefreq: 'monthly',
            priority: '1.0'
        }
    ];

    // Add all section directories
    directories.forEach(dir => {
        urls.push({
            loc: `${BASE_URL}/${dir}`,
            changefreq: 'monthly',
            priority: '0.8'
        });
    });

    const sitemapTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{{#urls}}
  <url>
    <loc>{{loc}}</loc>
    <changefreq>{{changefreq}}</changefreq>
    <priority>{{priority}}</priority>
  </url>
{{/urls}}
</urlset>`;

    const sitemap = mustache.render(sitemapTemplate, { urls });
    fs.writeFileSync(OUTPUT_FILE, sitemap);
    console.log('Sitemap generated successfully!');
}

generateSitemap(); 