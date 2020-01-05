var socket = io();
var login;
var charades;
var winner;

var yourCharade;

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
    var title = card.querySelector('.title');
    var body = card.querySelector('.body');

    title.innerText = toSentenceCase(yourCharade);
    body.innerText = `Act like ${yourCharade}`;
}

function displayPlayers(scores, players) {
    var playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = "";
    console.log("Hello");
    for(i = 0; i < players.length; i ++) {
        score = scores[players[i]];
        let currentPlayer = players[i]
        var div = document.createElement('div');
        div.classList.add("score");
        console.log(currentPlayer);
        div.onclick = function () {
            console.log(currentPlayer);
            incrementScore(currentPlayer);
        }
        div.innerHTML = `${players[i].split(" ")[0]}<br><span class="score-text">${score}</span>`;
        playerContainer.appendChild(div);
    }

}

function incrementScore(name) {
    socket.emit("increment-score", name);
}

socket.on('new-card', function(name) {
    var card = document.getElementById('charade-card');

    document.getElementById('new-charade').style.display = 'none';
    document.getElementById('reveal-button').style.display = 'none';

    var title = card.querySelector('.title');
    var body = card.querySelector('.body');

    title.innerText = `It's ${toSentenceCase(name)}'s turn`;
    body.innerText = `Start guessing what ${name} is acting`;
})

window.addEventListener('load', function() {
    login = document.getElementById('login');
    charades = document.getElementById('charades');
    winner = document.getElementById('winner');
    document.getElementById('name-input').focus();
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        submitUserName();
    });
});

socket.on('load-score-data', function(scores, names) {
    console.log(scores);
    displayPlayers(scores, names);
});

socket.on('game-over', function(winnerName, scores, names) {
    // showWinner(winnerName);
    console.log("Winner is: " + winnerName);
    console.log(scores);
    console.log(names);
    showWinners(scores, names);
});

function showWinners(scores, names) {

    charades.style.display = 'none';
    winner.style.display = 'inline-block';

    var podeum = document.getElementById('podeum');
    var otherPlayers = document.getElementById('other-places');
    otherPlayers.innerHTML = "";
    console.log(scores);

    orderedNames = Object.keys(scores);

    console.log(orderedNames);
    console.log(orderedNames.length);

    var position;
    var num = 0;
    var positions = [0, 0, 0, 0];


    for(i = 0; i < orderedNames.length; i++) {
        var root = document.documentElement;
        score = scores[orderedNames[i]];
        var position = document.createElement('div');
        var place;
        var j = i;

        if(i > 0) {
            if (scores[orderedNames[i]] === scores[orderedNames[i-1]]) {
                num ++;
            }
        }
        
        j = (i - num);

        console.log("num " + num);

        console.log("J " + j);
        console.log("i - num" + (i - num));



        if (j === 0) {
            positions[j] ++;
            if(positions[j] <= 4) {
                root.style.setProperty("--first-width", (positions[j]));
            }

            console.log('first:' + orderedNames[i]);
            place = document.getElementById('first-place');
            position.classList.add('score', 'first-player');
            position.innerHTML = `${orderedNames[i].split(" ")[0]}<br><span class="score-text">${score}</span>`;
            place.appendChild(position);
            

            
        } else if (j === 1) {
            positions[j] ++;
            if(positions[j] <= 4) {
                root.style.setProperty("--second-width", (positions[j]));
            }


            console.log('second:' + orderedNames[i])
            place = document.getElementById('second-place');
            position.classList.add('score', 'second-player');
            position.innerHTML = `${orderedNames[i].split(" ")[0]}<br><span class="score-text">${score}</span>`;
            place.appendChild(position);
            

            
        } else if (j == 2) {
            positions[j] ++;
            if(positions[j] <= 4) {
                root.style.setProperty("--third-width", (positions[j]));
            }


            place = document.getElementById('third-place');
            position.innerHTML = `${orderedNames[i].split(" ")[0]}<br><span class="score-text">${score}</span>`;
            position.classList.add('score', 'third-player');
            console.log('third:' + orderedNames[i]);
            place.appendChild(position);
           



        } else {
            place = document.getElementById('other-places');
            console.log('other:' + orderedNames[i]);
            let currentPlayer = orderedNames[i]
            
            console.log(currentPlayer);
            position.classList.add("score");

            position.innerHTML = `${orderedNames[i].split(" ")[0]}<br><span class="score-text">${score}</span>`;
            place.appendChild(position);
            positions[3] ++;

        }



        console.log(positions);
    };

    positions.sort().reverse();
    root.style.setProperty("--score-height", (Math.ceil(positions[0] / 4)));

}

function hideLogin(name) {
    login.style.display = 'none';
    charades.style.display = 'inline-block';
    document.getElementById("my-user").value = name;
}

function submitUserName() {
    var name = document.getElementById('name-input').value;
    var room = document.getElementById('room-input').value;

    socket.emit('new-user-name', name, room);
    hideLogin(name);
}

function revealAnswer() {
    console.log("Revealed");
    socket.emit('user-revealed-answer');
    // document.getElementById('new-charade').style.display = 'inline-block';
    document.getElementById('reveal-button').style.display = 'none';
}

function newCard() {
    console.log('new-card-selected');
    var name = document.getElementById('my-user').value;
    socket.emit('user-selected-new-card', name);
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
