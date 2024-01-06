import { checkWin } from './tictactoe.js';

let diff = document.getElementById("diff-btn");
let diffLabel = document.getElementById("diff-label");
let labels = [ "Playing as a beginner", "Playing as a pro" ];
let level = true;
const defaultPath = "./res/pro.png";

diff.addEventListener("click", () => {
  level = !level;
  diff.src = level ? defaultPath : "./res/beginner.png";
  diffLabel.innerText = level ? labels[0] : labels[1];
});

const minimax = (grid, maximizingPlayer) => {
  const gameState = checkWin(grid);
  if (gameState.finished)
    return {
      'Me': -1,
      'Bot': 1,
      'tie': 0
    } [gameState.winner];

  if (maximizingPlayer) {
    let value = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] != '') continue;
      grid[i] = 'Bot';
      const max = Math.max(minimax(grid, level), value); // false
      value = max;
      grid[i] = '';
    }
    return value;
  } else {
    let value = Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] != '') continue;
      grid[i] = 'Me';
      const min = Math.min(minimax(grid, true), value); // true
      value = min;
      grid[i] = '';
    }
    return value;
  }
};

const findBestMove = grid => {
  let bestScore = -Infinity,
    bestMove;
  for (let i = 0; i < 9; i++) {
    if (grid[i] != '') continue;
    grid[i] = 'Bot';
    const score = minimax(grid, false);
    grid[i] = '';
    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }
  return bestMove;
};

export { findBestMove };