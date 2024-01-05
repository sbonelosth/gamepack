function qA(selecetor) { return document.querySelectorAll(selecetor); }
function q(selecetor) { return document.querySelector(selecetor); }

let choices = qA(".choice");
let score = q(".score");

let choiceList = ["rock", "paper", "scissor"];
var userScore = 0, botScore = 0;
const maxScore = 10;
var botChoice, userChoice;

function makeChoice(evt, choice) {
    for (i = 0; i < choices.length; i++)
        choices[i].classList.remove("green", "red", "grey");

    let bot = Math.floor(Math.random() * 3);
    var i, outcome;
    outcome = q(".outcome");

    if (choice === choiceList[bot]) {
        outcome.innerHTML = "It's a tie";
        botChoice = `${9994 + bot}`;
        userChoice = botChoice;
        evt.currentTarget.classList.add("grey");
    }
    else if (choice === "rock") {
        userChoice = 9994;
        if (choiceList[bot] === "paper") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9995;
            botScore++;
            evt.currentTarget.classList.add("red");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9996;
            userScore++;
            evt.currentTarget.classList.add("green");
        }
    }
    else if (choice === "paper") {
        userChoice = 9995;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9994;
            userScore++;
            evt.currentTarget.classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9996;
            botScore++;
            evt.currentTarget.classList.add("red");
        }
    }
    else if (choice === "scissor") {
        userChoice = 9996;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9994;
            botScore++;
            evt.currentTarget.classList.add("red");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9995;
            userScore++;
            evt.currentTarget.classList.add("green");
        }

    }
    score.innerHTML = `&#${botChoice} Bot [ ${botScore} ] : [ ${userScore} ] Me &#${userChoice}`;

    let loss = [128169, 129313, 128528, 128128, 129324, 127770];
    let win = [128526, 128520, 129393, 129398, 128226, 127942];
    let rand = Math.floor(Math.random() * 6);
    if (botScore == maxScore || userScore == maxScore) {
        outcome.innerHTML = (botScore > userScore) ? `Yikes, the bot wins &#${loss[rand]}` : `A win is a win &#${win[rand]}`;
        botScore = 0;
        userScore = 0;
    }
    
}

choices.forEach(choice => {
    choice.addEventListener("click", (event) => {
        makeChoice(event, choice.getAttribute("id"));
    })
});