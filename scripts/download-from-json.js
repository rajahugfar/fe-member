const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/sacasino');

// All collected image URLs
const imageUrls = [
  // Homepage - Logos
  'https://sacasino.tech/build/web/ezl-sa-casino/img/logo.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/logo-invert.png?v=4',
  
  // Icons
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-invitation.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-invitation-active.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-promotion.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-promotion-active.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-telegram-support.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-telegram-support-mobile.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-line-support.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-line-support-mobile.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-casino.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-slot.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-sport.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-lotto.png?v=4',
  
  // Special Menu
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-item-bg.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-social-share.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-daily-check-in.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-wheel.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-bind-social.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-invitation.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-happy-birth-day.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-ranking.png?v=4',
  
  // Banners
  'https://sacasino.tech/media/cache/strip/202412/block/ed589e77f72bb6e2edc67040e18c6de4.jpg',
  'https://sacasino.tech/media/cache/strip/202412/block/af6e0b7dacc35d572f58b70a18a5d926.jpg',
  'https://sacasino.tech/media/cache/strip/202412/block/062a43b54902c26ca542b464642b4dbf.jpg',
  'https://sacasino.tech/media/cache/strip/202412/block/fad31dcc94be4093b4d36e7786893ca6.jpg',
  'https://sacasino.tech/media/cache/strip/202412/block/6ac8f2cc45f6b89e2266496f03a8f270.jpg',
  
  // Category Icons
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat-vip.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat-vip-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-dragon-tiger.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-dragon-tiger-hover.png?v=4',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/menu-icon-category-roulette.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/menu-icon-category-roulette-hover.png',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-hilo.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-hilo-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-blackjack.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-blackjack-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-slot.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-slot-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-sport.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-sport-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-lotto.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-lotto-hover.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-game-show.png?v=4',
  'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-game-show-hover.png?v=4',
  
  // Provider Logos
  'https://asset.cloudigame.co/build/admin/img/wt-ppa-live/ezs-wt-ppa-live-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wt-dg-v2/ezs-wt-dg-v2-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/sa-gaming/ezs-sa-gaming-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wm/ezs-wm-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wt-pt-live/ezs-wt-pt-live-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wt-eg/ezs-wt-eg-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wt-aesexy/ezs-wt-aesexy-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wt-allbet-full/ezs-wt-allbet-full-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/wtm-asia-gaming/ezs-wtm-asia-gaming-vertical.png',
  
  // Game Images from Baccarat VIP
  'https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V102-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V003-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V803-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/mdkqdxtkdctrhnsx-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/olbibp3fylzaxvhb-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/mdkqfe74dctrhntj-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/olbinkuoylzayeoj-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000005-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000006-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/p36n5jvdx7bugh2g-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000008-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000009-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000010-vertical.png',
  'https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/bal_vipbaccarat-vertical.png',
  
  // Other
  'https://sacasino.tech/build/web/ezl-sa-casino/img/review-cover-title.png?v=4',
  'https://sacasino.tech/media/cache/strip/202206/block/155498d2c00648afdef2a59787ccbc5b.png',
  'https://sacasino.tech/media/cache/strip/202206/block/2b692d4e149c6e4fb80e963419898365.png',
  'https://sacasino.tech/media/cache/strip/202206/block/3173c813fbef0d31b8a887e1421a7383.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-website-menu-blog.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-alert-success.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-alert-failed.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/company-smashtech-dark.png',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/company-smashtech-light.png',
  
  // Backgrounds
  'https://sacasino.tech/build/web/ezl-sa-casino/img/index-bg.jpg?v=4',
  'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/bookmark-modal-content-bg.png',
];

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

function categorizeUrl(url) {
  const pathname = new URL(url).pathname;
  
  if (pathname.includes('logo')) return 'logos';
  if (pathname.includes('banner') || pathname.includes('block')) return 'banners';
  if (pathname.includes('menu-icon-category')) return 'categories';
  if (pathname.includes('special-menu')) return 'special';
  if (pathname.includes('ic-') || pathname.includes('icon')) return 'icons';
  if (pathname.includes('bg') || pathname.includes('background')) return 'backgrounds';
  if (pathname.includes('vertical') || pathname.includes('game')) return 'games';
  if (pathname.includes('provider') || pathname.includes('ezs-')) return 'providers';
  if (pathname.includes('company')) return 'footer';
  
  return 'misc';
}

async function main() {
  console.log('🚀 Starting download...\n');
  console.log(`📊 Total URLs: ${imageUrls.length}\n`);
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  let successCount = 0;
  let failCount = 0;
  const categories = {};
  
  for (const url of imageUrls) {
    try {
      const category = categorizeUrl(url);
      const filename = path.basename(new URL(url).pathname).split('?')[0];
      const outputPath = path.join(OUTPUT_DIR, category, filename);
      
      await downloadFile(url, outputPath);
      successCount++;
      
      if (!categories[category]) categories[category] = 0;
      categories[category]++;
      
      console.log(`✓ [${category}] ${filename}`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      failCount++;
      console.log(`✗ Failed: ${url.substring(0, 60)}...`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✨ Download Complete!');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📁 Output: ${OUTPUT_DIR}\n`);
  console.log('📋 By category:');
  Object.keys(categories).sort().forEach(cat => {
    console.log(`   ${cat}: ${categories[cat]} files`);
  });
}

main().catch(console.error);
