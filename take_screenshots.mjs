import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set to mobile viewport
  await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
  
  const urls = [
    { url: 'http://localhost:3000/karbala', name: 'home_page_mobile' },
    { url: 'http://localhost:3000/karbala/nights/night-1', name: 'night_detail_mobile' },
    { url: 'http://localhost:3000/karbala/cards', name: 'cards_page_mobile' },
    { url: 'http://localhost:3000/admin', name: 'admin_dashboard_mobile' },
    { url: 'http://localhost:3000/admin/nights/new', name: 'admin_forms_mobile' }
  ];
  
  const artifactDir = '/home/mohamedmostafa/.gemini/antigravity/artifacts/d059c276-5e06-4905-9ce4-25fa9d904a78';
  if (!fs.existsSync(artifactDir)){
      fs.mkdirSync(artifactDir, { recursive: true });
  }

  for (const {url, name} of urls) {
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      // small delay to let animations/fonts load
      await new Promise(r => setTimeout(r, 2000));
      await page.screenshot({ path: `${artifactDir}/${name}.png`, fullPage: true });
      console.log(`Saved screenshot: ${name}.png`);
    } catch (e) {
      console.error(`Error capturing ${url}: ${e}`);
    }
  }
  
  await browser.close();
}

capture();
