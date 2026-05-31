const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  { realtime: { transport: ws } }
);

async function criarPedido(cliente) {
  const { data, error } = await supabase.from('pedidos').insert([{
    cliente, status: 'aberto', criado_em: new Date().toISOString()
  }]).select().single();
  if (error) throw new Error(error.message);
  return { pedido: data };
}

async function adicionarItem(pedidoId, produto, quantidade, preco) {
  const { data, error } = await supabase.from('itens_pedido').insert([{
    pedido_id: pedidoId, produto, quantidade, preco: preco || 0
  }]).select().single();
  if (error) throw new Error(error.message);
  return { item: data };
}

async function finalizarPedido(pedidoId) {
  const { data: pedido, error } = await supabase.from('pedidos')
    .select('*, itens_pedido(*)').eq('id', pedidoId).single();
  if (error) throw new Error(error.message);
  const total = pedido.itens_pedido.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  await supabase.from('pedidos').update({ status: 'finalizado', total, finalizado_em: new Date().toISOString() }).eq('id', pedidoId);
  return { pedidoId, cliente: pedido.cliente, itens: pedido.itens_pedido, total, status: 'finalizado' };
}

module.exports = { criarPedido, adicionarItem, finalizarPedido };