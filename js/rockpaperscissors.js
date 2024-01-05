function qA(selecetor) { return document.querySelectorAll(selecetor); }
function q(selecetor) { return document.querySelector(selecetor); }

let choices = qA(".choice");
let botChoices = qA(".bot-choice");
let score = q(".score");

let choiceList = ["rock", "paper", "scissor"];
let userScore = 0, botScore = 0;
let reset = q(".reset");
let input = null;

reset.addEventListener("click", () => { input = prompt("New target score:") });

let botChoice, userChoice;

function makeChoice(evt, choice) {
    let maxScore = (input === null || input === "") ? 3 : parseInt(input);

    for (i = 0; i < choices.length; i++)
        choices[i].classList.remove("green", "red", "grey");

    for (i = 0; i < botChoices.length; i++)
        botChoices[i].classList.remove("green", "red", "grey");

    let bot = Math.floor(Math.random() * 3);
    var i, outcome;
    outcome = q(".outcome");

    if (choice === choiceList[bot]) {
        outcome.innerHTML = "It's a tie";
        botChoice = `${9994 + bot}`;
        userChoice = botChoice;
        evt.currentTarget.classList.add("grey");
        q("#bot-" + choice).classList.add("grey");
    }
    else if (choice === "rock") {
        userChoice = 9994;
        if (choiceList[bot] === "paper") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9995;
            botScore++;
            evt.currentTarget.classList.add("red");
            q("#bot-paper").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9996;
            userScore++;
            evt.currentTarget.classList.add("green");
            q("#bot-scissor").classList.add("red");
        }
    }
    else if (choice === "paper") {
        userChoice = 9995;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9994;
            userScore++;
            evt.currentTarget.classList.add("green");
            q("#bot-rock").classList.add("red");
        }
        else {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9996;
            botScore++;
            evt.currentTarget.classList.add("red");
            q("#bot-scissor").classList.add("green");
        }
    }
    else if (choice === "scissor") {
        userChoice = 9996;
        if (choiceList[bot] === "rock") {
            outcome.innerHTML = "Plus 1 for the Bot";
            botChoice = 9994;
            botScore++;
            evt.currentTarget.classList.add("red");
            q("#bot-rock").classList.add("green");
        }
        else {
            outcome.innerHTML = "Plus 1 for Me";
            botChoice = 9995;
            userScore++;
            evt.currentTarget.classList.add("green");
            q("#bot-paper").classList.add("red");
        }

    }
    score.innerHTML = `<span class="comm">&#${botChoice}</span> Bot [ ${botScore} ] : [ ${userScore} ] Me <span class="comm">&#${userChoice}</span>`;

    let loss = [128169, 129313, 128528, 128128, 129324, 127770];
    let win = [128526, 128520, 129393, 129398, 128226, 127942];
    let rand = Math.floor(Math.random() * 6);

    if (botScore == maxScore || userScore == maxScore) {
        outcome.innerHTML = (botScore > userScore) ? `Yikes, the bot wins <span class="comm">&#${loss[rand]}</span>` : `A win is a win <span class="comm">&#${win[rand]}</span>`;
        botScore = 0;
        userScore = 0;

        reset.innerHTML = "Reset target score";
    }

}

choices.forEach(choice => {
    choice.addEventListener("click", (event) => {
        makeChoice(event, choice.getAttribute("id"));
    })
});

function openTab(evt, tabName) {
  let i, tablinks, tabcontent;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "flex";
  evt.currentTarget.className += " active";
}