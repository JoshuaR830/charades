const debug = false;
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var bodyParser = require('body-parser');

function Room(code, password) {
    this.roomCode = code;
    this.password = password;
    this.names = [];
    this.scores = {};
    this.sortedScores = {};
    this.winningScore = 5;
    this.categories = initialCategories.slice();
    this.charades = initialCharades.slice();
    this.answer;
}

const winningScore = 5;

var initialCategories = ["christmas", "sport", "france", "technology", "animals", "books", "countries", "politics"]
var initialCharades = [
    ["Christmas tree", "Snowball", "Box of Roses", "Santa", "Rudolph", "Box of Celebrations", "Tinsel", "Bauble", "Lights", "Present", "Mince pie", "Christmas Pudding", "Carols", "Christmas card", "Christmas Wreath", "Chestnuts roasting on an open fire", "Turkey", "Sage and onion stuffing"], 
    ["Football", "Tennis", "Snooker", "Badminton", "Squash", "Hockey", "Golf", "Baseball", "Volleyball", "Swimming", "Skiing", "Skateboarding", "Hiking", "Fishing", "Rifle Shooting", "Clay Pigeon Shooting", "Archery", "Darts", "Gymnastics", "Rugby", "Ice hockey", "American football", "Cricket", "Lacrosse", "Polo (horse)", "Jousting", "Quidich", "Water polo (no horse - obviously)", "Fencing", "Dressage", "Show jumping (horse)", "Underwater Hockey", "Air hockey", "Paper plane throwing"], 
    ["Baguette", "Eiffel Tower", "Croissant", "Louvre", "Mont St Michel", "Arc du Triomphe", "Moulin Rouge", "Beret", "Salted butter", "Breton top (stripey long-sleeved tshirt)", "Champagne", "the French flag"],
    ["Computer", "Phone", "Robot", "Computer mouse", "Computer keyboard", "Headphones", "MP3 player", "Facebook", "Texting", "Camera", "TV", "Kindle", "App (application)"],
    ["Emu", "ostrich", "ant eater", "armadillo", "giraffe", "dolphin", "turtle", "elephant", "Lion", "koala", "kangaroo", "hedgehog", "piranha", "jelly fish", "sea urchin", "jelly fish", "squid", "Penguin", "otter", "narwhal", "unicorn", "bear", "lemur", "highland cow", "hardy sheep", "centipede", "dragon", "marmot", "meerkat", "sloth", "panda"],
    ["Pride and Prejudice", "The Famous Five", "James and the Giant Peach", "The Bible", "Sherlock Holmes", "Little Red Riding Hood", "Peter Rabbit", "Little Women", "To kill a mockingbird", "Harry Potter", "1984", "Animal Farm", "The Cat in the Hat", "Romeo and Juliet", "Of Mice and Men", "Alice in Wonderland", "The Lion, the Witch and the Wardrobe"],
    ["Finland", "France", "Germany", "North Korea", "China", "Mexico", "Antarctica", "Morocco", "Japan", "Australia", "The Neverlands", "Spain", "Switzerland", "Zimbabwe"],
    ["Brexit", "voting", "Boris Johnson", "Jeremy Corbyn", "Michael Gove", "Jacob Reese Mogg", "the houses of parliament", "Conservatives", "Labour", "Liberal Democrats", "SNP"]
]

if(debug) {
    var initialCategories = ["Hello"];
    var initialCharades = [["Hello"]];
    winningScore = 1;
}

rooms = {};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

function displayScoreBoard(id) {
    var scores = rooms[id].scores;
    var sortedScores = rooms[id].sortedScores;
    var names = rooms[id].names;
    // Creates an array of scores in order
    var arrScores = Object.values(scores);
    arrScores.sort().reverse();

    // Create a list of scores in the order that they placed
    for(i = 0; i < arrScores.length; i++) {
        for(j = 0; j < names.length; j++) {
            if(arrScores[i] === scores[names[j]]) {
                sortedScores[names[j]] = arrScores[i];
            }
        }
    }
}

function selectCharade(id) {
    do {
        console.log(id);
        var charades = rooms[id].charades;
        var categories = rooms[id].categories;

        var numCategories = charades.length;

        if(numCategories === 0) {
            displayScoreBoard(id);
            return [null, null];
        }

        var categoryToSelect = (Math.floor(Math.random() * 10) % numCategories);
        var numCharades = charades[categoryToSelect].length;

        if(numCharades === 0){
            charades.splice(categoryToSelect, 1);
            categories.splice(categoryToSelect, 1);
        }

    } while(numCharades === 0);

    var charadeToSelect = (Math.floor(Math.random() * 10) % numCharades);

    answer = charades[categoryToSelect][charadeToSelect];

    charades[categoryToSelect].splice(charadeToSelect, 1);
    if(numCategories > 0) {
        return [answer, categories[categoryToSelect]];
    }
}

io.on('connection', function(socket) {

    console.log('user logged in');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    socket.on('new-user-name', function(name, room, password) {

        console.log(room);

        if(!(room in rooms)) {
            rooms[room] = new Room(room, password);
        }
        
        if(rooms[room].password != password) {
            socket.emit('invalid-password');
        } else {
            socket.emit('valid-password', name);
            console.log(name);
            console.log(`room ${room}`);
            var scores = rooms[room].scores;
            var names = rooms[room].names;

            socket.join(room);

            console.log('hello');
            console.log(rooms[room]);

            name = name.split(" ")[0];
            if(!(name in scores)) {
                names[names.length] = name;
                scores[name] = 0;
            }

            console.log(rooms[room]);


            console.log(scores);
            socket.emit('load-score-data', scores, names);
            socket.broadcast.to(room).emit('load-score-data', scores, names);
        }
    });

    socket.on('increment-score', function(id, name) {
        console.log(rooms[id]);
        var scores = rooms[id].scores;
        var sortedScores = rooms[id].sortedScores;
        var names = rooms[id].names;
        var winningScores = rooms[id].winningScore;
        console.log(`${name} needs their score incremented`);
        scores[name] += 1;
        socket.emit('load-score-data', scores, names);
        socket.broadcast.to(id).emit('load-score-data', scores, names);

        for(i = 0; i < names.length; i++) {
            if (scores[names[i]] >= winningScore){
                console.log("Winning score");
                displayScoreBoard(id);
                socket.emit('game-over', sortedScores, names);
                socket.to(id).broadcast.emit('game-over', sortedScores, names);
                delete rooms[id];
                break;
            }
        }
    })

    socket.on('user-revealed-answer', function(id) {
        console.log(`answer ${answer}`);
        socket.broadcast.to(id).emit('reveal-answer', answer);
    });

    socket.on('user-selected-new-card', function(id, name) {

        console.log("New");
        response = selectCharade(id);
        if(response == [null, null]) {
            socket.broadcast.to(id).emit('game-over', sortedScores, names);
            socket.emit('game-over', sortedScores, names);
            delete rooms[id];
        }
        console.log(answer);
        console.log(`It's ${name}'s turn`);
        socket.emit('my-charade', response);
        socket.broadcast.to(id).emit('set-colour', response[1]);
        socket.broadcast.to(id).emit('new-card', name);
    })
});

app.get('/', function(req, res) { 
    res.sendFile(`${process.cwd()}/charades.html`);
});

http.listen(8001, () => console.log('Listening on port 8001!'));