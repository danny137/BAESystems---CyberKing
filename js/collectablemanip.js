// This won't guarantee a win, however is a pretty funny workaround.
// Images position themselves at the bottom of the screen due to their increased size
// Just move around the bottom for best chance of win if cannot find collectables


const puppeteer = require('puppeteer');
const fs = require('fs');

async function main() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6048.0 Safari/537');

    await page.setRequestInterception(true);

    page.on('request', interceptedRequest => {
      if (interceptedRequest.url().endsWith('collectable.js')) {
        interceptedRequest.respond({
          status: 200,
          contentType: 'application/javascript',
          body: fs.readFileSync('javascriptManipulation/cyberking.uk/challenge/static/collectable.js', 'utf8')
        });
      } else {
        interceptedRequest.continue();
      }
    });

    await page.goto('https://cyberking.uk/challenge/game.html');

    while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await browser.close();
}

main().catch(console.error);