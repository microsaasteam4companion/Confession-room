import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIGURATION
const SITE_URL = 'https://confessions-chi.vercel.app'; // Updated to your Vercel URL
const PUBLIC_DIR = path.resolve(__dirname, 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// Public routes that we want search engines to find
const routes = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'wall', priority: '0.8', changefreq: 'daily' },
    { path: 'admin', priority: '0.5', changefreq: 'monthly' },
];

function generateSitemap() {
    console.log('🚀 Generating sitemap...');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
            .map(
                (route) => `  <url>
    <loc>${SITE_URL}/${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
            )
            .join('\n')}
</urlset>`;

    try {
        if (!fs.existsSync(PUBLIC_DIR)) {
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }
        fs.writeFileSync(SITEMAP_PATH, sitemapContent);
        console.log(`✅ Sitemap generated at: ${SITEMAP_PATH}`);
    } catch (error) {
        console.error('❌ Failed to generate sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
