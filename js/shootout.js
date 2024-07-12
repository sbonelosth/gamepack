const id = (sel) => { return document.getElementById(sel); };

const scoreDisplay = id("shootout-score");
const goalStatus = id("goal-status");
const goalPost = id("goal-post");
const ballDirections = document.querySelectorAll(".ball-direction");
const football = id("football");
const keeper = id("keeper-direction");
const startButton = id("start-shootout");
const userProgress = id("user-progress");
const botProgress = id("bot-progress");
const hint = id("shootout-hint");
const shooterTurn = id("shooter-turn");

let MAX_TURNS = 5;
const DIRECTIONS = ["left", "middle", "right"];
const DELAY = 1000;
let userScore = 0;
let botScore = 0;
let userTurn = 0;
let botTurn = 0;
let isUserShooter = true;
let isGameStarted = false;

const userIcon = '../res/user.svg';
const botIcon = '../res/bot.svg';

const span = (elem) => { return `<span>${elem}</span>`; };
// a function to update the score display
function updateScore() {
    scoreDisplay.textContent = `${userScore} : ${botScore}`;
}

// a function to update the goal status
function updateGoalStatus(message) {
    goalStatus.innerHTML = message;
}

// a function to reset the ball directions
function resetBallDirections() {
    for (let direction of ballDirections) direction.classList.remove("selected-direction");
}

// a function to get a random direction
function getRandomDirection() {
    let index = Math.floor(Math.random() * DIRECTIONS.length);
    return DIRECTIONS[index];
}

// a function to handle the start button click
function startGame() {
    // reset the shootout state
    userScore = 0;
    botScore = 0;
    userTurn = botTurn = 0;
    isUserShooter = true;
    isGameStarted = true;
    botProgress.innerText = userProgress.innerText = "";
    shooterTurn.style.backgroundImage = `url(${userIcon})`;

    updateScore();
    updateGoalStatus("Click on the goal post to shoot!");

    // enabling the ball directions
    for (let direction of ballDirections) direction.addEventListener("click", handleBallDirectionClick);

    startButton.disabled = true;
}

// a function to handle the ball direction click
function handleBallDirectionClick(event) {
    // getting the clicked direction div
    let clickedDirection = event.target;
    clickedDirection.classList.add("selected-direction");

    // disabling the ball directions
    for (let direction of ballDirections) direction.removeEventListener("click", handleBallDirectionClick);

    // getting the shooter's and the keeper's choices
    let shooterChoice, keeperChoice;

    if (isUserShooter) {
        shooterChoice = clickedDirection.id;
        keeperChoice = getRandomDirection();
    }
    else {
        shooterChoice = getRandomDirection();
        keeperChoice = clickedDirection.id;
    }

    animateFootball(shooterChoice, keeperChoice);
}

// a function to animate the football
function animateFootball(shooterChoice, keeperChoice) {
    // setting the football's position to the shooter's choice
    football.classList.add(shooterChoice);
    keeper.classList.add(keeperChoice);

    // timeout to move the football to chosen position
    setTimeout(function () {
        if (shooterChoice === "middle") {
            keeper.classList.remove(keeperChoice);
            football.classList.remove(shooterChoice);
            football.classList.add("middle");
        }
        else if (shooterChoice === "left") {
            keeper.classList.remove(keeperChoice);
            football.classList.remove(shooterChoice);
            football.classList.add("left");
        }
        else {
            keeper.classList.remove(keeperChoice);
            football.classList.remove(shooterChoice);
            football.classList.add("right");
        }

        // another timeout to check the result
        setTimeout(function () {
            // checking if it's a goal or a save
            if (shooterChoice === keeperChoice) {
                if (isUserShooter) {
                    updateGoalStatus("what a save from the bot..!");
                    userProgress.innerHTML += span("❌");
                }
                else {
                    updateGoalStatus("you saved it..!");
                    botProgress.innerHTML += span("❌");
                }
            }
            else {
                // updating the score
                if (isUserShooter) {
                    updateGoalStatus("it's in..!");
                    userProgress.innerHTML += span("⚽");
                    userScore++;
                }
                else {
                    updateGoalStatus("the bot scores..!");
                    botProgress.innerHTML += span("⚽");
                    botScore++;
                }
                updateScore();
            }

            // reset the football's position
            football.classList.remove(shooterChoice);

            if (isUserShooter) {
                shooterTurn.style.backgroundImage = `url(${botIcon})`;
                userTurn++;
            }
            else {
                shooterTurn.style.backgroundImage = `url(${userIcon})`;
                botTurn++;
            }

            resetBallDirections();

            // switching the roles
            isUserShooter = !isUserShooter;

            checkGameOver();

        }, DELAY);
    }, DELAY);
}

// a function to check if the game is over
function checkGameOver() {
    if (userScore > MAX_TURNS - botTurn + botScore || botScore > MAX_TURNS - userTurn + userScore) {

        isGameStarted = false;

        let winner = (userScore > botScore) ? "you've done it<br>you" : "the bot &#128126";

        updateGoalStatus(`${winner} won the shootout 🏆🥇`);

        hint.innerText = "";
        startButton.disabled = false;
    }
    else {
        if (userTurn === MAX_TURNS && botTurn === MAX_TURNS && userScore === botScore) MAX_TURNS += 1;

        if (isUserShooter) hint.innerText = "let\'s see if you can put this one in..";
        else hint.innerText = "now, can you save this?";

        for (let direction of ballDirections) direction.addEventListener("click", handleBallDirectionClick);

    }
}

// adding an event listener to the start button
startButton.addEventListener("click", startGame);