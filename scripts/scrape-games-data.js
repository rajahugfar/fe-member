const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const OUTPUT_DIR = path.join(__dirname, '../frontend/public/images/sacasino');
const DATA_FILE = path.join(__dirname, 'games-data.json');

// Game data collected from all tabs via Puppeteer
const gamesData = {
  "baccarat_vip": [
    { code: "V102", name: "VIP Baccarat 102", provider: "Allbet", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V102-vertical.png" },
    { code: "V003", name: "VIP Baccarat 003", provider: "Allbet", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V003-vertical.png" },
    { code: "V803", name: "VIP Baccarat 803", provider: "Allbet", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-allbet-full/V803-vertical.png" },
    { code: "mdkqdxtkdctrhnsx", name: "Baccarat VIP", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/mdkqdxtkdctrhnsx-vertical.png" },
    { code: "olbibp3fylzaxvhb", name: "Baccarat VIP", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/olbibp3fylzaxvhb-vertical.png" },
    { code: "mdkqfe74dctrhntj", name: "Baccarat VIP", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/mdkqfe74dctrhntj-vertical.png" },
    { code: "olbinkuoylzayeoj", name: "Baccarat VIP", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/olbinkuoylzayeoj-vertical.png" },
    { code: "SalPrivBJ0000005", name: "Salon Prive Baccarat 5", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000005-vertical.png" },
    { code: "SalPrivBJ0000006", name: "Salon Prive Baccarat 6", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000006-vertical.png" },
    { code: "p36n5jvdx7bugh2g", name: "Baccarat VIP", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/p36n5jvdx7bugh2g-vertical.png" },
    { code: "SalPrivBJ0000008", name: "Salon Prive Baccarat 8", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000008-vertical.png" },
    { code: "SalPrivBJ0000009", name: "Salon Prive Baccarat 9", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000009-vertical.png" },
    { code: "SalPrivBJ0000010", name: "Salon Prive Baccarat 10", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SalPrivBJ0000010-vertical.png" },
    { code: "bal_vipbaccarat", name: "VIP Baccarat", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/bal_vipbaccarat-vertical.png" }
  ],
  "slot": [
    { code: "wt-ppa", name: "Pragmatic Play", provider: "Pragmatic Play", image: "https://asset.cloudigame.co/build/admin/img/wt-ppa/ezs-wt-ppa-vertical.png" },
    { code: "smm-pg-soft", name: "PG Soft", provider: "PG Soft", image: "https://asset.cloudigame.co/build/admin/img/smm-pg-soft/ezs-smm-pg-soft-vertical.png" },
    { code: "wt-advant-play", name: "AdvantPlay", provider: "AdvantPlay", image: "https://asset.cloudigame.co/build/admin/img/wt-advant-play/ezs-wt-advant-play-vertical.png" },
    { code: "sm-5g-games", name: "5G Games", provider: "5G Games", image: "https://asset.cloudigame.co/build/admin/img/sm-5g-games/ezs-sm-5g-games-vertical.png" },
    { code: "wt-joker", name: "Joker Gaming", provider: "Joker", image: "https://asset.cloudigame.co/build/admin/img/wt-joker/ezs-wt-joker-vertical.png" },
    { code: "wt-jili", name: "JILI", provider: "JILI", image: "https://asset.cloudigame.co/build/admin/img/wt-jili/ezs-wt-jili-vertical.png" },
    { code: "wtm-endorphina", name: "Endorphina", provider: "Endorphina", image: "https://asset.cloudigame.co/build/admin/img/wtm-endorphina/ezs-wtm-endorphina-vertical.png" },
    { code: "wt-habanero", name: "Habanero", provider: "Habanero", image: "https://asset.cloudigame.co/build/admin/img/wt-habanero/ezs-wt-habanero-vertical.png" },
    { code: "wt-wm-slot", name: "WM Slot", provider: "WM", image: "https://asset.cloudigame.co/build/admin/img/wt-wm-slot/ezs-wt-wm-slot-vertical.png" },
    { code: "wt-evo-play", name: "Evo Play", provider: "Evo Play", image: "https://asset.cloudigame.co/build/admin/img/wt-evo-play/ezs-wt-evo-play-vertical.png" },
    { code: "sm-hot-dog", name: "Hot Dog", provider: "Hot Dog", image: "https://asset.cloudigame.co/build/admin/img/sm-hot-dog/ezs-sm-hot-dog-vertical.png" },
    { code: "wt-only-play", name: "Only Play", provider: "Only Play", image: "https://asset.cloudigame.co/build/admin/img/wt-only-play/ezs-wt-only-play-vertical.png" },
    { code: "wt-cq9", name: "CQ9", provider: "CQ9", image: "https://asset.cloudigame.co/build/admin/img/wt-cq9/ezs-wt-cq9-vertical.png" },
    { code: "wt-ps", name: "PlayStar", provider: "PlayStar", image: "https://asset.cloudigame.co/build/admin/img/wt-ps/ezs-wt-ps-vertical.png" },
    { code: "wt-red-tiger", name: "Red Tiger", provider: "Red Tiger", image: "https://asset.cloudigame.co/build/admin/img/wt-red-tiger/ezs-wt-red-tiger-vertical.png" },
    { code: "wt-netent-slot", name: "NetEnt", provider: "NetEnt", image: "https://asset.cloudigame.co/build/admin/img/wt-netent-slot/ezs-wt-netent-slot-vertical.png" }
  ],
  "game_show": [
    { code: "swle_spinawinwild", name: "Spin a Win Wild", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/swle_spinawinwild-vertical.png" },
    { code: "abwl_wonderland", name: "Adventures Beyond Wonderland", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/abwl_wonderland-vertical.png" },
    { code: "tgcsl_cardshow", name: "The Great Card Show", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/tgcsl_cardshow-vertical.png" },
    { code: "rol_quantumroulette", name: "Quantum Roulette", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/rol_quantumroulette-vertical.png" },
    { code: "cml_cardmatch", name: "Card Match", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/cml_cardmatch-vertical.png" },
    { code: "ejl_everybodysjp", name: "Everybody's Jackpot", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/ejl_everybodysjp-vertical.png" },
    { code: "bfbl_liveslots", name: "Buffalo Blitz Live", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/bfbl_liveslots-vertical.png" },
    { code: "fbbjl_fireblazebj", name: "Fire Blaze Blackjack", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/fbbjl_fireblazebj-vertical.png" },
    { code: "fbrol_fireblazerol", name: "Fire Blaze Roulette", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/fbrol_fireblazerol-vertical.png" },
    { code: "fbbl_luckyballbr", name: "Lucky Ball Bingo", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/fbbl_luckyballbr-vertical.png" }
  ],
  "roulette": [
    { code: "rol_speedautoroulette", name: "Speed Auto Roulette", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/rol_speedautoroulette-vertical.png" },
    { code: "rol_speedrol", name: "Speed Roulette", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/rol_speedrol-vertical.png" },
    { code: "sprol_perspreadbetrol", name: "Spread Bet Roulette", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-pt-live/sprol_perspreadbetrol-vertical.png" },
    { code: "72", name: "Roulette 72", provider: "AE Sexy", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-aesexy/72-vertical.png" },
    { code: "71", name: "Roulette 71", provider: "AE Sexy", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-aesexy/71-vertical.png" },
    { code: "SpeedAutoRo00001", name: "Speed Auto Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/SpeedAutoRo00001-vertical.png" },
    { code: "f1f4rm9xgh4j3u2z", name: "Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/f1f4rm9xgh4j3u2z-vertical.png" },
    { code: "01rb77cq1gtenhmo", name: "Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/01rb77cq1gtenhmo-vertical.png" },
    { code: "48z5pjps3ntvqc1b", name: "Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/48z5pjps3ntvqc1b-vertical.png" },
    { code: "o45dbskcc3aqs4av", name: "Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/o45dbskcc3aqs4av-vertical.png" },
    { code: "lkcbrbdckjxajdol", name: "Roulette", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-eg/lkcbrbdckjxajdol-vertical.png" },
    { code: "10401", name: "Roulette 1", provider: "Dream Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-dg-v2/10401-vertical.png" },
    { code: "20401", name: "Roulette 2", provider: "Dream Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-dg-v2/20401-vertical.png" },
    { code: "30401", name: "Roulette 3", provider: "Dream Gaming", image: "https://asset.cloudigame.co/build/admin/img/ez-wt-dg-v2/30401-vertical.png" }
  ],
  "casino": [
    { code: "wt-ppa-live", name: "Pragmatic Play Live", provider: "Pragmatic Play", image: "https://asset.cloudigame.co/build/admin/img/wt-ppa-live/ezs-wt-ppa-live-vertical.png" },
    { code: "wt-dg-v2", name: "Dream Gaming", provider: "Dream Gaming", image: "https://asset.cloudigame.co/build/admin/img/wt-dg-v2/ezs-wt-dg-v2-vertical.png" },
    { code: "sa-gaming", name: "SA Gaming", provider: "SA Gaming", image: "https://asset.cloudigame.co/build/admin/img/sa-gaming/ezs-sa-gaming-vertical.png" },
    { code: "wm", name: "WM Casino", provider: "WM", image: "https://asset.cloudigame.co/build/admin/img/wm/ezs-wm-vertical.png" },
    { code: "wt-pt-live", name: "Pragmatic Live", provider: "Pragmatic Live", image: "https://asset.cloudigame.co/build/admin/img/wt-pt-live/ezs-wt-pt-live-vertical.png" },
    { code: "wt-eg", name: "Evolution Gaming", provider: "Evolution Gaming", image: "https://asset.cloudigame.co/build/admin/img/wt-eg/ezs-wt-eg-vertical.png" },
    { code: "wt-aesexy", name: "AE Sexy", provider: "AE Sexy", image: "https://asset.cloudigame.co/build/admin/img/wt-aesexy/ezs-wt-aesexy-vertical.png" },
    { code: "wt-allbet-full", name: "Allbet", provider: "Allbet", image: "https://asset.cloudigame.co/build/admin/img/wt-allbet-full/ezs-wt-allbet-full-vertical.png" },
    { code: "wtm-asia-gaming", name: "Asia Gaming", provider: "Asia Gaming", image: "https://asset.cloudigame.co/build/admin/img/wtm-asia-gaming/ezs-wtm-asia-gaming-vertical.png" }
  ]
};

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

async function main() {
  console.log('🎮 Starting game data collection and image download...\n');
  
  // Save games data to JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(gamesData, null, 2));
  console.log(`✅ Saved games data to: ${DATA_FILE}\n`);
  
  let totalGames = 0;
  let downloadedCount = 0;
  let failedCount = 0;
  
  // Download images for each category
  for (const [category, games] of Object.entries(gamesData)) {
    console.log(`\n📂 Category: ${category.toUpperCase()}`);
    console.log(`   Games: ${games.length}`);
    
    for (const game of games) {
      totalGames++;
      try {
        const filename = path.basename(new URL(game.image).pathname);
        const outputPath = path.join(OUTPUT_DIR, 'games', category, filename);
        
        await downloadFile(game.image, outputPath);
        downloadedCount++;
        console.log(`   ✓ [${game.provider}] ${game.code} - ${filename}`);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        failedCount++;
        console.log(`   ✗ Failed: ${game.code}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✨ Complete!');
  console.log('='.repeat(70));
  console.log(`📊 Total games: ${totalGames}`);
  console.log(`✅ Downloaded: ${downloadedCount}`);
  console.log(`❌ Failed: ${failedCount}`);
  console.log(`\n📁 Images saved to: ${OUTPUT_DIR}/games/`);
  console.log(`📄 Game data saved to: ${DATA_FILE}`);
  console.log('\n💡 You can now map these games to your database using:');
  console.log('   - game.code (unique identifier)');
  console.log('   - game.provider (provider name)');
  console.log('   - game.name (display name)');
}

main().catch(console.error);
