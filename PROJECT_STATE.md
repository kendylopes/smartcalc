# 🧮 Smart Calc — Estado Vivo do Projeto & Memória Contínua
> **Última atualização:** 27 de Agosto de 2026  
> **Status Geral:** 🟢 Em Produção / Otimizado / PWA Ready / Deploy Ativo  
> **Repositório:** `kendylopes/smartcalc` (`c:\Users\Kennedy\Desktop\dev\calc-app`)

---

## 📌 1. Visão Geral do Projeto
O **Smart Calc** é uma calculadora web inteligente e progressiva (PWA) de última geração com estética **Cristal Líquido (Clear Glass / Frosted Acrylic)**, desenvolvida para compras de supermercado, simulações financeiras, conversões e cálculos do dia a dia.

---

## 🛠️ 2. Stack Tecnológica & Dependências
* **Frontend:** React 19 (`react@^19.2.5`, `react-dom@^19.2.5`), TypeScript (`typescript@~6.0.2`), Vite 8 (`vite@^8.0.10`)
* **Estilização:** Tailwind CSS v4 (`@tailwindcss/vite@^4.2.4`, `tailwindcss@^4.2.4`)
* **Animações & Ícones:** Framer Motion (`framer-motion@^12.38.0`), Lucide React (`lucide-react@^1.14.0`)
* **PWA & Offline:** `vite-plugin-pwa@^1.3.0` + Workbox Engine (Service Worker com precache de 36 assets e runtime cache de Google Fonts)
* **Qualidade de Código:** Biome (`@biomejs/biome@^2.4.13`) para linting e formatação
* **Notificações:** Sonner (`sonner@^2.0.8`)

---

## 📁 3. Estrutura de Diretórios & Módulos (`src/features`)

```
src/
├── App.tsx                        # Componente raiz com Code Splitting (React.lazy + Suspense)
├── main.tsx                       # Ponto de entrada com registro do Service Worker
├── index.css                      # Design system, tokens de temas, glassmorphism e efeitos
├── features/
│   ├── calculator/                # Núcleo da calculadora
│   │   ├── components/            # Display, CalculatorButton, TopNavigation, QuickToolsPanel, etc.
│   │   │   ├── ThemePickerModal.tsx  # Galeria visual com mini-calculadoras interativas
│   │   ├── hooks/                 # useCalculator, useThemes, useSoundFeedback, useHaptic, useKeyboard
│   │   ├── logic/                 # evaluate.ts (motor de cálculo de expressões)
│   │   └── utils/                 # format.ts, voiceParser.ts
│   ├── finance/                   # Simuladores (Parcelamento Price, Juros Compostos)
│   ├── converter/                 # Conversor de Moedas (ao vivo + cache) e Unidades
│   ├── scanner/                   # Leitor de Código de Barras via Câmera com base EAN offline
│   ├── analytics/                 # Dashboard financeiro de compras, KPIs e gráficos
│   ├── i18n/                      # Suporte multi-idioma (PT-BR, EN-US, ES-ES)
│   ├── landing/                   # Seções institucionais (Features, Guia de Economia, Footer, Pix)
│   ├── legal/                     # Modal de Política de Privacidade e Termos (LGPD)
│   ├── monetization/              # Slots de anúncios/afiliados discretos
│   └── pwa/                       # Hooks de instalação PWA e Wake Lock (tela acesa)
```

---

## 🚀 4. Marcos Recentes & Otimizações Concluídas

1. **⚡ Otimização Crítica de Bundle (-76.8%):**
   - Implementado **Code Splitting com `React.lazy` e `Suspense`** em todos os mais de 15 modais.
   - Bundle principal reduzido de **643.66 kB** para **149.04 kB** (gzip: **38.95 kB**).
   - Configurado **Vendor Splitting** no `vite.config.ts` (`vendor-react`, `vendor-motion`, `vendor-icons`).
   - Zero avisos de chunks grandes no Vite.

2. **📱 PWA Offline Total com Workbox:**
   - Integrado `vite-plugin-pwa` com precache de 36 entradas e runtime caching de 1 ano para fontes do Google Fonts (`JetBrains Mono` e `Outfit`).
   - Registro automático em `main.tsx` com `autoUpdate`.

3. **💎 Refinamento Visual & Micro-interações de Frontend:**
   - **Reflexo Especular de Vidro (Sheen)** e micro-iluminação radial nos botões de cristal.
   - **Animações Fluidas de Entrada com Spring e Pulso Neon** no visor ao calcular resultados (`=`).
   - **Galeria Visual de Temas (`ThemePickerModal`)** com miniaturas interativas 3D dos 8 temas.
   - **Badges Flutuantes Neon de Atalhos (`[B]`, `[P]`, `[F]`, `[D]`, `[U]`, `[M]`)** no painel de ferramentas rápidas.

4. **✨ Suite de Usabilidade, Produtividade & Imersão Visual:**
   - **↩️ Sistema de Desfazer e Refazer (Undo / Redo):** Pilha com limite de 30 estados em [useCalculator.ts](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/hooks/useCalculator.ts), atalhos `Ctrl+Z`, `Ctrl+Y` e micro-botões táteis no visor [Display.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/components/Display.tsx).
   - **🔍 Busca Textual e Filtro de Tags no Histórico:** Barra de pesquisa em tempo real e chips com contagem e cálculo automático do subtotal dos itens filtrados em [HistoryPanel.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/components/HistoryPanel.tsx).
   - **✏️ Edição Direta de Itens do Histórico:** Modo inline em [HistoryPanel.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/components/HistoryPanel.tsx) permitindo alterar nome, preço unitário ou quantidade de qualquer item cadastrado sem refazer a conta.
   - **🖥️ Modo Foco Imersivo (Kiosk / Balcão):** Alternador no [TopNavigation.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/components/TopNavigation.tsx) e atalho `Alt+F` que oculta o portal institucional e foca 100% da tela na calculadora, ideal para uso em supermercados e tablets.
   - **🚨 Alertas Sensoriais & Visuais na Meta de Gastos:** Vibração tátil (`navigator.vibrate`) e pulso neon com badges de aviso quando a despesa atinge 80% ou estoura o orçamento em [BudgetBar.tsx](file:///c:/Users/Kennedy/Desktop/dev/calc-app/src/features/calculator/components/BudgetBar.tsx).

---

## 📋 5. Roadmap de Próximas Funcionalidades (Backlog Priorizado)

* [ ] **💼 Calculadora de Salário Líquido (CLT vs. PJ):**
  - Tabela progressiva de INSS e IRPF, descontos de benefícios e comparador lado a lado com PJ (Simples Nacional).
* [ ] **🏠 Simulador de Financiamento (Tabela SAC vs. Tabela Price):**
  - Simulação de parcelas decrescentes vs. fixas com amortização antecipada.
* [ ] **📑 Múltiplas Listas de Compras Nomeadas:**
  - Gerenciador de listas locais persistidas com checkboxes de itens concluídos no carrinho.
* [ ] **📸 Scanner OCR de Cupom Fiscal em Papel:**
  - Leitura de recibos impressos via câmera com reconhecimento de texto para auto-soma.
* [ ] **📄 Exportador de Relatório Financeiro em PDF:**
  - Download de recibos digitais diagramados em PDF profissional.

---

## 📍 6. Onde Paramos (Checkpoint Atual)
* **Última Ação:** Concluído o pacote completo de **Usabilidade & UX (Undo/Redo, Busca/Filtro e Edição de Itens no Histórico)** e **Visual & Imersão (Modo Foco Imersivo Alt+F e Alertas Dinâmicos no BudgetBar)**. Eliminadas todas as violações do Biome Linter em `Display.tsx`, `HistoryPanel.tsx`, `BudgetBar.tsx` e `format.ts` (0 erros e 0 warnings).
* **Próximo Passo Recomendado:** Iniciar a construção da **Calculadora de Salário Líquido (CLT vs. PJ)** ou **Simulador SAC vs. Price**.
