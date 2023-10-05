const puppeteer = require('puppeteer');

async function main() {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6048.0 Safari/537');
    await page.setRequestInterception(true);
    
    page.on('request', (interceptedRequest) => {
        if (interceptedRequest.url() === 'https://api.cyberking.uk/challenge-answer' && interceptedRequest.method() === 'POST') {
            console.log("Overriding");
            const postData = '["c","y","b","e","r","k","i","n","g"]';
            const headers = {
                ...interceptedRequest.headers(),
                'Content-Length': Buffer.byteLength(postData),
            };
            interceptedRequest.continue({headers, postData});
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
