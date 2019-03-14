const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('../config.json');
var util = require('./lib/util');

var Game = require('./game.js');
var Player = require('./player.js');

var sockets = {};

app.use(express.static(__dirname + '/../client'));

io.on('connection', socket => {

    var currentPlayer = new Player(
        socket.id,
        { x:config.defaultPlayer1XPos, y:config.defaultPlayer1YPos },
        { x:config.defaultPlayerWidth, y:config.defaultPlayerHeight },
        4,
        game.players.length % 2 === 0,
        { left:false, right:false, up:false, down:false, a:false, b:false }
    );

    socket.on('gotit', () => {
        if (util.findIndex(game.players, currentPlayer.id) > -1 || !util.validNick(currentPlayer.name)) {
            socket.disconnect();
        } else {
            sockets[currentPlayer.id] = socket;
            game.players.push(currentPlayer);
        }
    });
    
    socket.on('spawn', playerName => {
        if (util.findIndex(game.players, currentPlayer.id) > -1) game.players.splice(util.findIndex(game.players, currentPlayer.id), 1);
        currentPlayer.name = playerName;
        socket.emit('welcome', currentPlayer);
    });

    socket.on('disconnect', () => {
        if (util.findIndex(game.players, currentPlayer.id) > -1) game.players.splice(util.findIndex(game.players, currentPlayer.id), 1);
        socket.broadcast.emit('playerDisconnect', { name: currentPlayer.name });
    });
    
    socket.on('inputs', keys => currentPlayer.keys = keys);
});

var game = new Game();
var sendUpdates = () => game.players.forEach(player => sockets[player.id].emit('updateGame', game));

setInterval(game.act, 1000 / 60);
setInterval(sendUpdates, 1000 / config.networkUpdateFactor);

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, () => console.log("Server is listening on port " + serverPort));