import { reshuffle, mapValue } from './memory-module.js';

const id = (sel) => { return document.getElementById(sel); };
const qa = (sel) => { return document.querySelectorAll(sel); };

window.addEventListener("DOMContentLoaded", () => {
    widgets.startAction.setAttribute("disabled", true);
    widgets.levelAction.addEventListener("click", memoryLevelPick);
    widgets.result.innerText = "Pick a level then start flipping";
});

const resultText = (totalFlips, dimensions) => {
    let totalCards = dimensions * dimensions;
    let rating = (mapValue(totalFlips, totalCards, 4 * totalCards, 100, -100)).toFixed(0);

    if (dimensions >= 4 && rating >= 75)
        return `Rating: ${rating}%<br><br>You're incredible. Well done.`;
    else if (dimensions === 2 && rating >= 90)
        return `Rating: ${rating}%<br><br>You did it. Well done.`;
    else
        return `Rating: ${rating}%<br><br>Keep trying`;
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
    dimensions: 0,
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    seconds: 0,
    loop: null
};

function createGame(dimensions) {
    if (dimensions % 2 !== 0) throw new Error("The dimension of the board must be an even number.");

    widgets.board.style.gridTemplateColumns = `repeat(${dimensions}, auto)`;

    const items = reshuffle(dimensions);

    for (let i = 0; i < items.length; i++) {
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

function startGameHandler() {
    startGame();
    widgets.levelAction.setAttribute("disabled", true);
}

function attachEventListeners() {
    qa(".card-holder").forEach(card => {
        card.addEventListener("click", flipCardHandler);
    });

    widgets.startAction.addEventListener("click", startGameHandler);
}

function detachCardListeners() {
    qa(".card-holder").forEach(card => {
        card.removeEventListener("click", flipCardHandler);
    });
}


function startGame() {
    state.gameStarted = true;
    widgets.startAction.setAttribute("disabled", true);
    widgets.result.innerHTML = "";

    let minutes = 0;
    state.loop = setInterval(() => {
        state.seconds++;

        if (state.seconds == 60) {
            minutes++;
            state.seconds = 0;
        }

        let formattedTime = `${minutes}:${(state.seconds < 10) ? "0" + state.seconds : state.seconds}`

        widgets.timer.innerText = `${formattedTime}`;
    }, 1000);
}

function flipCard(card) {
    if (!card.classList.contains("flipped") && !card.classList.contains("matched")) {
        state.flippedCards++;
        state.totalFlips++;

        widgets.moves.innerText = `${state.totalFlips} moves`;

        if (!state.gameStarted) startGame();

        if (state.flippedCards <= 2)
            card.classList.add("flipped");

        if (state.flippedCards === 2) {
            const flippedCards = qa(".flipped:not(.matched)");

            if (flippedCards[0].innerText === flippedCards[1].innerText) {
                flippedCards[0].classList.add("matched");
                flippedCards[1].classList.add("matched");
                detachCardListeners();
            }

            setTimeout(() => {
                flipBackCards();
                attachEventListeners();
            }, 1000);
        }

        if (!qa(".card-holder:not(.flipped)").length) {
            clearInterval(state.loop);

            setTimeout(() => {
                qa(".card-holder").forEach(card => {
                    card.style.animation = "gravity 1s ease-in forwards";
                });
            }, 2000);

            setTimeout(() => {
                widgets.result.innerHTML = resultText(state.totalFlips, state.dimensions);

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
}


function flipBackCards() {
    qa(".card-holder:not(.matched)").forEach(card => {
        card.classList.remove("flipped");
    });

    detachCardListeners();

    state.flippedCards = 0;
}

function memoryLevelPick() {
    widgets.levelAction.classList.add("started");
    id("memory-level-wrapper").style.display = "flex";
    const levels = document.getElementsByClassName("memory-level");
    for (let i = 0; i < levels.length; i++) {
        levels[i].addEventListener("click", (e) => {
            if (e.currentTarget) {
                resetGame();
                let DELAY;
                const activeLevel = e.currentTarget.className;
                if (activeLevel.slice(13) === "easy") {
                    state.dimensions = 2;
                    createGame(2);
                    DELAY = 0;
                }
                else if (activeLevel.slice(13) === "fair") {
                    state.dimensions = 4;
                    createGame(4);
                    DELAY = 1200;
                }
                else {
                    state.dimensions = 6;
                    createGame(6);
                    DELAY = 2000;
                }

                qa(".card-holder").forEach(card => {
                    card.classList.add("flipped");
                });

                setTimeout(() => {
                    qa(".card-holder").forEach(card => {
                        card.classList.remove("flipped");
                    });
                }, DELAY);

                widgets.levelAction.classList.remove("started");
                id("memory-active-level").innerHTML = `[ ${activeLevel.slice(13)} ]`;
                id("memory-level-wrapper").style.display = "none";
            }
        });
    }
}

function resetGame() {
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