const fs = require('fs');
const path = require('path');

// Configuration
const publicDir = path.join(process.cwd(), 'public');
const srcDir = path.join(process.cwd(), 'src');

// Files to check
const filesToCheck = [
  { path: path.join(publicDir, 'robots.txt'), name: 'Robots.txt' },
  { path: path.join(publicDir, 'sitemap.xml'), name: 'Sitemap XML' },
  { path: path.join(publicDir, 'manifest.json'), name: 'Web Manifest' },
  { path: path.join(srcDir, 'app', 'layout.tsx'), name: 'Layout with Metadata' },
];

// Check if files exist
console.log('\n🔍 SEO Verification Report');
console.log('========================\n');

let allFilesExist = true;

filesToCheck.forEach(file => {
  const exists = fs.existsSync(file.path);
  console.log(`${exists ? '✅' : '❌'} ${file.name}: ${exists ? 'Found' : 'Missing'}`);
  if (!exists) allFilesExist = false;
});

// Check manifest.json content
if (fs.existsSync(path.join(publicDir, 'manifest.json'))) {
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(publicDir, 'manifest.json'), 'utf8'));
    console.log('\n📱 PWA Manifest Check');
    console.log('-------------------');
    console.log(`✅ Name: ${manifest.name || 'Missing'}`);
    console.log(`✅ Short Name: ${manifest.short_name || 'Missing'}`);
    console.log(`✅ Description: ${manifest.description ? 'Present' : 'Missing'}`);
    console.log(`✅ Icons: ${manifest.icons && manifest.icons.length > 0 ? 'Present' : 'Missing'}`);
    console.log(`✅ Start URL: ${manifest.start_url || 'Missing'}`);
    console.log(`✅ Display: ${manifest.display || 'Missing'}`);
  } catch (error) {
    console.log('\n❌ Error parsing manifest.json');
  }
}

// Check layout.tsx for metadata
if (fs.existsSync(path.join(srcDir, 'app', 'layout.tsx'))) {
  const layoutContent = fs.readFileSync(path.join(srcDir, 'app', 'layout.tsx'), 'utf8');
  console.log('\n🔍 Metadata Check');
  console.log('---------------');
  console.log(`✅ Title: ${layoutContent.includes('title') ? 'Present' : 'Missing'}`);
  console.log(`✅ Description: ${layoutContent.includes('description') ? 'Present' : 'Missing'}`);
  console.log(`✅ Open Graph: ${layoutContent.includes('openGraph') ? 'Present' : 'Missing'}`);
  console.log(`✅ Twitter Cards: ${layoutContent.includes('twitter') ? 'Present' : 'Missing'}`);
  console.log(`✅ Structured Data: ${layoutContent.includes('application/ld+json') ? 'Present' : 'Missing'}`);
}

console.log('\n========================');
console.log(`🏁 Overall SEO Status: ${allFilesExist ? '✅ Good' : '⚠️ Needs attention'}\n`);