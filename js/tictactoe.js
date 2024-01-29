import { findBestMove } from "./minimax.js";

const cross = Object.assign(new Image(), {
    src: "./res/cross.svg",
    id: "icon-cross",
    draggable: false
});

const circle = Object.assign(new Image(), {
    src: "./res/circle.svg",
    id: "icon-circle",
    draggable: false
});

const DELAY = 3000;

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


let grid = new Array(9).fill("");
let currentPlayer = "human";
let gameFrozen = false;
let gameMode = "human vs bot";
let gameModeQueue;

for (let index = 0; index < 9; index++)
{
    const cell = document.createElement("div");
    document.getElementById("tac-board").appendChild(cell);
    cell.appendChild(new Image());
    cell.id = cell.style.gridArea = `C${index}`;
    cell.className = "tac-cell";
    cell.addEventListener("mousedown", () =>
    {
        if (grid[index].length > 0 || gameFrozen) return;
        
        grid[index] = currentPlayer;
        currentPlayer = currentPlayer == "human" ? "bot" : "human";
        
        renderToDOM();

        if (gameMode == "human vs bot")
        {
            update();
            pickAIMove();
            renderToDOM();
        }
        update();
    });
}

function renderToDOM()
{
    for (let i = 0; i < 9; i++)
    {
        const cell = document.getElementById(`C${i}`);
        if (cell.childNodes[0])
            cell.removeChild(cell.childNodes[0]);
        
        if (grid[i] != "")
        {
            cell.appendChild({
                "human": cross,
                "bot": circle
            } [grid[i]].cloneNode(false));
        }
    }
}

function print(value) { document.getElementById("tac-result").innerHTML = value; }

function checkWin()
{
    for (let i = 0; i < 8; i++)
    {
        const rule = rules[i];
        if (!grid[rule[0]] == "" &&
            grid[rule[0]] == grid[rule[1]] &&
            grid[rule[1]] == grid[rule[2]]
        ) return {
            finished: true,
            winner: grid[rule[0]],
            winCase: rule,
            tie: false
        };
    }
    const tie = grid.every(cell => cell != "");
    return {
        finished: tie,
        winner: "tie",
        tie
    };
}

function reset()
{
    print("loading...");
    setTimeout(() =>
    {
        gameFrozen = false;
        grid = new Array(9).fill("");
        currentPlayer = "human";
        if (gameModeQueue)
        {
            gameMode = gameModeQueue;
            gameModeQueue = undefined;
        }
        renderToDOM();
        print(null);
    }, DELAY / 3);
}

function update()
{
    const gameState = checkWin();
    
    if (gameState.finished && !gameState.tie)
    {
        gameFrozen = true;
        if (gameState.winner === "human")
            print(`a win is a win<span class="result-emoji">&#128526</span>`);
        else
            print(`${gameState.winner} wins<span class="result-emoji">&#128169</span>`);

        for (let index = 0; index < 9; index++)
        {
            if (!gameState.winCase.includes(index))
            {
                let icon = document.getElementById(`C${index}`).childNodes[0];
                if (icon) icon.style.filter = "invert(1) brightness(.2)";
            }
        }
        setTimeout(reset, DELAY);
    }
    else if (gameState.tie)
    {
        gameFrozen = true;
        print("well, it\'s a tie");
        setTimeout(reset, DELAY);
    }
}

function pickAIMove()
{
    if (currentPlayer == "bot" && !gameFrozen)
    {
        gameFrozen = true;
        currentPlayer = "human";
        setTimeout(() =>
        {
            grid[findBestMove(grid)] = "bot";
            gameFrozen = false;
            renderToDOM();
            update();
        }, DELAY / 3);
    }
}

document.getElementById("tac-players").addEventListener("mousedown", () =>
{
    const newGameMode = gameMode == "human vs bot" ? "human vs human" : "human vs bot";
    gameModeQueue = newGameMode;
    document.getElementById("tac-players").textContent = newGameMode;
});

export { checkWin };