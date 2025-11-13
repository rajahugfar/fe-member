/**
 * Script to scrape game providers from sacasino.tech
 * Run with: node scripts/scrape-providers.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create images directory if not exists
const imagesDir = path.join(__dirname, '..', 'backend', 'public', 'uploads', 'providers');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Categories to scrape
const categories = [
  { name: 'คาสิโน', url: 'https://sacasino.tech/_ajax_/%E0%B8%84%E0%B8%B2%E0%B8%AA%E0%B8%B4%E0%B9%82%E0%B8%99' },
  { name: 'บาคาร่า VIP', url: 'https://sacasino.tech/_ajax_/%E0%B8%9A%E0%B8%B2%E0%B8%84%E0%B8%B2%E0%B8%A3%E0%B9%88%E0%B8%B2-vip' },
  { name: 'เสือมังกร', url: 'https://sacasino.tech/_ajax_/%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B8%AD%E0%B8%A1%E0%B8%B1%E0%B8%87%E0%B8%81%E0%B8%A3' },
  { name: 'รูเล็ต', url: 'https://sacasino.tech/_ajax_/%E0%B8%A3%E0%B8%B9%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%95' },
  { name: 'ไฮโล', url: 'https://sacasino.tech/_ajax_/%E0%B9%84%E0%B8%AE%E0%B9%82%E0%B8%A5' },
  { name: 'แบล็กแจ็ก', url: 'https://sacasino.tech/_ajax_/%E0%B9%81%E0%B8%9A%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B9%81%E0%B8%88%E0%B9%87%E0%B8%81' },
  { name: 'สล็อต', url: 'https://sacasino.tech/_ajax_/%E0%B8%AA%E0%B8%A5%E0%B9%87%E0%B8%AD%E0%B8%95' },
  { name: 'กีฬา', url: 'https://sacasino.tech/_ajax_/sport' },
  { name: 'หวย', url: 'https://sacasino.tech/_ajax_/%E0%B8%AB%E0%B8%A7%E0%B8%A2' },
  { name: 'เกมโชว์', url: 'https://sacasino.tech/_ajax_/%E0%B9%80%E0%B8%81%E0%B8%A1%E0%B9%82%E0%B8%8A%E0%B8%A7%E0%B9%8C' },
];

// This will be populated dynamically from scraping

// Helper function to delay execution
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'accept': '*/*',
        'accept-language': 'th-TH,th;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'cookie': '_ga=GA1.1.2094713942.1761201555; PHPSESSID=usuv64bpsc1ob8obth6kbdmber; client_view_mode=casino; _ga_TDDWBESJCE=GS2.1.s1762746030$o13$g1$t1762746242$j59$l0$h0',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': 'https://sacasino.tech/',
        'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filepath);
        });
      } else {
        reject(new Error(`Failed to download: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

function extractProviders(html, categoryName) {
  const providers = [];
  
  // Extract all img tags with alt and data-src or src
  const imgRegex = /<img[^>]+alt="([^"]+)"[^>]*(?:data-src|src)="([^"]+)"/g;
  
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const alt = match[1];
    const imageSrc = match[2];
    
    // Skip if not a valid image URL
    if (!imageSrc || imageSrc.startsWith('data:')) continue;
    
    // Extract provider code from alt (e.g., "wt-ppa-live cover image png" or "sa-gaming")
    const codeMatch = alt.match(/^([a-z0-9-]+)/i);
    if (codeMatch) {
      const code = codeMatch[1].toLowerCase();
      
      // Extract provider name from image path or alt text
      let name = code;
      
      // Try to get name from path
      const pathMatch = imageSrc.match(/\/([^/]+)\/(?:ezs-|cover-)/);
      if (pathMatch) {
        name = pathMatch[1].split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
      } else {
        // Use code as name with proper formatting
        name = code.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
      }
      
      // Make sure image URL is absolute
      let fullImageUrl = imageSrc;
      if (imageSrc.startsWith('//')) {
        fullImageUrl = 'https:' + imageSrc;
      } else if (imageSrc.startsWith('/')) {
        fullImageUrl = 'https://sacasino.tech' + imageSrc;
      }
      
      providers.push({
        code,
        name,
        image: fullImageUrl,
        category: categoryName
      });
    }
  }
  
  return providers;
}

async function main() {
  console.log('🎰 Scraping providers from sacasino.tech...\n');
  console.log(`📊 Total categories to scrape: ${categories.length}\n`);
  
  const allProviders = new Map();
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    console.log(`📂 [${i + 1}/${categories.length}] Fetching ${category.name}...`);
    
    let retries = 3;
    let success = false;
    
    while (retries > 0 && !success) {
      try {
        const html = await fetchHTML(category.url);
        const providers = extractProviders(html, category.name);
        
        providers.forEach(p => {
          if (!allProviders.has(p.code)) {
            allProviders.set(p.code, p);
            console.log(`   ✓ ${p.code} - ${p.name}`);
          }
        });
        
        console.log(`   Found ${providers.length} providers in ${category.name}`);
        success = true;
        
        // Wait 2 seconds before next request to avoid rate limiting
        console.log(`   ⏳ Waiting 2 seconds...`);
        await delay(2000);
      } catch (error) {
        retries--;
        console.error(`   ✗ Error: ${error.message}`);
        if (retries > 0) {
          console.log(`   🔄 Retrying... (${retries} attempts left)`);
          await delay(3000);
        } else {
          console.error(`   ❌ Failed after all retries`);
        }
      }
    }
  }
  
  const result = Array.from(allProviders.values());
  
  console.log(`\n✅ Total unique providers: ${result.length}\n`);
  
  // Download images
  console.log('📥 Downloading images...\n');
  for (const provider of result) {
    try {
      const filename = `${provider.code}.png`;
      const filepath = path.join(imagesDir, filename);
      
      console.log(`  Downloading ${provider.code}...`);
      await downloadImage(provider.image, filepath);
      
      // Update image path to local path
      provider.localImage = `/uploads/providers/${filename}`;
      console.log(`  ✓ Saved to ${filename}`);
      
      // Wait 500ms between image downloads
      await delay(500);
    } catch (error) {
      console.error(`  ✗ Failed to download ${provider.code}: ${error.message}`);
      // Continue even on error
      await delay(500);
    }
  }
  
  console.log('\n📋 Providers:');
  result.forEach(p => {
    console.log(`  - ${p.code}: ${p.name}`);
    console.log(`    Original: ${p.image}`);
    console.log(`    Local: ${p.localImage || 'Failed'}`);
  });
  
  // Save to JSON file
  const outputPath = path.join(__dirname, 'providers.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n💾 Saved to ${outputPath}`);
  
  // Generate SQL INSERT statements
  const sqlPath = path.join(__dirname, 'insert-providers.sql');
  const sqlStatements = result.map((p, index) => {
    const imagePath = p.localImage || p.image;
    return `INSERT INTO game_providers (id, product_code, product_name, category, image_path, status, created_at, updated_at) 
VALUES (${index + 1}, '${p.code}', '${p.name}', '${p.category}', '${imagePath}', 1, NOW(), NOW());`;
  }).join('\n');
  
  fs.writeFileSync(sqlPath, sqlStatements);
  console.log(`💾 Saved SQL to ${sqlPath}`);
  
  console.log('\n✅ Done! You can now run the SQL file to insert providers into database.');
}

main().catch(console.error);
