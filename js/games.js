/* =========================================
   SK ARCADE — 15 GAMES (VANILLA JS)
   ========================================= */

(function() {
  'use strict';

  const gameModal = document.getElementById('gameModal');
  const gameBody = document.getElementById('gameModalBody');
  const gameTitle = document.getElementById('gameModalTitle');
  const closeGameModal = document.getElementById('closeGameModal');

  let activeCleanup = null;

  function openModal(title) {
    if (!gameModal) return;
    gameTitle.textContent = title;
    gameModal.classList.add('active');
  }
  function closeModal() {
    if (!gameModal) return;
    gameModal.classList.remove('active');
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
    gameBody.innerHTML = '';
  }
  if (closeGameModal) closeGameModal.addEventListener('click', closeModal);
  if (gameModal) gameModal.addEventListener('click', e => { if (e.target === gameModal) closeModal(); });

  document.querySelectorAll('.game-launcher').forEach(btn => {
    btn.addEventListener('click', () => {
      const game = btn.dataset.game;
      const fn = games[game];
      if (fn) {
        gameBody.innerHTML = '';
        openModal(btn.querySelector('h3').textContent);
        activeCleanup = fn(gameBody) || null;
      }
    });
  });

  /* ============================================
     GAME 1: SNAKE
     ============================================ */
  function snakeGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="snakeScore">0</span></span>
        <span class="game-help">Arrow keys / WASD</span>
      </div>
      <canvas id="snakeCanvas" width="400" height="400" class="game-canvas"></canvas>
      <div class="game-actions">
        <button class="btn-game" id="snakeStart">Start</button>
      </div>
      <p class="game-msg" id="snakeMsg"></p>
    `;
    const canvas = container.querySelector('#snakeCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = container.querySelector('#snakeScore');
    const startBtn = container.querySelector('#snakeStart');
    const msgEl = container.querySelector('#snakeMsg');
    const BOX = 20, GRID = 20;
    let snake = [], dir = 'RIGHT', nextDir = 'RIGHT', food = {x: 0, y: 0};
    let score = 0, loop = null, running = false;

    function placeFood() {
      let ok = false;
      while (!ok) {
        food = { x: Math.floor(Math.random() * GRID) * BOX, y: Math.floor(Math.random() * GRID) * BOX };
        ok = !snake.some(s => s.x === food.x && s.y === food.y);
      }
    }
    function draw() {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, 400, 400);
      ctx.strokeStyle = 'rgba(0,255,136,0.04)';
      for (let i = 0; i <= GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * BOX, 0); ctx.lineTo(i * BOX, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * BOX); ctx.lineTo(400, i * BOX); ctx.stroke();
      }
      ctx.fillStyle = '#ff4444';
      ctx.shadowColor = '#ff4444'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(food.x + BOX/2, food.y + BOX/2, BOX/2 - 2, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
      snake.forEach((s, i) => {
        ctx.fillStyle = i === 0 ? '#00ff88' : 'rgba(0,200,80,1)';
        ctx.shadowColor = i === 0 ? '#00ff88' : 'transparent';
        ctx.shadowBlur = i === 0 ? 10 : 0;
        ctx.fillRect(s.x + 1, s.y + 1, BOX - 2, BOX - 2);
      });
      ctx.shadowBlur = 0;
    }
    function init() {
      snake = [{x: 10*BOX, y: 10*BOX}, {x: 9*BOX, y: 10*BOX}, {x: 8*BOX, y: 10*BOX}];
      dir = 'RIGHT'; nextDir = 'RIGHT'; score = 0;
      scoreEl.textContent = 0;
      placeFood(); draw();
      msgEl.textContent = '';
    }
    function update() {
      dir = nextDir;
      let hx = snake[0].x, hy = snake[0].y;
      if (dir === 'LEFT') hx -= BOX;
      if (dir === 'RIGHT') hx += BOX;
      if (dir === 'UP') hy -= BOX;
      if (dir === 'DOWN') hy += BOX;
      if (hx < 0 || hx >= 400 || hy < 0 || hy >= 400 || snake.some(s => s.x === hx && s.y === hy)) {
        clearInterval(loop); loop = null; running = false;
        msgEl.textContent = `Game Over! Score: ${score}`;
        msgEl.className = 'game-msg error';
        return;
      }
      snake.unshift({x: hx, y: hy});
      if (hx === food.x && hy === food.y) { score++; scoreEl.textContent = score; placeFood(); }
      else snake.pop();
      draw();
    }
    function onKey(e) {
      if (!running) return;
      if ((e.key === 'ArrowLeft' || e.key === 'a') && dir !== 'RIGHT') nextDir = 'LEFT';
      if ((e.key === 'ArrowRight' || e.key === 'd') && dir !== 'LEFT') nextDir = 'RIGHT';
      if ((e.key === 'ArrowUp' || e.key === 'w') && dir !== 'DOWN') nextDir = 'UP';
      if ((e.key === 'ArrowDown' || e.key === 's') && dir !== 'UP') nextDir = 'DOWN';
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
    }
    startBtn.addEventListener('click', () => {
      if (running) return;
      init(); running = true;
      loop = setInterval(update, 110);
    });
    document.addEventListener('keydown', onKey);
    return () => { if (loop) clearInterval(loop); document.removeEventListener('keydown', onKey); };
  }

  /* ============================================
     GAME 2: MEMORY MATCH
     ============================================ */
  function memoryGame(container) {
    const emojis = ['🎮','🚀','🌟','🎨','🔥','💎','🎯','🧩'];
    const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    let flipped = [], matched = 0, moves = 0, lock = false;

    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Moves: <span id="memMoves">0</span></span>
        <span class="game-help">Match all pairs</span>
      </div>
      <div class="memory-grid" id="memGrid"></div>
      <p class="game-msg" id="memMsg"></p>
    `;
    const grid = container.querySelector('#memGrid');
    const movesEl = container.querySelector('#memMoves');
    const msgEl = container.querySelector('#memMsg');

    deck.forEach((emoji, i) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.emoji = emoji;
      card.dataset.index = i;
      card.innerHTML = `<div class="front"></div><div class="back">${emoji}</div>`;
      card.addEventListener('click', () => flip(card));
      grid.appendChild(card);
    });

    function flip(card) {
      if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
      card.classList.add('flipped');
      flipped.push(card);
      if (flipped.length === 2) {
        lock = true;
        moves++;
        movesEl.textContent = moves;
        if (flipped[0].dataset.emoji === flipped[1].dataset.emoji) {
          flipped.forEach(c => c.classList.add('matched'));
          matched++;
          flipped = []; lock = false;
          if (matched === emojis.length) {
            msgEl.textContent = `🎉 You won in ${moves} moves!`;
            msgEl.className = 'game-msg win';
          }
        } else {
          setTimeout(() => {
            flipped.forEach(c => c.classList.remove('flipped'));
            flipped = []; lock = false;
          }, 800);
        }
      }
    }
    return () => {};
  }

  /* ============================================
     GAME 3: TIC TAC TOE
     ============================================ */
  function tictactoeGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score" id="tttStatus">Your turn (X)</span>
        <span class="game-help">You = X · AI = O</span>
      </div>
      <div class="ttt-grid" id="tttGrid"></div>
      <div class="game-actions">
        <button class="btn-game btn-game-outline" id="tttReset">Reset</button>
      </div>
      <p class="game-msg" id="tttMsg"></p>
    `;
    const grid = container.querySelector('#tttGrid');
    const status = container.querySelector('#tttStatus');
    const msgEl = container.querySelector('#tttMsg');
    const resetBtn = container.querySelector('#tttReset');
    let board = Array(9).fill('');
    let playerTurn = true;
    let gameOver = false;

    function render() {
      grid.innerHTML = '';
      board.forEach((v, i) => {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell' + (v === 'X' ? ' x' : v === 'O' ? ' o' : '');
        cell.textContent = v;
        cell.addEventListener('click', () => play(i));
        grid.appendChild(cell);
      });
    }
    function play(i) {
      if (gameOver || !playerTurn || board[i]) return;
      board[i] = 'X';
      render();
      if (checkWin('X')) { status.textContent = 'You win!'; msgEl.textContent = '🎉 You won!'; msgEl.className = 'game-msg win'; gameOver = true; return; }
      if (board.every(c => c)) { status.textContent = 'Draw'; gameOver = true; return; }
      playerTurn = false;
      status.textContent = 'AI thinking...';
      setTimeout(aiMove, 400);
    }
    function aiMove() {
      if (gameOver) return;
      // Simple AI: win, block, center, corner, random
      let move = findWinning('O') ?? findWinning('X') ?? (board[4] === '' ? 4 : null) ?? [0,2,6,8].find(i => !board[i]) ?? board.findIndex(c => !c);
      if (move === undefined || move === null || move === -1) { playerTurn = true; return; }
      board[move] = 'O';
      render();
      if (checkWin('O')) { status.textContent = 'AI wins'; msgEl.textContent = '😢 AI won!'; msgEl.className = 'game-msg error'; gameOver = true; return; }
      if (board.every(c => c)) { status.textContent = 'Draw'; gameOver = true; return; }
      playerTurn = true;
      status.textContent = 'Your turn (X)';
    }
    function findWinning(p) {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      for (const [a,b,c] of lines) {
        const vals = [board[a], board[b], board[c]];
        const empty = [a,b,c].find(i => !board[i]);
        if (vals.filter(v => v === p).length === 2 && empty !== undefined) return empty;
      }
      return null;
    }
    function checkWin(p) {
      const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return lines.some(([a,b,c]) => board[a] === p && board[b] === p && board[c] === p);
    }
    function reset() {
      board = Array(9).fill('');
      playerTurn = true;
      gameOver = false;
      status.textContent = 'Your turn (X)';
      msgEl.textContent = '';
      render();
    }
    resetBtn.addEventListener('click', reset);
    render();
    return () => {};
  }

  /* ============================================
     GAME 4: 2048
     ============================================ */
  function game2048(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="score2048">0</span></span>
        <span class="game-help">Arrow keys to merge</span>
      </div>
      <div class="grid-2048" id="grid2048"></div>
      <div class="game-actions">
        <button class="btn-game btn-game-outline" id="reset2048">Reset</button>
      </div>
      <p class="game-msg" id="msg2048"></p>
    `;
    const gridEl = container.querySelector('#grid2048');
    const scoreEl = container.querySelector('#score2048');
    const msgEl = container.querySelector('#msg2048');
    const resetBtn = container.querySelector('#reset2048');
    let grid = [], score = 0, over = false;

    function init() {
      grid = Array(16).fill(0);
      score = 0; over = false;
      addTile(); addTile();
      render();
      msgEl.textContent = '';
    }
    function addTile() {
      const empty = grid.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
      if (empty.length === 0) return;
      const idx = empty[Math.floor(Math.random() * empty.length)];
      grid[idx] = Math.random() < 0.9 ? 2 : 4;
    }
    function render() {
      gridEl.innerHTML = '';
      grid.forEach(v => {
        const t = document.createElement('div');
        t.className = 'tile-2048';
        t.dataset.val = v;
        t.textContent = v || '';
        gridEl.appendChild(t);
      });
      scoreEl.textContent = score;
    }
    function move(dir) {
      if (over) return;
      const old = grid.join(',');
      const lines = [];
      for (let i = 0; i < 4; i++) {
        let line = [];
        for (let j = 0; j < 4; j++) {
          const idx = dir === 'left' ? i * 4 + j : dir === 'right' ? i * 4 + (3 - j) : dir === 'up' ? j * 4 + i : (3 - j) * 4 + i;
          line.push(grid[idx]);
        }
        const merged = merge(line);
        lines.push(merged);
      }
      // rebuild
      const newGrid = Array(16).fill(0);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const idx = dir === 'left' ? i * 4 + j : dir === 'right' ? i * 4 + (3 - j) : dir === 'up' ? j * 4 + i : (3 - j) * 4 + i;
          newGrid[idx] = lines[i][j];
        }
      }
      grid = newGrid;
      if (grid.join(',') !== old) {
        addTile();
        render();
        if (!canMove()) { over = true; msgEl.textContent = `Game Over! Score: ${score}`; msgEl.className = 'game-msg error'; }
      }
    }
    function merge(line) {
      let filtered = line.filter(v => v !== 0);
      const result = [];
      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          result.push(filtered[i] * 2);
          score += filtered[i] * 2;
          i++;
        } else result.push(filtered[i]);
      }
      while (result.length < 4) result.push(0);
      return result;
    }
    function canMove() {
      if (grid.includes(0)) return true;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const v = grid[i * 4 + j];
          if (j < 3 && grid[i * 4 + j + 1] === v) return true;
          if (i < 3 && grid[(i + 1) * 4 + j] === v) return true;
        }
      }
      return false;
    }
    function onKey(e) {
      let moved = false;
      if (e.key === 'ArrowLeft') { move('left'); moved = true; }
      if (e.key === 'ArrowRight') { move('right'); moved = true; }
      if (e.key === 'ArrowUp') { move('up'); moved = true; }
      if (e.key === 'ArrowDown') { move('down'); moved = true; }
      if (moved) e.preventDefault();
    }
    resetBtn.addEventListener('click', init);
    document.addEventListener('keydown', onKey);
    init();
    return () => { document.removeEventListener('keydown', onKey); };
  }

  /* ============================================
     GAME 5: SIMON SAYS
     ============================================ */
  function simonGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Round: <span id="simonRound">0</span></span>
        <span class="game-help">Watch then repeat</span>
      </div>
      <div class="simon-grid" id="simonGrid">
        <div class="simon-btn" data-color="green" style="color:#10b981"></div>
        <div class="simon-btn" data-color="red" style="color:#ef4444"></div>
        <div class="simon-btn" data-color="yellow" style="color:#f59e0b"></div>
        <div class="simon-btn" data-color="blue" style="color:#3b82f6"></div>
      </div>
      <div class="game-actions">
        <button class="btn-game" id="simonStart">Start</button>
      </div>
      <p class="game-msg" id="simonMsg"></p>
    `;
    const btns = container.querySelectorAll('.simon-btn');
    const roundEl = container.querySelector('#simonRound');
    const msgEl = container.querySelector('#simonMsg');
    const startBtn = container.querySelector('#simonStart');
    let sequence = [], userIdx = 0, accepting = false, round = 0;

    function flash(btn, dur = 400) {
      return new Promise(res => {
        btn.classList.add('active');
        setTimeout(() => { btn.classList.remove('active'); setTimeout(res, 150); }, dur);
      });
    }
    async function playSequence() {
      accepting = false;
      await new Promise(r => setTimeout(r, 500));
      for (const color of sequence) {
        const btn = container.querySelector(`[data-color="${color}"]`);
        await flash(btn);
      }
      accepting = true;
      userIdx = 0;
      msgEl.textContent = 'Your turn';
      msgEl.className = 'game-msg';
    }
    async function nextRound() {
      round++;
      roundEl.textContent = round;
      sequence.push(['green','red','yellow','blue'][Math.floor(Math.random() * 4)]);
      await playSequence();
    }
    btns.forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!accepting) return;
        const color = btn.dataset.color;
        await flash(btn, 200);
        if (color !== sequence[userIdx]) {
          msgEl.textContent = `Wrong! You reached round ${round}.`;
          msgEl.className = 'game-msg error';
          accepting = false;
          return;
        }
        userIdx++;
        if (userIdx === sequence.length) {
          accepting = false;
          msgEl.textContent = 'Correct! Next round...';
          msgEl.className = 'game-msg win';
          await new Promise(r => setTimeout(r, 700));
          nextRound();
        }
      });
    });
    startBtn.addEventListener('click', () => {
      sequence = []; round = 0; roundEl.textContent = 0;
      msgEl.textContent = 'Get ready...';
      nextRound();
    });
    return () => {};
  }

  /* ============================================
     GAME 6: WORD SCRAMBLE
     ============================================ */
  function scrambleGame(container) {
    const words = ['JAVASCRIPT','DEVELOPER','PORTFOLIO','REACT','INTERFACE','FUNCTION','VARIABLE','BROWSER','ANIMATION','RESPONSIVE'];
    let word = '', score = 0;

    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="scrScore">0</span></span>
        <span class="game-help">Unscramble the word</span>
      </div>
      <div class="scramble-word" id="scrWord"></div>
      <div class="scramble-input-row">
        <input class="scramble-input" id="scrInput" placeholder="Type your answer..." autocomplete="off">
        <button class="btn-game" id="scrSubmit">Check</button>
      </div>
      <p class="game-msg" id="scrMsg"></p>
      <div class="game-actions">
        <button class="btn-game btn-game-outline" id="scrSkip">Skip</button>
      </div>
    `;
    const wordEl = container.querySelector('#scrWord');
    const inputEl = container.querySelector('#scrInput');
    const msgEl = container.querySelector('#scrMsg');
    const scoreEl = container.querySelector('#scrScore');
    const submitBtn = container.querySelector('#scrSubmit');
    const skipBtn = container.querySelector('#scrSkip');

    function nextWord() {
      word = words[Math.floor(Math.random() * words.length)];
      const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
      wordEl.textContent = scrambled;
      inputEl.value = '';
      inputEl.focus();
      msgEl.textContent = '';
      msgEl.className = 'game-msg';
    }
    function check() {
      const ans = inputEl.value.trim().toUpperCase();
      if (ans === word) {
        score++; scoreEl.textContent = score;
        msgEl.textContent = '✅ Correct!';
        msgEl.className = 'game-msg win';
        setTimeout(nextWord, 800);
      } else {
        msgEl.textContent = '❌ Try again';
        msgEl.className = 'game-msg error';
      }
    }
    submitBtn.addEventListener('click', check);
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    skipBtn.addEventListener('click', nextWord);
    nextWord();
    return () => {};
  }

  /* ============================================
     GAME 7: MATH BLITZ
     ============================================ */
  function mathGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="mathScore">0</span></span>
        <span class="game-timer">Time: <span id="mathTime">30</span>s</span>
      </div>
      <div class="math-question" id="mathQ">Ready?</div>
      <div class="math-options" id="mathOpts"></div>
      <div class="game-actions">
        <button class="btn-game" id="mathStart">Start</button>
      </div>
      <p class="game-msg" id="mathMsg"></p>
    `;
    const qEl = container.querySelector('#mathQ');
    const optsEl = container.querySelector('#mathOpts');
    const scoreEl = container.querySelector('#mathScore');
    const timeEl = container.querySelector('#mathTime');
    const msgEl = container.querySelector('#mathMsg');
    const startBtn = container.querySelector('#mathStart');
    let score = 0, timeLeft = 30, timer = null, answer = 0, playing = false;

    function generate() {
      const ops = ['+', '-', '×'];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b;
      if (op === '×') { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; }
      else { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 40) + 5; }
      if (op === '-' && b > a) [a, b] = [b, a];
      answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
      qEl.textContent = `${a} ${op} ${b} = ?`;
      // options
      const options = new Set([answer]);
      while (options.size < 4) {
        const delta = Math.floor(Math.random() * 20) - 10;
        const wrong = answer + delta;
        if (wrong !== answer && wrong >= 0) options.add(wrong);
      }
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      shuffled.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'math-option';
        btn.textContent = v;
        btn.addEventListener('click', () => check(v, btn));
        optsEl.appendChild(btn);
      });
    }
    function check(v, btn) {
      if (!playing) return;
      if (v === answer) {
        score++; scoreEl.textContent = score;
        btn.classList.add('correct');
        setTimeout(generate, 300);
      } else {
        btn.classList.add('wrong');
        msgEl.textContent = 'Wrong!';
        msgEl.className = 'game-msg error';
      }
    }
    function start() {
      score = 0; scoreEl.textContent = 0;
      timeLeft = 30; timeEl.textContent = 30;
      playing = true;
      msgEl.textContent = '';
      generate();
      timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timer); timer = null;
          playing = false;
          msgEl.textContent = `Time's up! Final score: ${score}`;
          msgEl.className = 'game-msg win';
          qEl.textContent = 'Game Over';
          optsEl.innerHTML = '';
        }
      }, 1000);
    }
    startBtn.addEventListener('click', start);
    return () => { if (timer) clearInterval(timer); };
  }

  /* ============================================
     GAME 8: CARD SEQUENCE
     ============================================ */
  function cardsGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Round: <span id="cardsRound">0</span></span>
        <span class="game-help">Remember the order</span>
      </div>
      <div class="card-seq-row" id="cardsRow"></div>
      <div class="game-actions">
        <button class="btn-game" id="cardsStart">Start</button>
      </div>
      <p class="game-msg" id="cardsMsg"></p>
    `;
    const rowEl = container.querySelector('#cardsRow');
    const roundEl = container.querySelector('#cardsRound');
    const msgEl = container.querySelector('#cardsMsg');
    const startBtn = container.querySelector('#cardsStart');
    let sequence = [], userIdx = 0, round = 0, accepting = false;

    function shuffle(arr) { return arr.slice().sort(() => Math.random() - 0.5); }
    function render(showOrder) {
      const nums = showOrder ? sequence : shuffle(sequence);
      rowEl.innerHTML = '';
      nums.forEach(n => {
        const card = document.createElement('div');
        card.className = 'seq-card';
        card.textContent = n;
        card.addEventListener('click', () => click(n, card));
        rowEl.appendChild(card);
      });
    }
    async function showSequence() {
      accepting = false;
      msgEl.textContent = 'Watch...';
      rowEl.innerHTML = '';
      for (const n of sequence) {
        const card = document.createElement('div');
        card.className = 'seq-card selected';
        card.textContent = n;
        rowEl.innerHTML = '';
        rowEl.appendChild(card);
        await new Promise(r => setTimeout(r, 600));
      }
      msgEl.textContent = 'Now click in order!';
      msgEl.className = 'game-msg';
      render(false);
      accepting = true;
      userIdx = 0;
    }
    function click(n, card) {
      if (!accepting) return;
      if (n === sequence[userIdx]) {
        card.classList.add('correct');
        userIdx++;
        if (userIdx === sequence.length) {
          accepting = false;
          msgEl.textContent = 'Correct! Next round...';
          msgEl.className = 'game-msg win';
          setTimeout(nextRound, 800);
        }
      } else {
        msgEl.textContent = `Wrong! You reached round ${round}.`;
        msgEl.className = 'game-msg error';
        accepting = false;
      }
    }
    async function nextRound() {
      round++;
      roundEl.textContent = round;
      sequence = [];
      for (let i = 0; i < round + 2; i++) sequence.push(Math.floor(Math.random() * 9) + 1);
      await showSequence();
    }
    startBtn.addEventListener('click', () => { round = 0; nextRound(); });
    return () => {};
  }

  /* ============================================
     GAME 9: REACTION TEST
     ============================================ */
  function reactionGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Best: <span id="rxBest">-</span> ms</span>
        <span class="game-help">Click when green</span>
      </div>
      <div class="reaction-box idle" id="rxBox">Click to start</div>
      <p class="game-msg" id="rxMsg"></p>
    `;
    const box = container.querySelector('#rxBox');
    const bestEl = container.querySelector('#rxBest');
    const msgEl = container.querySelector('#rxMsg');
    let state = 'idle', startTime = 0, timeout = null;
    let best = parseInt(localStorage.getItem('rxBest') || '0');
    if (best) bestEl.textContent = best;

    function setState(s) { state = s; }
    box.addEventListener('click', () => {
      if (state === 'idle') {
        box.className = 'reaction-box waiting';
        box.textContent = 'Wait for green...';
        setState('waiting');
        const delay = Math.random() * 3000 + 1500;
        timeout = setTimeout(() => {
          box.className = 'reaction-box ready';
          box.textContent = 'CLICK NOW!';
          setState('ready');
          startTime = performance.now();
        }, delay);
      } else if (state === 'waiting') {
        clearTimeout(timeout);
        box.className = 'reaction-box idle';
        box.textContent = 'Too early! Click to retry';
        msgEl.textContent = '⚠️ You clicked too early';
        msgEl.className = 'game-msg error';
        setState('idle');
      } else if (state === 'ready') {
        const t = Math.round(performance.now() - startTime);
        msgEl.textContent = `⚡ ${t} ms`;
        msgEl.className = 'game-msg win';
        if (!best || t < best) {
          best = t;
          localStorage.setItem('rxBest', best);
          bestEl.textContent = best;
        }
        box.className = 'reaction-box idle';
        box.textContent = `Time: ${t}ms — Click to retry`;
        setState('idle');
      }
    });
    return () => { if (timeout) clearTimeout(timeout); };
  }

  /* ============================================
     GAME 10: CIPHER BREAKER
     ============================================ */
  function cipherGame(container) {
    const words = ['CODE','HACK','DEV','BYTE','LOOP','NULL','HERO','GAME','FAST','NODE'];
    let word = '', score = 0;

    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="ciphScore">0</span></span>
        <span class="game-help">Caesar cipher (+3)</span>
      </div>
      <div class="cipher-display" id="ciphText"></div>
      <div class="scramble-input-row">
        <input class="scramble-input" id="ciphInput" placeholder="Decode..." autocomplete="off">
        <button class="btn-game" id="ciphSubmit">Check</button>
      </div>
      <p class="game-msg" id="ciphMsg"></p>
    `;
    const textEl = container.querySelector('#ciphText');
    const inputEl = container.querySelector('#ciphInput');
    const msgEl = container.querySelector('#ciphMsg');
    const scoreEl = container.querySelector('#ciphScore');
    const submitBtn = container.querySelector('#ciphSubmit');

    function encode(s) {
      return s.split('').map(c => String.fromCharCode(((c.charCodeAt(0) - 65 + 3) % 26) + 65)).join('');
    }
    function next() {
      word = words[Math.floor(Math.random() * words.length)];
      textEl.textContent = encode(word);
      inputEl.value = '';
      inputEl.focus();
      msgEl.textContent = '';
      msgEl.className = 'game-msg';
    }
    function check() {
      if (inputEl.value.trim().toUpperCase() === word) {
        score++; scoreEl.textContent = score;
        msgEl.textContent = '🔓 Cracked!';
        msgEl.className = 'game-msg win';
        setTimeout(next, 800);
      } else {
        msgEl.textContent = '❌ Wrong';
        msgEl.className = 'game-msg error';
      }
    }
    submitBtn.addEventListener('click', check);
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
    next();
    return () => {};
  }

  /* ============================================
     GAME 11: COLOR MATCH
     ============================================ */
  function colorGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="colScore">0</span></span>
        <span class="game-help">Find the odd color</span>
      </div>
      <div class="color-grid" id="colGrid"></div>
      <p class="game-msg" id="colMsg"></p>
    `;
    const gridEl = container.querySelector('#colGrid');
    const scoreEl = container.querySelector('#colScore');
    const msgEl = container.querySelector('#colMsg');
    let score = 0, level = 1;

    function generate() {
      const size = Math.min(3 + Math.floor(level / 3), 6);
      gridEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
      const baseH = Math.floor(Math.random() * 360);
      const baseL = 50;
      const diff = Math.max(20 - level * 2, 5);
      const total = size * size;
      const odd = Math.floor(Math.random() * total);
      gridEl.innerHTML = '';
      for (let i = 0; i < total; i++) {
        const tile = document.createElement('div');
        tile.className = 'color-tile';
        const l = i === odd ? baseL + diff : baseL;
        tile.style.background = `hsl(${baseH}, 70%, ${l}%)`;
        tile.addEventListener('click', () => {
          if (i === odd) {
            score++; scoreEl.textContent = score;
            level++;
            msgEl.textContent = '✅ Correct!';
            msgEl.className = 'game-msg win';
            setTimeout(generate, 300);
          } else {
            msgEl.textContent = '❌ Wrong tile';
            msgEl.className = 'game-msg error';
          }
        });
        gridEl.appendChild(tile);
      }
    }
    generate();
    return () => {};
  }

  /* ============================================
     GAME 12: TYPING RUSH
     ============================================ */
  function typingGame(container) {
    const texts = [
      'The quick brown fox jumps over the lazy dog',
      'Clean code is not written by following a set of rules',
      'Every great developer you know got there by solving problems',
      'Simplicity is the soul of efficiency',
      'JavaScript is the duct tape of the internet'
    ];
    let text = '', idx = 0, startTime = 0, timer = null, started = false;

    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">WPM: <span id="typeWpm">0</span></span>
        <span class="game-timer">Time: <span id="typeTime">0</span>s</span>
      </div>
      <div class="typing-text" id="typeText"></div>
      <input class="typing-input" id="typeInput" placeholder="Start typing here..." autocomplete="off">
      <p class="game-msg" id="typeMsg"></p>
    `;
    const textEl = container.querySelector('#typeText');
    const inputEl = container.querySelector('#typeInput');
    const wpmEl = container.querySelector('#typeWpm');
    const timeEl = container.querySelector('#typeTime');
    const msgEl = container.querySelector('#typeMsg');

    function renderText() {
      textEl.innerHTML = '';
      text.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch;
        if (i < idx) span.className = 'correct';
        else if (i === idx) span.className = 'current';
        textEl.appendChild(span);
      });
    }
    function start() {
      text = texts[Math.floor(Math.random() * texts.length)];
      idx = 0;
      started = true;
      startTime = Date.now();
      inputEl.value = '';
      inputEl.disabled = false;
      inputEl.focus();
      msgEl.textContent = '';
      msgEl.className = 'game-msg';
      renderText();
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timeEl.textContent = elapsed;
        const words = idx / 5;
        const wpm = elapsed > 0 ? Math.round((words / elapsed) * 60) : 0;
        wpmEl.textContent = wpm;
      }, 200);
    }
    inputEl.addEventListener('input', () => {
      if (!started) return;
      const val = inputEl.value;
      if (val[idx] === text[idx]) {
        idx++;
        renderText();
        if (idx >= text.length) {
          clearInterval(timer);
          started = false;
          const elapsed = (Date.now() - startTime) / 1000;
          const wpm = Math.round((text.split(' ').length / elapsed) * 60);
          msgEl.textContent = `🎉 Done! ${wpm} WPM in ${elapsed.toFixed(1)}s`;
          msgEl.className = 'game-msg win';
        }
      } else {
        // wrong char - remove
        inputEl.value = val.slice(0, idx);
      }
    });
    inputEl.disabled = true;
    start();
    return () => { if (timer) clearInterval(timer); };
  }

  /* ============================================
     GAME 13: SEQUENCE FINDER
     ============================================ */
  function sequenceGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="seqScore">0</span></span>
        <span class="game-help">Find the next number</span>
      </div>
      <div class="seq-display" id="seqDisp"></div>
      <div class="math-options" id="seqOpts"></div>
      <p class="game-msg" id="seqMsg"></p>
    `;
    const dispEl = container.querySelector('#seqDisp');
    const optsEl = container.querySelector('#seqOpts');
    const scoreEl = container.querySelector('#seqScore');
    const msgEl = container.querySelector('#seqMsg');
    let score = 0;

    function generate() {
      const type = Math.floor(Math.random() * 4);
      let seq = [], answer = 0;
      if (type === 0) { // arithmetic
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < 5; i++) seq.push(start + i * step);
        answer = start + 5 * step;
      } else if (type === 1) { // geometric
        const start = Math.floor(Math.random() * 3) + 1;
        const mult = Math.floor(Math.random() * 2) + 2;
        let v = start;
        for (let i = 0; i < 5; i++) { seq.push(v); v *= mult; }
        answer = v;
      } else if (type === 2) { // squares
        const start = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < 5; i++) seq.push((start + i) ** 2);
        answer = (start + 5) ** 2;
      } else { // fibonacci-like
        let a = Math.floor(Math.random() * 3) + 1;
        let b = Math.floor(Math.random() * 3) + 1;
        seq = [a, b];
        for (let i = 0; i < 3; i++) { seq.push(a + b); [a, b] = [b, a + b]; }
        answer = a + b;
      }
      dispEl.innerHTML = '';
      seq.forEach(n => {
        const el = document.createElement('div');
        el.className = 'seq-num';
        el.textContent = n;
        dispEl.appendChild(el);
      });
      const q = document.createElement('div');
      q.className = 'seq-num unknown';
      q.textContent = '?';
      dispEl.appendChild(q);

      const options = new Set([answer]);
      while (options.size < 4) {
        const wrong = answer + Math.floor(Math.random() * 20) - 10;
        if (wrong !== answer && wrong > 0) options.add(wrong);
      }
      optsEl.innerHTML = '';
      [...options].sort(() => Math.random() - 0.5).forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'math-option';
        btn.textContent = v;
        btn.addEventListener('click', () => {
          if (v === answer) {
            score++; scoreEl.textContent = score;
            btn.classList.add('correct');
            msgEl.textContent = '✅ Correct!';
            msgEl.className = 'game-msg win';
            setTimeout(generate, 500);
          } else {
            btn.classList.add('wrong');
            msgEl.textContent = `❌ Wrong. Answer: ${answer}`;
            msgEl.className = 'game-msg error';
            setTimeout(generate, 1200);
          }
        });
        optsEl.appendChild(btn);
      });
    }
    generate();
    return () => {};
  }

  /* ============================================
     GAME 14: RHYTHM TAP
     ============================================ */
  function rhythmGame(container) {
    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Score: <span id="rhyScore">0</span></span>
        <span class="game-help">Tap the notes as they appear</span>
      </div>
      <div class="rhythm-track" id="rhyTrack"></div>
      <div class="rhythm-lanes" id="rhyLanes" style="display:flex;gap:8px;justify-content:center"></div>
      <div class="game-actions">
        <button class="btn-game" id="rhyStart">Start</button>
      </div>
      <p class="game-msg" id="rhyMsg"></p>
    `;
    const trackEl = container.querySelector('#rhyTrack');
    const lanesEl = container.querySelector('#rhyLanes');
    const scoreEl = container.querySelector('#rhyScore');
    const msgEl = container.querySelector('#rhyMsg');
    const startBtn = container.querySelector('#rhyStart');
    const LANES = 4;
    let score = 0, notes = [], loop = null, running = false;

    for (let i = 0; i < LANES; i++) {
      const lane = document.createElement('div');
      lane.className = 'rhythm-lane';
      lane.dataset.lane = i;
      lane.addEventListener('click', () => tap(i));
      lanesEl.appendChild(lane);
    }
    function tap(lane) {
      if (!running) return;
      const hit = notes.find(n => n.lane === lane && Math.abs(n.y - 100) < 30);
      if (hit) {
        hit.hit = true;
        score++;
        scoreEl.textContent = score;
        msgEl.textContent = '✅';
        msgEl.className = 'game-msg win';
      } else {
        msgEl.textContent = '❌ Miss';
        msgEl.className = 'game-msg error';
      }
    }
    function loopFn() {
      notes.forEach(n => n.y -= 4);
      notes = notes.filter(n => n.y > -20);
      if (Math.random() < 0.1) {
        notes.push({ lane: Math.floor(Math.random() * LANES), y: 100, hit: false });
      }
      trackEl.innerHTML = '';
      notes.forEach(n => {
        const el = document.createElement('div');
        el.className = 'rhythm-note' + (n.hit ? ' hit' : '');
        el.style.position = 'relative';
        el.style.height = '20px';
        el.style.width = `${100 / LANES}%`;
        const inner = document.createElement('div');
        inner.style.position = 'absolute';
        inner.style.left = '10px';
        inner.style.right = '10px';
        inner.style.bottom = Math.max(0, 100 - n.y) + 'px';
        inner.style.height = '20px';
        inner.style.background = n.hit ? '#10b981' : '#00ff88';
        inner.style.borderRadius = '4px';
        el.appendChild(inner);
        trackEl.appendChild(el);
      });
      if (notes.some(n => n.y < -10)) {
        // missed notes
      }
    }
    startBtn.addEventListener('click', () => {
      if (running) return;
      running = true; score = 0; scoreEl.textContent = 0;
      notes = [];
      trackEl.innerHTML = '';
      loop = setInterval(loopFn, 50);
    });
    return () => { if (loop) clearInterval(loop); running = false; };
  }

  /* ============================================
     GAME 15: LIGHTS OFF
     ============================================ */
  function lightsGame(container) {
    const SIZE = 5;
    let grid = [], moves = 0;

    container.innerHTML = `
      <div class="game-header-bar">
        <span class="game-score">Moves: <span id="lgtMoves">0</span></span>
        <span class="game-help">Turn all lights off</span>
      </div>
      <div class="lights-grid" id="lgtGrid"></div>
      <div class="game-actions">
        <button class="btn-game btn-game-outline" id="lgtReset">Reset</button>
      </div>
      <p class="game-msg" id="lgtMsg"></p>
    `;
    const gridEl = container.querySelector('#lgtGrid');
    const movesEl = container.querySelector('#lgtMoves');
    const msgEl = container.querySelector('#lgtMsg');
    const resetBtn = container.querySelector('#lgtReset');

    function init() {
      grid = Array(SIZE * SIZE).fill(0);
      // Start from solved (all off) and toggle random cells
      for (let k = 0; k < 6; k++) {
        const i = Math.floor(Math.random() * grid.length);
        toggle(i);
      }
      moves = 0; movesEl.textContent = 0;
      msgEl.textContent = '';
      render();
    }
    function toggle(i) {
      const r = Math.floor(i / SIZE), c = i % SIZE;
      [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => {
        if (rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE) {
          const idx = rr * SIZE + cc;
          grid[idx] = grid[idx] ? 0 : 1;
        }
      });
    }
    function render() {
      gridEl.innerHTML = '';
      grid.forEach((v, i) => {
        const cell = document.createElement('div');
        cell.className = 'lights-cell' + (v ? ' on' : '');
        cell.addEventListener('click', () => {
          toggle(i);
          moves++;
          movesEl.textContent = moves;
          render();
          checkWin();
        });
        gridEl.appendChild(cell);
      });
    }
    function checkWin() {
      if (grid.every(v => v === 0)) {
        msgEl.textContent = `🎉 Solved in ${moves} moves!`;
        msgEl.className = 'game-msg win';
      }
    }
    resetBtn.addEventListener('click', init);
    init();
    return () => {};
  }

  /* ============================================
     GAME REGISTRY
     ============================================ */
  const games = {
    snake: snakeGame,
    memory: memoryGame,
    tictactoe: tictactoeGame,
    '2048': game2048,
    simon: simonGame,
    scramble: scrambleGame,
    math: mathGame,
    cards: cardsGame,
    reaction: reactionGame,
    cipher: cipherGame,
    color: colorGame,
    typing: typingGame,
    sequence: sequenceGame,
    rhythm: rhythmGame,
    lights: lightsGame
  };

})();