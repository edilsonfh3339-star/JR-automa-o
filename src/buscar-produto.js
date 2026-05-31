const { getSession } = require('./jr-session');

async function buscarProduto(termo) {
  const page = await getSession();

  await page.goto(`https://www.jrcomercio.com.br/busca?q=${encodeURIComponent(termo)}`, {
    waitUntil: 'networkidle'
  });

  const produtos = await page.evaluate(() => {
    const items = document.querySelectorAll('.product-item, .produto, [class*="product"]');
    return Array.from(items).slice(0, 10).map(el => {
      const nome = el.querySelector('h2, h3, .nome, .title, [class*="name"]')?.textContent?.trim() || '';
      const preco = el.querySelector('.preco, .price, [class*="price"]')?.textContent?.trim() || '';
      const codigo = el.querySelector('.codigo, .sku, [class*="code"]')?.textContent?.trim() || '';
      const imagem = el.querySelector('img')?.src || '';
      return { nome, preco, codigo, imagem };
    }).filter(p => p.nome);
  });

  return {
    termo,
    total: produtos.length,
    produtos
  };
}

module.exports = { buscarProduto };
