var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const players = {};

let quizes = require('./questions.json');
let quizIndex = 0;
let questionIndex = 0;
let currentQuestionCorrectIndex = -1;
let numberOfQuestions = Object.keys(quizes[0].results).length;
//console.log('Number of quesitons: ' + numberOfQuestions);
let currentQuiz = null;

function getQuiz(index) {
    return quizes[index];
}

function nextQuestion(index) {
    let currentQuestion = currentQuiz.results[index];
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
        io.emit('round_result', {currentQuestionCorrectIndex, players});
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

    socket.on('new_game', function (category) {
        currentQuiz = getQuiz(category);
        io.emit('get_ready', players);
        setTimeout(function () {
            nextRound();
        }, 10000);
    });

    socket.on('client_answer', function (answer) {
        // handle userID and questionIndex
        if(answer.option == currentQuestionCorrectIndex) {
            players[answer.userName].points += 1;
        } else {
            players[answer.userName].lives -= 1;
            if(players[answer.userName].lives == 0) {
                io.emit('game_over', socket.id);
            }
        }
    });

    /*
    socket.on('round_result', function (answer) {
        
    });
    */
});



