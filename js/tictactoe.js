import { findBestMove } from './minimax.js';

const cross = Object.assign(new Image(), {
  src: './res/cross.svg',
  id: 'icon-cross',
  draggable: false
});

const circle = Object.assign(new Image(), {
  src: './res/circle.svg',
  id: 'icon-circle',
  draggable: false
});

const gameDelay = 3000;

const rules = [
   [0, 1, 2],
   [3, 4, 5],
   [6, 7, 8],
   [0, 3, 6],
   [1, 4, 7],
   [2, 5, 8],
   [0, 4, 8],
   [2, 4, 6]
];


let grid = new Array(9).fill('');
let currentPlayer = 'Me';
let gameFrozen = false;
let gameMode = 'Me vs the Bot';
let gameModeQueue;
for (let index = 0; index < 9; index++) {
  const cell = document.createElement('div');
  document.getElementById('board').appendChild(cell);
  cell.appendChild(new Image());
  cell.id = cell.style.gridArea = `C${index}`;
  cell.className = 'cell';
  cell.addEventListener('mousedown', () => {
    if (grid[index].length > 0 || gameFrozen) return;
    grid[index] = currentPlayer;
    currentPlayer = currentPlayer == 'Me' ? 'Bot' : 'Me';
    renderToDOM();
    if (gameMode == 'Me vs the Bot') {
      update();
      pickAIMove();
      renderToDOM();
    }
    update();
  });
}

function renderToDOM() {
  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`C${i}`);
    if (cell.childNodes[0])
      cell.removeChild(cell.childNodes[0]);
    if (grid[i] != '')
      cell.appendChild({
        'Me': cross,
        'Bot': circle
      } [grid[i]].cloneNode(false));
  }
}

function print(value) {
  document.getElementById('output').innerHTML = value;
}

function checkWin() {
  for (let i = 0; i < 8; i++) {
    const rule = rules[i];
    if (!grid[rule[0]] == '' &&
      grid[rule[0]] == grid[rule[1]] &&
      grid[rule[1]] == grid[rule[2]]
    ) return {
      finished: true,
      winner: grid[rule[0]],
      winCase: rule,
      tie: false
    };
  }
  const tie = grid.every(cell => cell != '');
  return {
    finished: tie,
    winner: 'tie',
    tie
  };
}

function reset() {
  print('Loading...');
  setTimeout(() => {
    gameFrozen = false;
    grid = new Array(9).fill('');
    currentPlayer = 'Me';
    if (gameModeQueue) {
      gameMode = gameModeQueue;
      gameModeQueue = undefined;
    }
    renderToDOM();
    print(null);
  }, gameDelay / 3);
}

function update() {
  const gameState = checkWin();
  if (gameState.finished && !gameState.tie) {
    gameFrozen = true;
    (gameState.winner === 'Me') ?
    print(`A win is a win<span class="comm-2">&#128526</span>`):
    print(`The ${gameState.winner} wins<span class="comm-2">&#128169</span>`);

    for (let index = 0; index < 9; index++)
      if (!gameState.winCase.includes(index)) {
        let icon = document.getElementById(`C${index}`).childNodes[0];
        if (icon) icon.style.filter = 'invert(1) brightness(.2)';
      }
    setTimeout(reset, gameDelay);
  } else if (gameState.tie) {
    gameFrozen = true;
    print('Well, it\'s a tie!');
    setTimeout(reset, gameDelay);
  }
}

function pickAIMove() {
  if (currentPlayer == 'Bot' && !gameFrozen) {
    gameFrozen = true;
    currentPlayer = 'Me';
    setTimeout(() => {
      grid[findBestMove(grid)] = 'Bot';
      gameFrozen = false;
      renderToDOM();
      update();
    }, gameDelay / 3);
  }
}

document.getElementById('selector').addEventListener('mousedown', () => {
  const newGameMode = gameMode == 'Me vs the Bot' ? 'Me vs Human' : 'Me vs the Bot';
  gameModeQueue = newGameMode;
  document.getElementById('selector').textContent = newGameMode;
});

export { checkWin };