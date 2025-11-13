const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create output directory
const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/sacasino');

// Image URLs from sacasino.tech
const imageUrls = {
  // Logo
  'logo.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/logo.png?v=4',
  'logo-invert.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/logo-invert.png?v=4',
  
  // Icons
  'icons/menu-invitation.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-invitation.png?v=4',
  'icons/menu-invitation-active.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-invitation-active.png?v=4',
  'icons/menu-promotion.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-promotion.png?v=4',
  'icons/menu-promotion-active.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-menu-promotion-active.png?v=4',
  'icons/telegram-support.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-telegram-support.png?v=4',
  'icons/telegram-support-mobile.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-telegram-support-mobile.png?v=4',
  'icons/line-support.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-line-support.png?v=4',
  'icons/line-support-mobile.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-line-support-mobile.png?v=4',
  
  // View Mode Icons (Categories)
  'categories/casino.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-casino.png?v=4',
  'categories/slot.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-slot.png?v=4',
  'categories/sport.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-sport.png?v=4',
  'categories/lotto.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-view-mode-lotto.png?v=4',
  
  // Menu Category Icons
  'categories/menu-baccarat.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat.png?v=4',
  'categories/menu-baccarat-vip.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-baccarat-vip.png?v=4',
  'categories/menu-dragon-tiger.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-dragon-tiger.png?v=4',
  'categories/menu-roulette.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/menu-icon-category-roulette.png',
  'categories/menu-hilo.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-hilo.png?v=4',
  'categories/menu-blackjack.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-blackjack.png?v=4',
  'categories/menu-slot.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-slot.png?v=4',
  'categories/menu-sport.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-sport.png?v=4',
  'categories/menu-lotto.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-lotto.png?v=4',
  'categories/menu-game-show.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/menu-icon-category-game-show.png?v=4',
  
  // Special Menu Entry
  'special/entry-item-bg.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-item-bg.png?v=4',
  'special/social-share.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-social-share.png?v=4',
  'special/daily-check-in.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-daily-check-in.png?v=4',
  'special/wheel.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-wheel.png?v=4',
  'special/bind-social.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-bind-social.png?v=4',
  'special/invitation.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-invitation.png?v=4',
  'special/happy-birth-day.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-happy-birth-day.png?v=4',
  'special/ranking.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/special-menu-entry-ranking.png?v=4',
  
  // Banners
  'banners/banner-1.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/6ac8f2cc45f6b89e2266496f03a8f270.jpg',
  'banners/banner-2.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/af6e0b7dacc35d572f58b70a18a5d926.jpg',
  'banners/banner-3.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/062a43b54902c26ca542b464642b4dbf.jpg',
  'banners/banner-4.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/ed589e77f72bb6e2edc67040e18c6de4.jpg',
  'banners/banner-5.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/fad31dcc94be4093b4d36e7786893ca6.jpg',
  
  // Backgrounds
  'backgrounds/index-bg.jpg': 'https://sacasino.tech/build/web/ezl-sa-casino/img/index-bg.jpg?v=4',
  'backgrounds/bookmark-modal-bg.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/bookmark-modal-content-bg.png',
  
  // Game Category Icons (from lazy loaded data-src)
  'slots.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-slot.png?v=4',
  'baccarat.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-baccarat.png?v=4',
  'roulette.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-roulette.png?v=4',
  'hilo.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-sicbo.png?v=4',
  'dragon-tiger.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-dragon-tiger.png?v=4',
  'fishing.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-fishing.png?v=4',
  'lottery.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-lotto.png?v=4',
  'sports.png': 'https://sacasino.tech/build/web/ezl-sa-casino/img/ic-game-type-sport.png?v=4',
  
  // Promotions (default placeholders)
  'promo-1.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/6ac8f2cc45f6b89e2266496f03a8f270.jpg',
  'promo-2.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/af6e0b7dacc35d572f58b70a18a5d926.jpg',
  'promo-3.jpg': 'https://sacasino.tech/media/cache/strip/202412/block/062a43b54902c26ca542b464642b4dbf.jpg',
  
  // Provider Logos (Sample from different providers)
  'providers/sa-gaming.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-sa-gaming.png',
  'providers/sexy-gaming.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-sexy-gaming.png',
  'providers/dream-gaming.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-dream-gaming.png',
  'providers/wm-casino.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-wm-casino.png',
  'providers/ae-sexy.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-ae-sexy.png',
  'providers/allbet.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-allbet.png',
  'providers/evolution-gaming.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-evolution-gaming.png',
  'providers/pragmatic-live.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/provider-logo-pragmatic-live.png',
  
  // Modal Icons
  'modals/ic-register.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-register.png',
  'modals/ic-login.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-login.png',
  'modals/ic-event.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-event.png',
  'modals/ic-promotion.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-promotion.png',
  'modals/ic-movie.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-movie.png',
  'modals/ic-line.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/ic-modal-menu-line.png',
  'modals/banner-social-share.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/menu-banner-social-share.png',
  
  // Company/Footer
  'footer/company-smashtech-dark.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/company-smashtech-dark.png',
  'footer/company-smashtech-light.png': 'https://asset.cloudigame.co/build/admin/img/wt_theme/ezl/company-smashtech-light.png',
};

// Function to download file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    // Create directory if it doesn't exist
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
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(outputPath)}`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main function
async function main() {
  console.log('Starting download of sacasino.tech images...\n');
  console.log('Output directory:', OUTPUT_DIR, '\n');
  
  // Create base directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [filename, url] of Object.entries(imageUrls)) {
    try {
      const outputPath = path.join(OUTPUT_DIR, filename);
      await downloadFile(url, outputPath);
      successCount++;
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\n=== Download Complete ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${Object.keys(imageUrls).length}`);
}

main().catch(console.error);
