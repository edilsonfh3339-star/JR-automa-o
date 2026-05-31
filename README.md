# JR Agente — Servidor de Automação

Servidor Node.js para o agente de vendas do Edilson (JR Comércio).  
Faz scraping autenticado no site JR, gera pedidos no Supabase, registra no Google Sheets e gera PDF.

## Stack

- **Express** — servidor HTTP
- **Playwright** — scraping autenticado no site JR
- **Supabase** — banco de dados PostgreSQL
- **Google Sheets API** — planilha de pedidos
- **PDFKit** — geração de PDF do pedido

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/` | Health check |
| POST | `/buscar-produto` | Busca produto no site JR |
| POST | `/criar-pedido` | Cria novo pedido |
| POST | `/adicionar-item` | Adiciona item ao pedido |
| POST | `/finalizar-pedido` | Finaliza e gera PDF |

Todos os endpoints POST exigem o header `x-api-secret` com o valor configurado em `API_SECRET`.

## Deploy no Railway

1. Conecte este repositório no Railway
2. Configure as variáveis de ambiente (Settings → Variables):

```
JR_EMAIL=contato.sidnei@yahoo.com.br
JR_SENHA=senha_do_site_jr
SUPABASE_URL=https://sporheamewjhbixayyjk.supabase.co
SUPABASE_KEY=sua_anon_key
GOOGLE_SHEET_ID=id_da_planilha
GOOGLE_SERVICE_ACCOUNT_EMAIL=email_service_account
GOOGLE_PRIVATE_KEY=chave_privada
API_SECRET=chave_secreta_aleatoria
```

3. Railway detecta o Dockerfile automaticamente e faz o build

## Supabase

Execute o arquivo `scripts/supabase-schema.sql` no SQL Editor do Supabase.

## Desenvolvimento local

```bash
cp .env.example .env
# Editar .env com suas credenciais
npm install
npx playwright install chromium
npm start
```
