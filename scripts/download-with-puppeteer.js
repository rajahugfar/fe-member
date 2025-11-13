const puppeteer = require('puppeteer');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/sacasino');

// Function to download file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const file = fs.createWriteStream(outputPath);
      
      const request = protocol.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          downloadFile(response.headers.location, outputPath)
            .then(resolve)
            .catch(reject);
          return;
        }
        
        if (response.statusCode !== 200) {
          reject(new Error(`Failed: ${response.statusCode}`));
          return;
        }
        
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
      });
      
      request.on('error', (err) => {
        fs.unlink(outputPath, () => {});
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Function to sanitize filename
function sanitizeFilename(name) {
  return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
}

async function main() {
  console.log('🚀 Starting Puppeteer image download...\n');
  
  const browser = await puppeteer.launch({
    headless: false, // เปิด browser ให้เห็น
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to homepage
    console.log('📍 Navigating to sacasino.tech...');
    await page.goto('https://sacasino.tech', { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });
    
    await page.waitForTimeout(3000);
    
    const allImages = new Set();
    const imagesByCategory = {};
    
    // Get all category tabs
    console.log('\n🔍 Finding all category tabs...');
    const categoryTabs = await page.evaluate(() => {
      const tabs = [];
      
      // Find all nav items with links
      const navItems = document.querySelectorAll('.nav-item a, [class*="category"] a, [class*="menu"] a');
      
      navItems.forEach(item => {
        const text = item.textContent.trim();
        const href = item.href;
        
        // Filter for game category tabs
        if (text && href && 
            (text.includes('คาสิโน') || text.includes('บาคาร่า') || 
             text.includes('เสือมังกร') || text.includes('รูเล็ต') || 
             text.includes('ไฮโล') || text.includes('แบล็กแจ็ก') || 
             text.includes('สล็อต') || text.includes('กีฬา') || 
             text.includes('หวย') || text.includes('เกมโชว์'))) {
          tabs.push({ text, href });
        }
      });
      
      return tabs;
    });
    
    console.log(`✅ Found ${categoryTabs.length} category tabs`);
    categoryTabs.forEach((tab, i) => {
      console.log(`   ${i + 1}. ${tab.text}`);
    });
    
    // Download images from homepage first
    console.log('\n📥 Downloading homepage images...');
    const homepageImages = await page.evaluate(() => {
      const images = [];
      
      // Get all images
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && !src.includes('data:image') && !src.includes('base64')) {
          images.push({
            src: src,
            alt: img.alt || '',
            className: img.className || ''
          });
        }
      });
      
      // Get background images
      document.querySelectorAll('*').forEach(el => {
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none' && bg.includes('url')) {
          const urlMatch = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            images.push({
              src: urlMatch[1],
              alt: 'background',
              className: 'background'
            });
          }
        }
      });
      
      return images;
    });
    
    // Process homepage images
    for (const img of homepageImages) {
      if (!allImages.has(img.src)) {
        allImages.add(img.src);
        
        try {
          const urlObj = new URL(img.src);
          const pathname = urlObj.pathname;
          const filename = path.basename(pathname).split('?')[0];
          
          let category = 'homepage';
          if (pathname.includes('banner') || pathname.includes('block')) {
            category = 'banners';
          } else if (pathname.includes('logo')) {
            category = 'logos';
          } else if (pathname.includes('icon') || pathname.includes('ic-')) {
            category = 'icons';
          } else if (pathname.includes('background') || pathname.includes('bg')) {
            category = 'backgrounds';
          } else if (pathname.includes('provider')) {
            category = 'providers';
          }
          
          const outputPath = path.join(OUTPUT_DIR, category, filename);
          
          await downloadFile(img.src, outputPath);
          console.log(`   ✓ ${category}/${filename}`);
        } catch (error) {
          console.log(`   ✗ Failed: ${img.src.substring(0, 60)}...`);
        }
      }
    }
    
    // Visit each category tab
    for (let i = 0; i < categoryTabs.length; i++) {
      const tab = categoryTabs[i];
      const categoryName = sanitizeFilename(tab.text);
      
      console.log(`\n📂 [${i + 1}/${categoryTabs.length}] Processing: ${tab.text}`);
      
      try {
        await page.goto(tab.href, { 
          waitUntil: 'networkidle2',
          timeout: 60000 
        });
        
        await page.waitForTimeout(2000);
        
        // Scroll to load lazy images
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2);
        });
        
        await page.waitForTimeout(1500);
        
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await page.waitForTimeout(1500);
        
        // Get all images on this page
        const pageImages = await page.evaluate(() => {
          const images = [];
          
          document.querySelectorAll('img').forEach(img => {
            const src = img.src || img.getAttribute('data-src');
            if (src && !src.includes('data:image') && !src.includes('base64')) {
              images.push({
                src: src,
                alt: img.alt || '',
                className: img.className || ''
              });
            }
          });
          
          return images;
        });
        
        console.log(`   Found ${pageImages.length} images`);
        
        if (!imagesByCategory[categoryName]) {
          imagesByCategory[categoryName] = [];
        }
        
        // Download images
        let downloadCount = 0;
        for (const img of pageImages) {
          if (!allImages.has(img.src)) {
            allImages.add(img.src);
            imagesByCategory[categoryName].push(img.src);
            
            try {
              const urlObj = new URL(img.src);
              const pathname = urlObj.pathname;
              const filename = path.basename(pathname).split('?')[0];
              
              // Determine subcategory
              let subcategory = categoryName;
              if (pathname.includes('provider') || img.className.includes('provider')) {
                subcategory = `${categoryName}/providers`;
              } else if (pathname.includes('game') || img.className.includes('game')) {
                subcategory = `${categoryName}/games`;
              }
              
              const outputPath = path.join(OUTPUT_DIR, 'categories', subcategory, filename);
              
              await downloadFile(img.src, outputPath);
              downloadCount++;
              console.log(`   ✓ ${subcategory}/${filename}`);
            } catch (error) {
              // Skip failed downloads silently
            }
          }
        }
        
        console.log(`   ✅ Downloaded ${downloadCount} new images from ${tab.text}`);
        
      } catch (error) {
        console.log(`   ✗ Error processing ${tab.text}:`, error.message);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ Download Complete!');
    console.log('='.repeat(60));
    console.log(`📊 Total unique images downloaded: ${allImages.size}`);
    console.log(`📁 Output directory: ${OUTPUT_DIR}`);
    console.log('\n📋 Images by category:');
    Object.keys(imagesByCategory).forEach(cat => {
      console.log(`   ${cat}: ${imagesByCategory[cat].length} images`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
