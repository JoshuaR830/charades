const charadesSubtitle = 'Play';
const scoreSubtitle = 'Score Board';

var socket = io();
var room;
var login;
var charades;
var winner;

var yourCharade;

socket.on('reveal-answer', function(answer, name) {
    yourCharade = answer;
    console.log("Show");
    dissapear();
    setTimeout(appear, 500);
    var card = document.getElementById('charade-card');

    var title = card.querySelector('.card-title');
    var body = card.querySelector('.body');

    title.innerText = `${toSentenceCase(answer)}`;
    body.innerText = `${toSentenceCase(name)} was acting like ${answer}`;
});

function myCharade(charade) {
    yourCharade = charade[0];
    category = charade[1];
    console.log(`Category: ${category}, Charade: ${charade}` );
    setLightColour();
    setColours();
    dissapear();
    setTimeout(appear, 500);
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('reveal-button').style.display = 'inline-block';
    changeContent();
}

socket.on('new-card', function(name, charade) {
    if(name === document.getElementById('my-user').value) {
        console.log("It's me");
        myCharade(charade);
    } else {
        var card = document.getElementById('charade-card');
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('reveal-button').style.display = 'none';
    
        var title = card.querySelector('.card-title');
        var body = card.querySelector('.body');

        console.log(title.innerText);
        console.log(body.innerText);
    
        title.innerText = `It's ${toSentenceCase(name)}'s turn`;
        body.innerText = `Start guessing what ${name} is acting`;
        console.log("done");
    }
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
    players.sort();
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
            div.oncontextmenu = function () {
                console.log(myPlayer);
                decrementScore(myPlayer);
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
        div.addEventListener('click', function (event) {
            console.log(event.button);
            if (event.button === 0) {
                incrementScore(currentPlayer);
            }
            if(event.button === 2) {
                decrementScore(currentPlayer);
            }
        });
        playerContainer.appendChild(div);
    }
}

function incrementScore(name) {
    console.log("Room " + room);
    socket.emit("increment-score", room, name);
}

function decrementScore(name) {
    socket.emit("increment-score", room, name, false);
}

function onSocketLoad() {
    console.log(getCookie("replayCharades"));
    login = document.getElementById('login');
    charades = document.getElementById('charades');
    winner = document.getElementById('winner');
    loadLoginCookies();
    if(getCookie("replayCharades") === "true") {
        submitUserName();
        document.cookie = "replayCharades=false";
    }
    document.getElementById('name-input').focus();
    document.getElementById('login-button').addEventListener('click', function(event) {
        console.log("Clickeed login");
        event.preventDefault();
        submitUserName();
    });
    document.getElementById('edit-login-button').addEventListener('click', editLogin);
}

function editLogin() {
    document.getElementById('edit-login-button').classList.add('hidden');

    console.log("Hello everyone");
    document.getElementById('name-input').style.display = "inline-block";
    document.getElementById('room-input').style.display = "inline-block";
    document.getElementById('password-input').style.display = "inline-block";
    var subtitles = document.querySelectorAll(".login-subtitle");

    document.getElementById('login-message').textContent = `To play as a group you will all need to enter the same group name and password.`;
    
    subtitles.forEach(function(element) {
        element.style.display = "inline-block";
    });
}

function loadLoginCookies() {
    // var userName = document.cookie = "userName=";
    // var groupName = document.cookie = "groupName=";
    // var groupPassword = document.cookie = "groupPassword=";

    var userName = getCookie("userName");
    var groupName = getCookie("groupName");
    var groupPassword = getCookie("groupPassword");

    var nameInput = document.getElementById('name-input');
    var groupNameInput = document.getElementById('room-input');
    var groupPasswordInput = document.getElementById('password-input');
    
    if(userName != undefined && groupName != undefined && groupPassword != undefined) {
        console.log("Oops");
        nameInput.value = userName;
        groupNameInput.value = groupName;
        groupPasswordInput.value = groupPassword;
        document.getElementById('edit-login-button').classList.remove('hidden');
        nameInput.style.display = "none";
        groupNameInput.style.display = "none";
        groupPasswordInput.style.display = "none";
        var subtitles = document.querySelectorAll(".login-subtitle");
        subtitles.forEach(function(element) {
            element.style.display = "none";
            document.getElementById('login-message').textContent = `You're all set ${userName}, you'll be joining group ${groupName}, to change, just press the edit button.`;
        });
    }
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

function hello() {
    console.log("Hello");
    document.cookie = "replayCharades=true"
    document.location.reload();

}

function showWinners(scores, names) {
    var scoreContainer = document.getElementById('increment-score-container');
    scoreContainer.style.display = 'none';
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
            if(scores[orderedNames[i]] === scores[orderedNames[i-1]]){
            } else {
                position ++;
            }
        }

        name = orderedNames[i];
        score = scores[orderedNames[i]];

        switch(position) {
            case 1:
                place = 'first';
                break;
            case 2: 
                place = 'second';
                break;
            case 3:
                place = 'third';
                break;
            default:
                place = 'other';
                break;
        }

        html += `<div class="score-row"><div class="medal ${place}-medal">${position}</div><div class="${place}-place score-place"><div class="score-name">${name}</div><div class="score-circle ${place}-circle">${score}</div></div></div>`
    }
    html += `<div class="button" onclick="hello()">Again<div></div>`;
    scoreContainer.innerHTML = html;
}

function hideLogin(name) {
    login.style.display = 'none';
    document.getElementById('menu-scores').style.display = "inline-block";
    charades.style.display = 'inline-block';
    document.getElementById('my-user').value = name;
    document.getElementById('surface-subtitle').innerText = charadesSubtitle;
    syncWithServer();
}

function syncWithServer() {
    document.getElementById("sync-container").style.display = 'block';
    var name = document.getElementById('my-user').value;
    socket.emit('update', room, name);
}

function submitUserName() {
    var name = document.getElementById('name-input').value;
    room = document.getElementById('room-input').value;
    var password = document.getElementById('password-input').value;

    document.cookie = `userName=${name}`;
    document.cookie = `groupName=${room}`;
    document.cookie = `groupPassword=${password}`;

    socket.emit('new-user-name', name, room, password);
}

function revealAnswer() {
    console.log("Revealed");
    socket.emit('user-revealed-answer', room);
    document.getElementById('reveal-button').style.display = 'none';
}

socket.on('scores-to-upvote', function(scores, names) {
    var scoreContainer = document.getElementById('increment-score-container');
    scoreContainer.style.display = 'inline-block';
    charades.style.display = 'none';

    html = "";
    scoreContainer.innerHTML = "";
    names.sort();
    for(var i = 0; i < names.length; i ++) {
        var name = names[i];
        var score = scores[name];
        html += `<div class="score-row increment-button" onclick="scoreIncremented(` + `'${name.trim()}'` + `)"><div class="other-place score-place"><div class="score-name">${name}</div><div class="score-circle other-circle">${score}</div></div></div>`
    }
    scoreContainer.innerHTML = html;

    var name = document.getElementById('my-user').value;
});

function scoreIncremented(name) {
    incrementScore(name);
    var scoreContainer = document.getElementById('increment-score-container');
    charades.style.display = 'inline-block';
    scoreContainer.style.display = 'none';
    var name = document.getElementById('my-user').value;
    socket.emit('select-whose-turn', room, name);
    document.getElementById('increment-score').style.display = 'none';
}

function newCard() {
    console.log('new-card-selected');
    var name = document.getElementById('my-user').value;
    console.log(`It's ${name}'s turn`);
    socket.emit('user-selected-new-card', room, name);
}

function startGame() {
    console.log("It's happening");
    var name = document.getElementById('my-user').value;
    socket.emit('select-whose-turn', room, name);
    document.getElementById('start-game').style.display = 'none';
}

function toSentenceCase(text) {
    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`;
}

function setColours() {
    var root = document.documentElement;

    document.getElementById("category").innerText = toSentenceCase(category);

    if(category === "christmas" || category === "music") {
        root.style.setProperty("--card-color", "rgb(181, 5, 17)");
        root.style.setProperty("--accent-color", "rgb(209, 19, 32)");
        root.style.setProperty("--border-color", "rgb(107, 20, 26)");
        root.style.setProperty("--text-color", "rgb(196, 147, 150)");
    } else if(category === "easter" || category==="cooking") {
        root.style.setProperty("--card-color", "rgb(245, 236, 66)");
        root.style.setProperty("--accent-color", "rgb(237, 211, 64)");
        root.style.setProperty("--border-color", "rgb(237, 211, 64)");
        root.style.setProperty("--text-color", "rgb(177, 64, 237)");
    } else if (category === "sport" || category === "accessories") {
        root.style.setProperty("--card-color", "rgb(18, 102, 219)");
        root.style.setProperty("--accent-color", "rgb(87, 126, 181)");
        root.style.setProperty("--border-color", "rgb(62, 86, 120)");
        root.style.setProperty("--text-color", "rgb(11, 43, 89)");
    } else if (category === "france") {
        root.style.setProperty("--card-color", "rgb(0, 85, 164)");
        root.style.setProperty("--accent-color", "rgb(239, 65, 53)");
        root.style.setProperty("--border-color", "rgb(239, 65, 53)");
        root.style.setProperty("--text-color", "rgb(255, 255, 255)");
    } else if (category === "technology" || cateogry === "food?") {
        root.style.setProperty("--card-color", "rgb(95, 24, 128)");
        root.style.setProperty("--accent-color", "rgb(143, 40, 191)");
        root.style.setProperty("--border-color", "rgb(110, 55, 135)");
        root.style.setProperty("--text-color", "rgb(255, 255, 255)");
    } else if (category === "animals" || cateogry === "creatures") {
        root.style.setProperty("--card-color", "rgb(130, 87, 8)");
        root.style.setProperty("--accent-color", "rgb(219, 116, 13)");
        root.style.setProperty("--border-color", "rgb(184, 95, 7)");
        root.style.setProperty("--text-color", "rgb(64, 38, 8)");
    } else if (category === "books") {
        root.style.setProperty("--card-color", "rgb(0, 242, 255)");
        root.style.setProperty("--accent-color", "rgb(14, 189, 199)");
        root.style.setProperty("--border-color", "rgb(23, 148, 156)");
        root.style.setProperty("--text-color", "rgb(20, 72, 156)");
    } else if (category === "countries" || category === "plant") {
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
    } else if (category === "easter") {
        changeLightColour(245, 236, 66);
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