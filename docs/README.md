# 🚀 SpaceInvadersGG

> Um clone moderno e expansivo do clássico Space Invaders, construído do zero com JavaScript Vanilla e Canvas API.

## 🎮 Sobre o Projeto

SpaceInvadersGG é uma reimaginação moderna do icônico arcade Space Invaders de 1978. O jogo foi desenvolvido inteiramente com **JavaScript Vanilla** e **Canvas API**, sem nenhuma biblioteca ou engine externa — apenas código puro.

O projeto nasceu como um exercício de desenvolvimento de jogos, explorando conceitos como game loop, detecção de colisão, gerenciamento de estado, sprites, partículas e sistemas de som.

---

## ✨ Funcionalidades

### Jogabilidade
- **3 tipos de invasores** com comportamentos distintos:
  - 👾 **Normal** — inimigo padrão, 10 pontos
  - ⚡ **Fast** — mais rápido e menor, 20 pontos (brilho ciano)
  - 🛡️ **Tank** — aguenta 2 tiros, 30 pontos (brilho vermelho)
- **Sistema de Boss** que aparece a cada 3 níveis, com 4 fases progressivas:
  - **BOSS** — ataque básico em 3 direções
  - **BOSS II** — adiciona chuva de tiros aleatórios
  - **BOSS III** — ganha barreira de escudo regenerável
  - **BOSS MAX** — tiros que eliminam o jogador instantaneamente
- **Obstáculos** que bloqueiam projéteis dos dois lados
- **Disparo controlado** (sem spam — o tiro só recarrega ao soltar o espaço)

### Visual & Efeitos
- **Parallax background** com estrelas em múltiplas camadas de velocidade
- **Sistema de partículas** para explosões coloridas por tipo de inimigo
- **Animação de motor** com spritesheet no player
- **Flash de hit** nos inimigos ao receberem dano
- **Barra de HP dinâmica** no Boss com cores que mudam conforme o dano
- **Rotação da nave** ao se mover para os lados
- **Efeito de glow/shadowBlur** em inimigos especiais e Boss

### Sistemas
- **3 vidas** com UI visual de corações
- **Pontuação e High Score** mantidos durante a sessão
- **Controle de nível** com aumento progressivo de dificuldade
- **Efeitos sonoros** para tiro, hit, explosão e passagem de nível
- **Telas de Start e Game Over** com botões de iniciar e reiniciar
- **Estado de jogo** gerenciado via máquina de estados (`GameState`)

---

## 🕹️ Como Jogar

| Tecla | Ação |
|-------|------|
| `A` | Mover para a esquerda |
| `D` | Mover para a direita |
| `Espaço` | Atirar |

> 💡 O tiro só pode ser disparado novamente após **soltar** o espaço — evite spam e mire com precisão!

**Objetivo:** elimine todas as ondas de invasores, sobreviva aos bosses e alcance o maior score possível com suas 3 vidas.

---

## 🏗️ Arquitetura do Projeto

```
SpaceInvadersGG/
└── docs/
    ├── index.html
    └── src/
        ├── index.js              # Game loop principal e lógica central
        ├── style.css             # Estilos das telas de UI
        ├── classes/
        │   ├── Player.js         # Nave do jogador com animação de motor
        │   ├── Invader.js        # Inimigos com tipos (normal, fast, tank)
        │   ├── Grid.js           # Formação e movimentação dos invasores
        │   ├── Boss.js           # Boss com 4 fases e comportamentos únicos
        │   ├── Projectile.js     # Projéteis do player e inimigos
        │   ├── Particle.js       # Sistema de partículas para explosões
        │   ├── Obstacle.js       # Blocos de proteção destrutíveis
        │   ├── Background.js     # Parallax de fundo estrelado
        │   ├── LivesUI.js        # Interface visual de vidas
        │   └── SoundEffects.js   # Gerenciamento de áudio via Web Audio API
        ├── utils/
        │   └── constanst.js      # Constantes globais e GameState enum
        └── assets/
            └── images/           # Sprites e imagens do jogo
```

### Padrões utilizados
- **Orientação a Objetos** — cada elemento do jogo é uma classe independente
- **Game Loop** com `requestAnimationFrame` para renderização eficiente
- **Máquina de Estados** (`START` → `PLAYING` → `GAME_OVER`)
- **Separação de responsabilidades** — lógica, renderização e input isolados

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| JavaScript ES6+ (Vanilla) | Toda a lógica do jogo |
| Canvas API (2D Context) | Renderização em tempo real |
| Web Audio API | Efeitos sonoros procedurais |
| ES Modules (`import/export`) | Organização modular do código |
| GitHub Pages | Deploy estático do jogo |

---

## 🚀 Como Rodar Localmente

Como o projeto usa ES Modules, é necessário servir os arquivos por um servidor HTTP (não funciona abrindo o `index.html` diretamente no navegador).

**Opção 1 — VS Code (recomendado):**
Instale a extensão **Live Server** e clique em "Go Live" na pasta `docs/`.

**Opção 2 — Python:**
```bash
cd docs
python -m http.server 8080
# Acesse: http://localhost:8080
```

**Opção 3 — Node.js:**
```bash
npx serve docs
```

---

## 📈 O que aprendi com este projeto

- Funcionamento de um **game loop** com `requestAnimationFrame`
- Renderização 2D com **Canvas API** (transformações, rotação, shadowBlur, sprites)
- Implementação de **detecção de colisão** AABB (Axis-Aligned Bounding Box)
- Criação de **sistemas de partículas** do zero
- Gerenciamento de **estado de jogo** com máquina de estados
- Uso de **ES Modules** para organização modular
- Manipulação de **eventos de teclado** e controle de input fluido
- Geração de **efeitos sonoros** com Web Audio API

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

Feito com 💜 e JavaScript puro

</div>
