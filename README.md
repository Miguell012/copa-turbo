# Copa Turbo

SaaS para comerciantes criarem campanhas promocionais para os dias de jogos da Copa.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/planos` | Escolha do plano |
| `/criar` | Formulário da campanha |
| `/preview` | Prévia dos materiais |
| `/checkout` | Pagamento simulado |
| `/sucesso` | Campanha liberada |
| `/promocao/[slug]` | Página pública da promoção |

## Fluxo

1. Landing → escolher plano em `/planos`
2. Criar campanha em `/criar`
3. Ver prévia em `/preview`
4. Checkout simulado em `/checkout`
5. Sucesso em `/sucesso` com link e materiais
6. Clientes acessam `/promocao/[slug]` com contagem regressiva

## Armazenamento

Campanhas e rascunhos são salvos em `localStorage` (sem banco de dados nesta versão).

## Próximos passos

- Integração Mercado Pago
- Banco de dados
- Exportação real de imagens (PNG)
