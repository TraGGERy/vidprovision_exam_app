const fs = require('fs');
const path = require('path');

// Configuration
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://permitly.wiki';
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Define your site's pages
const pages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/offline', changefreq: 'yearly', priority: '0.5' },
];

// Generate sitemap XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

// Write sitemap to file
fs.writeFileSync(outputPath, sitemap);

console.log(`Sitemap generated at ${outputPath}`);