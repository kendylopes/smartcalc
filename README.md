# 🧮 Smart Calc — Calculadora Glassmorphism & Neon

<p align="center">
  <img src="public/logo.png" alt="Smart Calc Logo" width="140" height="140" style="border-radius: 28px; box-shadow: 0 12px 40px rgba(0,255,255,0.2);" />
</p>

<p align="center">
  <strong>Uma calculadora web de última geração, ultrarrápida, inteligente e com estética futurista Glassmorphism.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge" alt="PWA Ready" />
</p>

---

## ✨ Principais Recursos

- 💎 **Design Glassmorphism Ultralíquido**: Superfícies de vidro translúcidas com desfoque de fundo (*backdrop blur*), bordas com brilho reflexivo e iluminação dinâmica.
- 🎯 **Meta de Gastos & Limite de Orçamento no Histórico**:
  - Defina um teto de gastos para a compra com barra de progresso luminosa (Verde < 80%, Âmbar 80-99%, Vermelho >= 100% com indicador de valor excedido).
- ⚖️ **Comparador de Embalagens (Qual Compensa Mais por kg/Litro)**:
  - Compare duas opções em peso (g/kg), volume (ml/L) ou unidades. Identifica a vencedora com % de economia real e botão para transferir o valor direto para a calculadora (Atalho `P`).
- 🔆 **Manter Tela Sempre Acesa (*Screen Wake Lock*)**:
  - Evite que o celular desligue ou bloqueie enquanto você empurra o carrinho no supermercado.
- ⚡ **Multiplicador de Quantidade & Carrinho de Supermercado**:
  - Adicione produtos com nome e quantidade (ex: `🥛 Leite Integral: 3 un × R$ 4,50 = R$ 13,50`).
  - **Sugestões Rápidas de Mercado em 1-Toque**: `🥛 Leite`, `🍞 Pão`, `☕ Café`, `🍚 Arroz`, `🥩 Carne`, `🧀 Queijo`, `🧃 Suco`, `🥚 Ovos`, `🧼 Limpeza`, `🍎 Frutas`, `🍪 Biscoito`, `🍝 Macarrão`.
  - **Cupom de Compras para WhatsApp**: Exportação instantânea da lista formatada com emojis e valor total.
- 🧾 **Divisor de Contas & Gorjeta (Rachar Conta)**:
  - Divisão instantânea de contas de restaurantes, bares e compras coletivas entre 1 e 30 pessoas.
  - Cálculo automático de taxa de serviço (0%, 10%, 12%, 15% ou customizada).
  - Botão de **Copiar para o WhatsApp** com mensagem pronta e formatada.
- 💳 **Simulador Financeiro Completo**:
  - **Parcelamento (Tabela Price)**: Cálculo de valor de parcela fixa, total final pago e custo embutido de juros.
  - **Investimentos (Juros Compostos)**: Projeção de depósitos mensais, rendimento acumulado e evolução patrimonial.
- 📲 **Experiência Mobile Nativa**:
  - **Gesto *Swipe to Delete***: Deslize para a esquerda no visor para apagar o último caractere (idêntico ao iOS).
  - **Feedback Háptico (*Vibration*)**: Micro-vibração suave a cada toque no celular.
- 💱 **Conversor de Moedas & Unidades Integrado**:
  - **Moedas em Tempo Real**: Conversão com cotações ao vivo via API pública (USD, EUR, BRL, GBP, JPY, CAD, ARS, BTC, ETH) e suporte com cache offline.
  - **Unidades de Medida**: Comprimento (m, km, ft, in, etc.), Massa (kg, g, lb, oz), Temperatura (°C, °F, K), Dados Digitais (MB, GB, TB), Velocidade, Volume e Área.
  - **Transferência Instantânea**: Botão para transferir o resultado da conversão direto para o visor da calculadora.
- 🧠 **Motor Matemático Inteligente**:
  - Resolução respeitando a ordem correta de precedência (`*`, `/` antes de `+`, `-`).
  - Suporte a multiplicação implícita (ex: `2(3+4)` e `5π`).
  - Cálculo de porcentagem comercial no padrão brasileiro (ex: `100 + 10% = 110`).
  - Correção de precisão de ponto flutuante IEEE 754.
  - Live Preview com resultado em tempo real enquanto você digita.
- 🔊 **Feedback Sonoro Procedural**: Síntese de áudio leve via **Web Audio API** com sons distintos para números, operadores, resultados e limpeza (opção de silenciar com um clique).
- 🏷️ **Etiquetas & Anotações no Histórico**:
  - Adicione tags com 1 clique (🛒 Mercado, 🏠 Casa, 💼 Trabalho, 🍔 Comida, 💡 Contas) ou anotações personalizadas para organizar seus cálculos.
- 📊 **Exportação para Excel (.CSV) & Texto (.TXT)**:
  - Exporte todo o histórico formatado com colunas de Data, Hora, Etiqueta, Expressão e Resultado para abrir no Excel, Google Planilhas ou Numbers.
- 🗔 **Modo Compacto / Mini Widget**:
  - Alterne para uma visualização ultra compacta e focada, ideal para estudar ou trabalhar dividindo tela com PDFs e planilhas.
- 📲 **Instalação PWA em 1-Clique**:
  - Instalável nativamente no Android, iOS, Windows e macOS com suporte offline total e atalho de instalação direto no menu.

---

## ⌨️ Tabela de Atalhos de Teclado

| Tecla | Ação |
| :--- | :--- |
| `0` a `9` | Digitar números |
| `+`, `-`, `*`, `/` | Operações aritméticas (+, −, ×, ÷) |
| `x` ou `X` | Multiplicação rápida |
| `,` ou `.` | Vírgula / Ponto decimal |
| `%` | Porcentagem comercial |
| `Q` ou `q` | Abrir multiplicador de quantidade |
| `U` ou `u` | Abrir conversor de moedas & unidades |
| `S` ou `s` | Abrir divisor de contas (Rachar Conta) |
| `F` ou `f` | Abrir simulador financeiro |
| `(` e `)` | Parênteses matemáticos |
| `Enter` ou `=` | Calcular resultado |
| `Backspace` ou `Del` | Apagar último dígito |
| `Escape` ou `C` | Limpar visor |

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)**: Biblioteca para interfaces reativas com hooks modernos.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática estrita e máxima segurança de código.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização atômica moderna de alta performance com variáveis CSS customizadas.
- **[Framer Motion](https://www.framer.com/motion/)**: Animações e micro-interações fluidas com aceleração por GPU.
- **[Lucide React](https://lucide.dev/)**: Ícones vetoriais modernos e leves.
- **[Vite 8](https://vitejs.dev/)**: Bundler ultrarrápido com Hot Module Replacement (HMR) instantâneo.
- **[Biome JS](https://biomejs.dev/)**: Formatador e linter ultrarrápido.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- Gerenciador de pacotes **npm**, **pnpm** ou **yarn**

### Passo a Passo

1. **Clone o repositório ou acesse a pasta do projeto**:
   ```bash
   cd calc-app
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

4. **Executar verificação de tipos e compilação**:
   ```bash
   npm run build
   ```

---

## 📦 Como Fazer Deploy

A aplicação está 100% pronta para deploy estático com zero configuração adicional.

### Opção 1: Vercel (Recomendado)
1. Instale a CLI da Vercel (`npm i -g vercel`) ou conecte o repositório no dashboard da [Vercel](https://vercel.com).
2. Execute:
   ```bash
   vercel
   ```
3. O arquivo `vercel.json` incluído já configura automaticamente os cabeçalhos de segurança e cache otimizado.

### Opção 2: Netlify
1. Arraste a pasta `dist` gerada após `npm run build` para o painel da [Netlify](https://netlify.com) ou conecte via Git.
2. Comando de build: `npm run build`
3. Diretório de publicação: `dist`

### Opção 3: Cloudflare Pages
1. No dashboard da Cloudflare, selecione **Workers & Pages** > **Create application** > **Pages**.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Build output directory: `dist`

### Opção 4: GitHub Pages
1. No arquivo `vite.config.ts`, defina a propriedade `base: './'`.
2. Execute `npm run build` e faça deploy da pasta `dist` na branch `gh-pages`.

---

## 📁 Estrutura do Projeto

```
calc-app/
├── public/
│   ├── favicon.svg             # Ícone vetorial moderno da calculadora
│   └── manifest.json           # Manifesto PWA para instalação
├── src/
│   ├── features/
│   │   └── calculator/
│   │       ├── components/     # Componentes da calculadora (Display, Botões, Histórico, Modais)
│   │       ├── constants/      # Listas de botões, operadores e funções científicas
│   │       ├── hooks/          # Hooks customizados (useCalculator, useThemes, useSoundFeedback, useKeyboard)
│   │       ├── logic/          # Motor matemático puro (evaluate, tokenize, resolve)
│   │       ├── types/          # Definições de tipos TypeScript
│   │       └── utils/          # Utilitários de formatação pt-BR
│   ├── App.tsx                 # Container principal da aplicação
│   ├── index.css               # Estilos globais e Design System
│   └── main.tsx                # Ponto de entrada React
├── .github/
│   └── workflows/ci.yml        # CI/CD automatizado via GitHub Actions
├── biome.json                  # Configuração de formatação e linting
├── index.html                  # HTML5 com SEO e PWA tags
├── package.json                # Dependências e scripts do projeto
├── tsconfig.json               # Configurações do TypeScript
├── vercel.json                 # Configurações de deploy para Vercel
└── vite.config.ts              # Configuração do Vite com alias e chunking
```

---

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença [MIT](LICENSE).
