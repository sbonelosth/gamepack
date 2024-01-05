import { checkWin } from './tictactoe.js';

const minimax = (grid, maximizingPlayer) => {
  const gameState = checkWin(grid);
  if (gameState.finished)
    return {
      'X': -1,
      'O': 1,
      'tie': 0
    } [gameState.winner];

  if (maximizingPlayer) {
    let value = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] != '') continue;
      grid[i] = 'O';
      const max = Math.max(minimax(grid, true), value); // false
      value = max;
      grid[i] = '';
    }
    return value;
  } else {
    let value = Infinity;
    for (let i = 0; i < 9; i++) {
      if (grid[i] != '') continue;
      grid[i] = 'X';
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
    grid[i] = 'O';
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