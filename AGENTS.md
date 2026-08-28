# 🤖 Diretrizes e Padrões para o Assistente IA — Smart Calc

Este arquivo define as regras operacionais, convenções de código e fluxo de trabalho obrigatórios para qualquer agente ou assistente trabalhando no repositório **Smart Calc**.

---

## 🎯 1. Idioma e Comunicação
* **Regra Fundamental:** Todas as respostas, explicações, planos de implementação e resumos devem ser entregues **estritamente em Português do Brasil (`pt-BR`)**.
* **Estilo:** Seja conciso, técnico, direto e prestativo. Links de arquivos devem sempre usar a sintaxe markdown `[NomeDoArquivo](file:///caminho/completo)`.

---

## 🧠 2. Protocolo de Continuidade & Memória
1. **Início da Sessão:**
   - Sempre consulte o arquivo [PROJECT_STATE.md](file:///c:/Users/Kennedy/Desktop/dev/calc-app/PROJECT_STATE.md) para restaurar o contexto completo do projeto, saber a última tarefa realizada e identificar os próximos passos no roadmap.
2. **Término da Sessão / Entrega de Funcionalidade:**
   - Atualize a seção *"Onde Paramos"* e o *"Roadmap"* no [PROJECT_STATE.md](file:///c:/Users/Kennedy/Desktop/dev/calc-app/PROJECT_STATE.md) com as novas mudanças realizadas.

---

## 🏗️ 3. Padrões de Arquitetura & Código
* **Stack Tecnológica:**
  - React 19 + TypeScript (tipagem estrita, evitar `any`).
  - Tailwind CSS v4 para estilos utilitários e variáveis CSS dinâmicas em `src/index.css`.
  - Framer Motion para animações e transições fluidas.
  - Biome para linting e formatação (`npm run format` e `npm run check`).
* **Regras de Performance & Code Splitting:**
  - **Modais e Seções Pesadas:** Sempre importar usando `lazy(() => import(...))` com `<Suspense fallback={null}>` no [src/App.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/App.tsx).
  - Manter o bundle crítico inicial sempre abaixo de **160 kB**.
  - Evitar re-exportar modais estaticamente em arquivos `index.ts` raiz de features para não quebrar o tree-shaking do Rollup/Vite.
* **Design System de Cristal Líquido (Clear Glass):**
  - Utilizar efeitos de vidro jateado com `backdrop-blur`, gradientes suaves e reflexos de luz especular (`sheen`).
  - Manter consistência com as paletas de cores definidas no hook `useThemes`.
* **Internacionalização (i18n):**
  - Toda nova string visível ao usuário deve ser cadastrada nos arquivos de tradução em `src/features/i18n/translations/` (`ptBR.ts`, `enUS.ts`, `esES.ts`).

---

## 🧪 4. Checklist de Validação Antes de Commits
Antes de propor ou fazer commits no Git:
1. `npm run build` — Deve compilar sem nenhum erro de TypeScript e sem avisos de chunks grandes.
2. `npm run format` — Formatar arquivos modificados com Biome.
3. `npm run check` — Garantir conformidade de linter.
