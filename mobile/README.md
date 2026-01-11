# CM English - Mobile

Aplicativo mobile do CM English (Expo + React Native). Mantem a mesma proposta do web, com foco em experiencia mobile.

## Requisitos

- Node.js + npm
- Expo CLI (via `npx`)

## Como rodar

```sh
npm install
npx expo start
```

Abra no Expo Go (iOS/Android) ou execute em emulador.

## Estrutura

- `src/screens/` - telas principais (Landing, Auth, Dashboard, etc)
- `src/navigation/` - navegação (stack + tabs)
- `src/components/` - componentes reutilizáveis
- `src/theme/` - tokens de cor e estilo

## Observacao

A integracao com Supabase e roles sera conectada na proxima fase.
