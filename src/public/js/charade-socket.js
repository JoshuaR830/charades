const charadesSubtitle = 'Play';
const scoreSubtitle = 'Score Board';

var socket = io();
var login;
var charades;
var winner;

var yourCharade;

var room;

socket.on('reveal-answer', function(answer) {
    yourCharade = answer;
    console.log("Show");
    dissapear();
    setTimeout(appear, 500);
    document.getElementById('new-charade').style.display = 'inline-block';
});

socket.on('my-charade', function(charade) {
    yourCharade = charade[0];
    category = charade[1];
    console.log(`Category: ${category}, Charade: ${charade}` );
    setLightColour();
    setColours();
    dissapear();
    setTimeout(appear, 500);
});

function changeContent() {
    var card = document.getElementById('charade-card');
    var title = card.querySelector('.card-title');
    var body = card.querySelector('.body');

    title.innerText = toSentenceCase(yourCharade);
    body.innerText = `Act like ${yourCharade}`;
}

function displayPlayers(scores, players) {
    var settingsScoreContainer = document.getElementById('settings-scores-container');
    var playerContainer = document.getElementById('backdrop-scores-container');
    settingsScoreContainer.style.display = 'inline-block';
    console.log("Hello");
    var myPlayer = document.getElementById('my-user').value;
    playerContainer.innerHTML = "";
    
    for(i = 0; i < players.length; i ++) {
        if(i === 0)
        {
            console.log('Your player');
            var div = document.createElement('div');
            div.classList.add("your-backdrop-score");
            div.onclick = function () {
                console.log(myPlayer);
                incrementScore(myPlayer);
            }
            div.innerHTML = `<div class="your-backdrop-score-circle">${scores[myPlayer]}</div><div class="your-backdrop-score-text">${myPlayer}</div>`
            playerContainer.appendChild(div);
        }
        
        let currentPlayer = players[i]
        if(myPlayer === currentPlayer) {
            console.log("Skipped");
            continue;
        }

        score = scores[players[i]];
        var div = document.createElement('div');
        div.classList.add("backdrop-score");
        
        
        div.innerHTML = `<div class="backdrop-score-circle">${score}</div><div class="backdrop-score-text">${currentPlayer}</div>`;

        console.log(currentPlayer);
        div.onclick = function () {
            console.log(currentPlayer);
            incrementScore(currentPlayer);
        }
        playerContainer.appendChild(div);
    }

}

function incrementScore(name) {
    console.log("Room " + room);
    socket.emit("increment-score", room, name);
}

socket.on('new-card', function(name) {
    var card = document.getElementById('charade-card');

    document.getElementById('new-charade').style.display = 'none';
    document.getElementById('reveal-button').style.display = 'none';

    var title = card.querySelector('.card-title');
    var body = card.querySelector('.body');

    title.innerText = `It's ${toSentenceCase(name)}'s turn`;
    body.innerText = `Start guessing what ${name} is acting`;
})

function onSocketLoad() {
    login = document.getElementById('login');
    charades = document.getElementById('charades');
    winner = document.getElementById('winner');
    document.getElementById('name-input').focus();
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submitUserName();
    });
}

socket.on('load-score-data', function(scores, names) {
    console.log(scores);
    displayPlayers(scores, names);
});

socket.on('game-over', function(scores, names) {
    showWinners(scores, names);
});

socket.on('invalid-password', function() {
    document.getElementById('password-input').classList.add('error');
    room = "";
});

socket.on('valid-password', function(name) {
    document.getElementById('password-input').classList.remove('error');
    hideLogin(name);
});

function showWinners(scores, names) {
    document.getElementById('surface-subtitle').innerText = scoreSubtitle;

    scoreContainer = document.getElementById('score-container');
    orderedNames = Object.keys(scores);
    orderedValues = Object.values(scores);

    charades.style.display = 'none';
    scoreContainer.style.display = 'inline-block';

    var html = "";

    var name;
    var score;
    var position = 1;
    var place;

    for(var i = 0; i < orderedNames.length; i++)
    {
        if(i > 0) {
            if(scores[orderedNames[i]] === scores[orderedNames[i-1]])
            {
            } else {
                position ++;
            }
        }

        name = orderedNames[i];
        score = scores[orderedNames[i]];

        if(position === 1) {
            place = 'first';
        } else if (position === 2) {
            place = 'second';
        } else if (position === 3) {
            place = 'third';
        } else {
            place = 'other';
        }

        html += `<div class="score-row">
            <div class="medal ${place}-medal">${position}</div>
            <div class="${place}-place score-place">
                <div class="score-name">${name}</div>
                <div class="score-circle ${place}-circle">${score}</div>
            </div>
        </div>`

    }

    scoreContainer.innerHTML = html;
}

function hideLogin(name) {
    login.style.display = 'none';
    charades.style.display = 'inline-block';
    document.getElementById('my-user').value = name;
    document.getElementById('surface-subtitle').innerText = charadesSubtitle;
}

function submitUserName() {
    var name = document.getElementById('name-input').value;
    room = document.getElementById('room-input').value;
    var password = document.getElementById('password-input').value;

    socket.emit('new-user-name', name, room, password);
}

function revealAnswer() {
    console.log("Revealed");
    socket.emit('user-revealed-answer', room);
    // document.getElementById('new-charade').style.display = 'inline-block';
    document.getElementById('reveal-button').style.display = 'none';
}

function newCard() {
    console.log('new-card-selected');
    var name = document.getElementById('my-user').value;
    console.log(`It's ${name}'s turn`);
    socket.emit('user-selected-new-card', room, name);
    document.getElementById('new-charade').style.display = 'none';
    document.getElementById('reveal-button').style.display = 'inline-block';
}

function toSentenceCase(text) {
    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`;
}

function setColours() {
    var root = document.documentElement;

    document.getElementById("category").innerText = toSentenceCase(category);

    if(category === "christmas") {
        root.style.setProperty("--card-color", "rgb(181, 5, 17)");
        root.style.setProperty("--accent-color", "rgb(209, 19, 32)");
        root.style.setProperty("--border-color", "rgb(107, 20, 26)");
        root.style.setProperty("--text-color", "rgb(196, 147, 150)");
    } else if (category === "sport") {
        root.style.setProperty("--card-color", "rgb(18, 102, 219)");
        root.style.setProperty("--accent-color", "rgb(87, 126, 181)");
        root.style.setProperty("--border-color", "rgb(62, 86, 120)");
        root.style.setProperty("--text-color", "rgb(11, 43, 89)");
    } else if (category === "france") {
        root.style.setProperty("--card-color", "rgb(0, 85, 164)");
        root.style.setProperty("--accent-color", "rgb(239, 65, 53)");
        root.style.setProperty("--border-color", "rgb(239, 65, 53)");
        root.style.setProperty("--text-color", "rgb(255, 255, 255)");
    } else if (category === "technology") {
        root.style.setProperty("--card-color", "rgb(95, 24, 128)");
        root.style.setProperty("--accent-color", "rgb(143, 40, 191)");
        root.style.setProperty("--border-color", "rgb(110, 55, 135)");
        root.style.setProperty("--text-color", "rgb(255, 255, 255)");
    } else if (category === "animals") {
        root.style.setProperty("--card-color", "rgb(130, 87, 8)");
        root.style.setProperty("--accent-color", "rgb(219, 116, 13)");
        root.style.setProperty("--border-color", "rgb(184, 95, 7)");
        root.style.setProperty("--text-color", "rgb(64, 38, 8)");
    } else if (category === "books") {
        root.style.setProperty("--card-color", "rgb(0, 242, 255)");
        root.style.setProperty("--accent-color", "rgb(14, 189, 199)");
        root.style.setProperty("--border-color", "rgb(23, 148, 156)");
        root.style.setProperty("--text-color", "rgb(20, 72, 156)");
    } else if (category === "countries") {
        root.style.setProperty("--card-color", "rgb(31, 135, 47)");
        root.style.setProperty("--accent-color", "rgb(52, 168, 70)");
        root.style.setProperty("--border-color", "rgb(81, 189, 98)");
        root.style.setProperty("--text-color", "rgb(47, 71, 51)");
    } else if (category === "politics") {
        root.style.setProperty("--card-color", "rgb(56, 51, 45)");
        root.style.setProperty("--accent-color", "rgb(97, 93, 88)");
        root.style.setProperty("--border-color", "rgb(82, 80, 78)");
        root.style.setProperty("--text-color", "rgb(232, 225, 218)");
    }
}

function setLightColour() {
    if(category === "christmas") {
        changeLightColour(181, 5, 17);
    } else if (category === "sport") {
        changeLightColour(18, 102, 219);
    } else if (category === "france") {
        changeLightColour(0, 85, 164);
    } else if (category === "technology") {
        changeLightColour(95, 24, 128);
    } else if (category === "animals") {
        changeLightColour(130, 87, 8);
    } else if (category === "books") {
        changeLightColour(0, 242, 255);
    } else if (category === "countries") {
        changeLightColour(31, 135, 47);
    } else if (category === "politics") {
        changeLightColour(56, 51, 45);
    }
}

socket.on('set-colour', function(chosenCategory) {
    category = chosenCategory;
    console.log("Please set the colour");
    setColours();
});

function changeLightColour(r, g, b) {
    var xhttp = new XMLHttpRequest();
    var brightness = document.getElementById('brightness-slider').value;
    var parameters = `red=${r}&green=${g}&blue=${b}&brightness=${brightness}`;
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            if (this.responseText === "success") {
                console.log("Success");
            } else {
                console.log("Failed");
            }
        }
    }

    xhttp.open("POST", `${serverAddress}`, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(parameters);
}
