import { reshuffle } from './memory-module.js';

const id = (sel) => { return document.getElementById(sel); };
const qa = (sel) => { return document.querySelectorAll(sel); };

window.addEventListener("DOMContentLoaded", () =>
{
    widgets.startAction.setAttribute("disabled", true);
    widgets.levelAction.addEventListener("click", memoryLevelPick);
    widgets.result.innerText = "Pick a level then start flipping";
});

const resultText = () =>
{
    return `You did it 👏`;
};

const widgets = {
    board: id("memory-board"),
    moves: id("memory-moves"),
    timer: id("memory-timer"),
    startAction: id("memory-start-action"),
    levelAction: id("memory-level-action"),
    result: id("memory-result")
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    seconds: 0,
    loop: null
};

const createGame = (dimensions) =>
{
    if (dimensions % 2 !== 0) throw new Error("The dimension of the board must be an even number.");

    widgets.board.style.gridTemplateColumns = `repeat(${dimensions}, auto)`;

    const items = reshuffle(dimensions);

    for (let i = 0; i < items.length; i++)
    {
        const card = document.createElement("div");
        card.classList.add("card-holder");

        const cardFront = document.createElement("div");
        cardFront.classList.add("card-front");

        const cardBack = document.createElement("div");
        cardBack.classList.add("card-back");

        widgets.board.appendChild(card);
        card.appendChild(cardFront);
        card.appendChild(cardBack);
    }

    items.forEach((item, index) => {
        qa(".card-holder")[index].lastElementChild.innerText = `${item}`;
    });

    attachEventListeners();
};

function flipCardHandler(event) {
    const card = event.target.parentElement;
    flipCard(card);
    widgets.levelAction.setAttribute("disabled", true);
}

function startGameHandler()
{
    startGame();
    widgets.levelAction.setAttribute("disabled", true);
}

function attachEventListeners() {
    const cards = document.querySelectorAll(".card-holder");
    for (let card of cards) {
        card.addEventListener("click", flipCardHandler);
    }
    widgets.startAction.addEventListener("click", startGameHandler);
}


const startGame = () =>
{
    state.gameStarted = true;
    widgets.startAction.setAttribute("disabled", true);
    widgets.result.innerHTML = "";

    let minutes = 0;
    state.loop = setInterval(() =>
    {
        state.seconds++;

        if (state.seconds == 60)
        {
            minutes++;
            state.seconds = 0;
        }

        let formattedTime = `${minutes}:${(state.seconds < 10) ? "0" + state.seconds : state.seconds}`

        widgets.timer.innerText = `${formattedTime}`;
    }, 1000);
};

const flipCard = card =>
{
    if (!card.classList.contains("flipped") && !card.classList.contains("matched"))
    {
        state.flippedCards++;
        state.totalFlips++;

        widgets.moves.innerText = `${state.totalFlips} moves`;

        if (!state.gameStarted) startGame();

        if (state.flippedCards <= 2)
            card.classList.add("flipped");

        if (state.flippedCards === 2)
        {
            const flippedCards = document.querySelectorAll(".flipped:not(.matched)");

            if (flippedCards[0].innerText === flippedCards[1].innerText)
            {
                flippedCards[0].classList.add("matched");
                flippedCards[1].classList.add("matched");
            }

            setTimeout(() => { flipBackCards(); }, 1000);
        }

        if (!qa(".card-holder:not(.flipped)").length)
        {
            clearInterval(state.loop);

            qa(".card-holder").forEach(card => {
                card.style.animation = "gravity 2s ease-in forwards";
            });

            setTimeout(() =>
            {
                widgets.result.innerHTML = resultText();

                qa(".card-holder.matched").forEach(card => {
                    card.classList.remove("flipped");
                    card.classList.remove("matched");
                });

                widgets.board.innerHTML = "";
                widgets.startAction.setAttribute("disabled", true);
                widgets.levelAction.removeAttribute("disabled");

                widgets.levelAction.addEventListener("click", memoryLevelPick);

            }, 3000);
        }
    }
};


const flipBackCards = () =>
{
    qa(".card-holder:not(.matched)").forEach(card => {
        card.classList.remove("flipped");
    });
    state.flippedCards = 0;
};

const memoryLevelPick = () =>
{
    widgets.levelAction.classList.add("started");
    id("memory-level-wrapper").style.display = "flex";
    const levels = document.getElementsByClassName("memory-level");
    for (let i = 0; i < levels.length; i++)
    {
        levels[i].addEventListener("click", (e) =>
        {
            if (e.currentTarget)
            {
                resetGame();
                const activeLevel = e.currentTarget.className;
                if (activeLevel.slice(13) === "easy")
                    createGame(2);

                else if (activeLevel.slice(13) === "fair")
                    createGame(4);

                else createGame(6);

                widgets.levelAction.classList.remove("started");
                id("memory-active-level").innerHTML = `[ ${activeLevel.slice(13)} ]`;
                id("memory-level-wrapper").style.display = "none";
            }
        });
    }
};

const resetGame = () =>
{
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.seconds = 0;

    widgets.result.innerText = "";
    widgets.moves.innerText = `0 moves`;
    widgets.timer.innerText = `0:00`;
    widgets.board.innerHTML = "";

    widgets.startAction.removeAttribute("disabled");
    widgets.levelAction.removeAttribute("disabled");
}