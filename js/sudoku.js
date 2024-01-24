import { digHoles, generateGrid } from './sudoku-module.js';

const id = (sel) => { return document.getElementById(sel); };
const sudokuResult = (winRate) => { return `Rating: ${winRate}%<br><br>Not a lot of people finish everything they start. Well done.<br>You\'re awesome.` }

const startAction = id("start-action");
const solveAction = id("solve-action");
const levelAction = id("level-action");

var isStarted = false;
var selectedDigit = null;
var selectedTile = null;
var errorCount = 0;
var holes = Math.floor((Math.random() * 31) + 32);

var solution = generateGrid();
var board = digHoles(solution, holes);

window.addEventListener("DOMContentLoaded", () =>
{
    const dialog = document.createElement("div");
    dialog.id = "sudoku-dialog";
    id("sudoku-board").appendChild(dialog);
    dialog.innerHTML = "\"And the best way to start is to hit \'Start\'\"<br>~ Michael Scott";
    actionListeners();
});

const startTimerIfStarted = () => {
    id("sudoku-board").innerHTML = "";
    id("sudoku-complete").innerHTML = "";
    setSudoku();
    startSudoku();
    if (isStarted) startTimer();
    isStarted = !isStarted;
};

const setSudoku = () =>
{
    id("sudoku-timer").innerText = `${minutes}:${(seconds > 9 ) ? seconds : "0" + seconds}`;
    id("sudoku-moves").innerText = `F:${errorCount} T:${emptyTiles()}`;
    id("sudoku-board").innerText = "";

    startAction.removeEventListener("click", startTimerIfStarted);
    
    // Populating the digits with numbers from 1 to 9

    for (let i = 0; i < 9; i++)
    {
        const digit = document.createElement("div");
        digit.id = i + 1;
        digit.innerText = i + 1;
        digit.classList.add("digit");
        id("digits").appendChild(digit);
    }

    // Inflating the board with cells

    for (let i = 0; i < 9; i++)
    {
        for (let j = 0; j < 9; j++) {
            const tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", selectTile);
            if (board[i][j] != 0)
            {
                tile.innerText = board[i][j];
                tile.classList.add("start-tile");
            }

            if (i == 2 || i == 5) tile.classList.add("horizontal-line");
            if (j == 2 || j == 5) tile.classList.add("vertical-line");
            tile.classList.add("sudoku-tile");
            id("sudoku-board").appendChild(tile);
        }
    }
};

function startSudoku()
{
    let digits = document.getElementsByClassName("digit");
    for (let i = 0; i < digits.length; i++) {
        digits[i].addEventListener("click", selectDigit);
    }

    solveAction.removeAttribute("disabled");
    levelAction.setAttribute("disabled", true);
    isStarted = !isStarted;
    startAction.classList.add("started");
    clearInterval(timer);
    startAction.removeEventListener("click", startTimerIfStarted);
    id("sudoku-level-wrapper").style.display = "none";
};

let emptyTiles = () =>
{
    let count = 0;
    for (const row of board)
        for (const empty of row)
            if (empty === 0) count++;

    return count;
};

function selectDigit()
{
    if (selectedDigit != null)
        selectedDigit.classList.remove("selected")
    
    selectedDigit = this;
    selectedDigit.classList.add("selected");
};

const sudokuLevelPick = () =>
{
    levelAction.classList.add("started");
    id("sudoku-level-wrapper").style.display = "flex";
    let levels = document.getElementsByClassName("sudoku-level");
    for (let i = 0; i < levels.length; i++)
    {
        levels[i].addEventListener("click", (e) =>
        {
            if (e.currentTarget)
            {
                const activeLevel = e.currentTarget.className;
                if (activeLevel.slice(13) === "easy")
                    board = digHoles(solution, 45);
                
                else if (activeLevel.slice(13) === "fair")
                    board = digHoles(solution, 63);
                
                else {
                    const customTiles = prompt("Number of empty tiles: ");
                    board = digHoles(solution, customTiles);
                }
                count = emptyTiles()
                levelAction.classList.remove("started");
                id("active-level").innerHTML = `[ ${activeLevel.slice(13)} ]`;
                id("sudoku-level-wrapper").style.display = "none";
            }
        });
    }
};

let count = emptyTiles();
let totalEmpty = count;

function selectTile()
{
    if (selectedDigit)
    {
        if (this.innerText != "") return;
        
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == selectedDigit.id)
        {
            this.innerText = selectedDigit.id;
            this.classList.add("match");
            count--;    
        }
        else
        {
            errorCount++;
        }
        id("sudoku-moves").innerText = `F:${errorCount} T:${count}`;
    }

    if (count == 0)
    {
        solveAction.setAttribute("disabled", true);
        const winRate = 100 - Math.floor((100 * errorCount) / totalEmpty);
        id("sudoku-complete").innerHTML = sudokuResult(winRate);
        resetSudoku();
    }
};

let timer;

let seconds = 0;
let minutes = 0;

function startTimer() 
{

    timer = setInterval(() => 
    {
        seconds++;

        if (seconds == 60)
        {
            seconds = 0;
            minutes++;
        }

        id("sudoku-timer").innerText = `${minutes}:${(seconds > 9 ) ? seconds : "0" + seconds}`;
    
    }, 1000);
}

const solvePuzzle = () => 
{
    const _tile = document.getElementsByClassName("sudoku-tile");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            for (let k = 0; k < 9; k++) {
                _tile[i++].innerHTML = solution[j][k];
            }
        }
    }
    solveAction.setAttribute("disabled", true);
    resetSudoku();
}

const resetSudoku = () =>
{
    clearInterval(timer);

    holes = Math.floor((Math.random() * 31) + 32);
    solution = generateGrid();
    board = digHoles(solution, holes);

    count = emptyTiles();
    errorCount = seconds = minutes = 0;

    selectedDigit = selectedTile = null;

    id("digits").innerHTML = "";
    startAction.classList.remove("started");

    startAction.addEventListener("click", startTimerIfStarted);

    levelAction.removeAttribute("disabled");

    id("active-level").innerText = "";
};

const actionListeners = () =>
{
    startAction.addEventListener("click", startTimerIfStarted);
    levelAction.addEventListener("click", sudokuLevelPick);
    solveAction.addEventListener("click", solvePuzzle);
};