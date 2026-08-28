# Smart Calc — Regras de Projeto

Sempre siga estas diretrizes ao desenvolver no Smart Calc:

1. **Idioma:** Respostas e mensagens sempre em Português do Brasil (`pt-BR`).
2. **Contexto & Memória:** Leia o `PROJECT_STATE.md` para restaurar o histórico e atualize-o após concluir novas funcionalidades.
3. **Padrão de Código:**
   - React 19 + TypeScript (Strict) + Tailwind CSS v4 + Biome.
   - Sempre aplique `React.lazy()` e `<Suspense>` em novos modais para preservar a performance do bundle (< 160 kB).
   - Registre novas strings no sistema de i18n (`src/features/i18n`).
4. **Design System:** Design translúcido de Cristal Líquido (Frosted Glass), animações suaves com Framer Motion e micro-interações táteis.
