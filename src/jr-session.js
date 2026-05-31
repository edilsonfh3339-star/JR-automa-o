const { chromium } = require('playwright');

let browser = null;
let page = null;

async function getSession() {
  if (page && !page.isClosed()) return page;

  const isDocker = process.env.CHROMIUM_PATH === '/usr/bin/chromium';

  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: isDocker ? [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ] : []
  });

  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto('https://www.jrcomercio.com.br/login', { waitUntil: 'networkidle' });

  await page.fill('input[name="email"], input[type="email"]', process.env.JR_EMAIL);
  await page.fill('input[name="password"], input[type="password"]', process.env.JR_SENHA);
  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  console.log('Sessão JR Comércio iniciada');
  return page;
}

async function closeSession() {
  if (browser) {
    await browser.close();
    browser = null;
    page = null;
  }
}

module.exports = { getSession, closeSession };
