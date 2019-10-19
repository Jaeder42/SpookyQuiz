import { userInfo } from 'os';

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const players = {};

let questions = require('./questions.json');
let questionIndex = 0;
let currentQuestionCorrectIndex = 0;
let numberOfQuestions = Object.keys(questions.results).length;
//console.log('Number of quesitons: ' + numberOfQuestions);

function nextQuestion(index) {
    let currentQuestion = questions.results[index];
    let question = currentQuestion.question;
    console.log('New Question: ' + question);
    let answers = [];
    for (var answer of currentQuestion.incorrect_answers) {
        answers.push(answer);
    }
    currentQuestionCorrectIndex = Math.floor(Math.random() * 3);
    console.log(currentQuestionCorrectIndex);
    answers.splice(currentQuestionCorrectIndex, 0, currentQuestion.correct_answer);
    console.log('Answers:');
    for (var answer of answers) {
        console.log(answer);
    }
    return { question, answers };
}

function nextRound() {
    io.emit('new_round', nextQuestion(questionIndex));
    setTimeout(function () {
        console.log('Round is over.');
        io.emit('round_result', currentQuestionCorrectIndex);
        questionIndex++;
        if (questionIndex == numberOfQuestions) {
            // game over!
            getResult();
            return;
        }
        setTimeout(function () {
            nextRound();
        }, 5000);
    }, 10000);
}

function getResult() {
    io.emit('present_result', players);
}

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('player connected to service');

    socket.on('disconnect', function () {
        console.log('player disconnected');
    });

    socket.on('join_game', function (username) {
        console.log('player ' + username + ' joined the game');
        players[username] = {points: 0, lives: 3, ...players[username]}
        io.emit('player_joined', username);
    });

    socket.on('new_game', function () {
        io.emit('get_ready', players);
        setTimeout(function () {
            nextRound();
        }, 10000);
    });

    socket.on('client_answer', function (answer) {
        // handle userID and questionID
    });

    /*
    socket.on('round_result', function (answer) {
        
    });
    */
});



