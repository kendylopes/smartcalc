# 🧮 Smart Calc — Calculadora Inteligente, Cristal Líquido & Gestão Financeira

<p align="center">
  <img src="public/logo.png" alt="Smart Calc Logo" width="140" height="140" style="border-radius: 28px; box-shadow: 0 12px 40px rgba(0,255,255,0.2);" />
</p>

<p align="center">
  <strong>Calculadora web de última geração, ultrarrápida, com design translúcido de Cristal Líquido (Clear Glass), gestão financeira, compras inteligentes e suporte multi-idioma.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=for-the-badge" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/i18n-PT--BR%20|%20EN--US%20|%20ES--ES-blueviolet?style=for-the-badge" alt="Multi-Language" />
</p>

---

## ✨ Principais Recursos

### 💎 1. Design Cristal Líquido (Clear Glass / Frosted Acrylic)
- **Acabamento Translúcido**: Superfícies de vidro jateado com desfoque profundo (`backdrop-filter: blur(28px)`), refração suave de luz e zero poluição visual.
- **Teclas de Bloco de Cristal**: Botões de vidro polido com feedback tátil e iluminação interna ao toque.
- **Visor LCD Nítido**: Alto contraste para visualização sob qualquer iluminação.
- **8 Temas Premium de Cor**: *Neon Cyan, Emerald Mint, Violet Neon, Sunset Amber, Rose Quartz, Cyber Blue, OLED Titânio e Gold Luxury*, além de Modo Claro (*Pearl Crystal White*).

---

### 📊 2. Dashboard de Estatísticas & Gráficos de Gastos
- **Métricas em Tempo Real (KPIs)**: Total gasto acumulado, média por compra, contagem de produtos e maior despesa única.
- **Ranking dos Top Produtos**: Gráfico de barras com a porcentagem (%) de impacto de cada item no orçamento.
- **Exportação do Resumo**: Cópia instantânea do relatório financeiro formatado para WhatsApp ou anotações (Atalho: `G`).

---

### 🌐 3. Sistema Multi-Idioma & Moedas Internacionais (i18n)
- Suporte nativo a 3 idiomas e moedas com formatação automática de decimais e símbolos:
  - 🇧🇷 **Português (BR)**: Moeda `R$`, separador decimal vírgula.
  - 🇺🇸 **English (US)**: Moeda `$`, separador decimal ponto.
  - 🇪🇸 **Español (ES)**: Moeda `€`, separador decimal vírgula.
- Salva a preferência automaticamente no navegador (`localStorage`).

---

### 🛒 4. Modo Supermercado Inteligente & Multiplicador de Quantidade
- **Item & Quantidade (Atalho `Q`)**: Adicione produtos informando nome, quantidade e preço unitário com cálculo direto no visor (ex: `🥛 3x Leite Integral a R$ 4,50 = R$ 13,50`).
- **Sugestões de 1-Toque**: Botões rápidos para itens comuns (`🥛 Leite`, `🍞 Pão`, `☕ Café`, `🍚 Arroz`, `🥩 Carne`, etc.).
- **Reconhecimento de Voz ("Falar para Somar")**: Fale frases como *"Três leites a quatro e cinquenta"* ou *"Cinquenta mais vinte"* para adicionar direto no visor via microfone.
- **Cupom Fiscal Digital em Imagem (.PNG)**: Gere uma imagem profissional de recibo para salvar ou compartilhar na galeria.
- **Exportação para WhatsApp & Planilha Excel (.CSV)**: Exportação com 1 clique da lista de compras.

---

### ⚖️ 5. Comparador de Embalagens & Preços (kg / Litro)
- Compare duas opções em peso (g/kg), volume (ml/L) ou unidades (Atalho `P`).
- Identifica a embalagem mais econômica, calcula o percentual de economia e permite transferir o valor direto para a calculadora.

---

### ⛽ 6. Calculadora Flex (Etanol vs Gasolina)
- Análise de paridade de 70% entre combustíveis.
- Insira o preço do etanol e da gasolina e receba o veredito instantâneo de qual compensa mais abastecer, com economia estimada por tanque.

---

### 🏷️ 7. Calculadora de Descontos & Margem de Lucro (Markup)
- **Desconto % OFF**: Calcule o preço final, valor economizado e múltiplos descontos sucessivos.
- **Margem de Lucro & Markup**: Defina preço de custo e margem desejada para encontrar o preço de venda ideal e o lucro líquido.

---

### 🧾 8. Divisor de Contas & Gorjeta (Rachar a Conta)
- Divisão de contas de bares e restaurantes entre 1 e 30 pessoas (Atalho `S`).
- Cálculo automático de taxa de serviço (0%, 10%, 12%, 15% ou personalizada).
- Botão para copiar texto pronto com emojis e divisão individual para grupos de WhatsApp.

---

### 💳 9. Simulador Financeiro
- **Parcelamento (Tabela Price)**: Cálculo de parcelas fixas, total financiado e juros embutidos (Atalho `F`).
- **Investimentos (Juros Compostos)**: Projeção de aportes mensais, rendimento acumulado e evolução em 1, 2, 5, 10 e 20 anos.

---

### 💱 10. Conversor de Moedas & Unidades
- **Cotações de Moedas ao Vivo**: USD, EUR, BRL, GBP, JPY, CAD, ARS, BTC, ETH com cache offline.
- **Unidades de Medida**: Comprimento, Massa, Temperatura, Dados Digitais, Velocidade, Volume e Área (Atalho `U`).

---

### 📱 11. Recursos Mobile & PWA
- **Gesto *Swipe to Delete***: Deslize para a esquerda no visor para apagar o último dígito.
- **Feedback Háptico (*Vibration*)**: Vibração sutil a cada clique no celular.
- **Tela Sempre Acesa (*Screen Wake Lock*)**: Impede que a tela do celular bloqueie no supermercado.
- **Instalável como PWA**: Funciona 100% offline no Android, iOS, Windows e Mac.
- **Backup & Restauração JSON**: Salve e restaure seu histórico completo em arquivo seguro.

---

## ⌨️ Tabela de Atalhos de Teclado

| Tecla | Ação |
| :--- | :--- |
| `0` a `9` | Digitar números |
| `+`, `-`, `*`, `/` | Operações aritméticas (+, −, ×, ÷) |
| `x` ou `X` | Multiplicação rápida |
| `,` ou `.` | Vírgula / Ponto decimal |
| `%` | Porcentagem comercial |
| `Enter` ou `=` | Calcular resultado |
| `Backspace` ou `Del` | Apagar último dígito |
| `Escape` ou `C` | Limpar visor |
| `Q` ou `q` | Abrir multiplicador de quantidade / mercado |
| `G` ou `g` | Abrir Dashboard de Estatísticas & Gráficos |
| `P` ou `p` | Abrir comparador de embalagens (kg/L) |
| `U` ou `u` | Abrir conversor de moedas & unidades |
| `S` ou `s` | Abrir divisor de contas (Rachar Conta) |
| `F` ou `f` | Abrir simulador financeiro |
| `H` ou `h` | Abrir Central de Ajuda & Guia de Uso |
| `F11` | Alternar Modo Tela Cheia |

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/)**: Framework moderno com hooks de alta performance.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estática rigorosa e segurança de código.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: Estilização ultrarrápida com tokens e variáveis customizadas.
- **[Framer Motion](https://www.framer.com/motion/)**: Animações suaves e elásticas aceleradas por hardware.
- **[Lucide React](https://lucide.dev/)**: Pacote completo de ícones modernos.
- **[Vite 8](https://vitejs.dev/)**: Ferramenta de build de nova geração com HMR instantâneo.
- **[Web Audio API](https://developer.mozilla.org/pt-BR/docs/Web/API/Web_Audio_API)**: Síntese de áudio procedural sem dependência de arquivos externos.
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**: Reconhecimento de voz em tempo real no navegador.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (versão 18+)
- **npm**, **pnpm** ou **yarn**

### Comandos:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor local
npm run dev

# 3. Validar tipagem e build de produção
npm run build
```

---

## 📦 Deploy em Produção (Vercel)

A aplicação está configurada para deploy automático na **Vercel** via integração com GitHub (`main` branch):
- `vercel.json`: Cabeçalhos de segurança (CSP, X-Content-Type, X-Frame-Options) e cache de longa duração para assets estáticos.
- `public/_redirects`: Roteamento SPA garantido para todas as URLs.

---

## 📄 Licença

Este projeto é de código aberto sob a licença [MIT](LICENSE).
