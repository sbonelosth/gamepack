const qa = sel => { return document.querySelectorAll(sel); };
const q = sel => { return document.querySelector(sel); };
const id = sel => { return document.getElementById(sel); };

let choices = qa(".choice");
let botChoices = qa(".bot-choice");
let score = q(".rps-score");
let capScore = q("#cap");

let choiceList = ["rock", "paper", "scissor"];
let userScore = 0, botScore = 0;
let resetRounds = q(".reset-rounds");
let input = null;

resetRounds.addEventListener("click", () => {
    input = prompt("New target score:");
    capScore.textContent = input;
});

let choiceListIcons = ['../res/rock.svg', '../res/paper.svg', '../res/scissor.svg'];
let botChoice, userChoice;

function makeChoice(e, choice) {
    let maxScore = (input === null || input === "") ? 3 : parseInt(input);

    for (i = 0; i < choices.length; i++)
        choices[i].classList.remove("green", "red", "grey");

    for (i = 0; i < botChoices.length; i++)
        botChoices[i].classList.remove("green", "red", "grey");

    let bot = Math.floor(Math.random() * 3);
    var i, outcome;
    outcome = q(".rps-outcome");

    if (choice === choiceList[bot]) {
        outcome.innerHTML = "It's a tie";
        botChoice = choiceListIcons[bot];
        userChoice = botChoice;
        e.currentTarget.classList.add("grey");
        q("#bot-" + choice).classList.add("grey");
    }
    else if (choice === "rock") {
        userChoice = choiceListIcons[0];
        if (choiceList[bot] === "paper") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = choiceListIcons[1];
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-paper").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for You";
            botChoice = choiceListIcons[2];
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-scissor").classList.add("red");
        }
    }
    else if (choice === "paper") {
        userChoice = choiceListIcons[1];
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for You";
            botChoice = choiceListIcons[0];
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-rock").classList.add("red");
        }
        else {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = choiceListIcons[2];
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-scissor").classList.add("green");
        }
    }
    else if (choice === "scissor") {
        userChoice = choiceListIcons[2];
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = choiceListIcons[0];
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-rock").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for You";
            botChoice = choiceListIcons[1];
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-paper").classList.add("red");
        }
    }
    score.innerHTML = `<span id="bot-choice-emoji" style="background-image:url('${botChoice}')"></span><span>[ ${botScore} ] : [ ${userScore} ]</span><span id="user-choice-emoji" style="background-image:url('${userChoice}')"></span>`;

    if (botScore == maxScore || userScore == maxScore) {
        outcome.innerHTML = (botScore > userScore) ? `the bot wins this round` : `a win is a win`;
        botScore = userScore = 0;
    }
}

choices.forEach(choice => {
    choice.addEventListener("click", (event) => {
        makeChoice(event, choice.getAttribute("id"));
    });
});

function openTab(e, tabName) {
    let i, tablinks, tabcontent;
    tabcontent = qa(".tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = qa(".tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    id(tabName).style.display = "flex";
    e.currentTarget.className += " active";
}

/***
// a media condition that targets viewports at least 768px wide
const mediaQuery = window.matchMedia(' (min-width: 768px)');

// an orientation detect-and-act function
function handleMediaChange(e) {
    if (e.matches) // landscape view 
    {
        qa(".tabcontent").forEach(tab => {
            tab.style.display = "none";
        });
    }
    else // portrait view
    {
        qa(".tabcontent").forEach(tab => {
            openTab(e, tab.id);
        });
    }
}

mediaQuery.addEventListener("change", handleMediaChange);
***/