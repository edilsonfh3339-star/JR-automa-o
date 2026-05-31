require('dotenv').config();
const express = require('express');
const { buscarProduto } = require('./buscar-produto');
const { criarPedido, adicionarItem, finalizarPedido } = require('./pedido');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || 'jr-agente-secret-2024';

// Middleware de autenticação
function auth(req, res, next) {
  const secret = req.headers['x-api-secret'];
  if (secret !== API_SECRET) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  next();
}

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', servico: 'JR Agente', versao: '1.0.0' });
});

// Buscar produto
app.post('/buscar-produto', auth, async (req, res) => {
  try {
    const { termo } = req.body;
    if (!termo) return res.status(400).json({ erro: 'Campo "termo" obrigatório' });
    const resultado = await buscarProduto(termo);
    res.json(resultado);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Criar pedido
app.post('/criar-pedido', auth, async (req, res) => {
  try {
    const { cliente } = req.body;
    if (!cliente) return res.status(400).json({ erro: 'Campo "cliente" obrigatório' });
    const pedido = await criarPedido(cliente);
    res.json(pedido);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Adicionar item
app.post('/adicionar-item', auth, async (req, res) => {
  try {
    const { pedidoId, produto, quantidade, preco } = req.body;
    if (!pedidoId || !produto) return res.status(400).json({ erro: 'pedidoId e produto são obrigatórios' });
    const item = await adicionarItem(pedidoId, produto, quantidade || 1, preco);
    res.json(item);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Finalizar pedido
app.post('/finalizar-pedido', auth, async (req, res) => {
  try {
    const { pedidoId } = req.body;
    if (!pedidoId) return res.status(400).json({ erro: 'pedidoId é obrigatório' });
    const resultado = await finalizarPedido(pedidoId);
    res.json(resultado);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`JR Agente rodando na porta ${PORT}`);
});
