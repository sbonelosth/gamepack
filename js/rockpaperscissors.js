const qa = sel => { return document.querySelectorAll(sel); };
const q = sel => { return document.querySelector(sel); };
const id = sel => { return document.getElementById(sel); };

let choices = qa(".choice");
let botChoices = qa(".bot-choice");
let score = q(".rps-score");
let threshold = q("#threshold");

let choiceList = ["rock", "paper", "scissor"];
let userScore = 0, botScore = 0;
let resetRounds = q(".reset-rounds");
let input = null;

resetRounds.addEventListener("click", () =>
{
    input = prompt("New target score:");
    threshold.textContent = input;
});

let botChoice, userChoice;

function makeChoice(e, choice)
{
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
        botChoice = `${9994 + bot}`;
        userChoice = botChoice;
        e.currentTarget.classList.add("grey");
        q("#bot-" + choice).classList.add("grey");
    }
    else if (choice === "rock") {
        userChoice = 9994;
        if (choiceList[bot] === "paper") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9995;
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-paper").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9996;
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-scissor").classList.add("red");
        }
    }
    else if (choice === "paper") {
        userChoice = 9995;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9994;
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-rock").classList.add("red");
        }
        else {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9996;
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-scissor").classList.add("green");
        }
    }
    else if (choice === "scissor") {
        userChoice = 9996;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9994;
            botScore++;
            e.currentTarget.classList.add("red");
            q("#bot-rock").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9995;
            userScore++;
            e.currentTarget.classList.add("green");
            q("#bot-paper").classList.add("red");
        }

    }
    score.innerHTML = `<span class="result-emoji">&#${botChoice}</span> Bot [ ${botScore} ] : [ ${userScore} ] Me <span class="result-emoji">&#${userChoice}</span>`;

    let loss = [128169, 129313, 128528, 128128, 129324, 127770];
    let win = [128526, 128520, 129393, 129398, 128226, 127942];
    let rand = Math.floor(Math.random() * 6);

    if (botScore == maxScore || userScore == maxScore) {
        outcome.innerHTML = (botScore > userScore) ? `Yikes, the bot wins <span class="result-emoji">&#${loss[rand]}</span>` : `A win is a win <span class="result-emoji">&#${win[rand]}</span>`;
        botScore = userScore = 0;
    }

}

choices.forEach(choice => {
    choice.addEventListener("click", (event) => {
        makeChoice(event, choice.getAttribute("id"));
    })
});

function openTab(e, tabName)
{
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

// a media condition that targets viewports at least 768px wide
const mediaQuery = window.matchMedia(' (min-width: 768px)');

// an orientation detect-and-act function
function handleMediaChange(e)
{
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

mediaQuery.addEventListener('change', handleMediaChange);