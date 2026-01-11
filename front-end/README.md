# CM English - Front-end

Aplicacao web do CM English. Interface para explorar aulas, praticar atividades e acompanhar progresso.

## Requisitos

- Node.js + npm (ou Bun)

## Como rodar

```sh
npm install
npm run dev
```

Abra o endereco mostrado no terminal (normalmente http://localhost:5173).

## Variaveis de ambiente

As variaveis ficam em `.env` dentro de `front-end/`. Para o Vite, use o prefixo `VITE_`.

Exemplos (ajuste conforme necessario):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts

- `npm run dev` - servidor de desenvolvimento
- `npm run build` - build de producao
- `npm run preview` - preview do build
- `npm run lint` - lint

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
