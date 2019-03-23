const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('../config');
var util = require('./lib/util');
var Game = require('./lib/game');

var sockets = {};

app.use(express.static(__dirname + '/../client'));

io.on('connection', socket => {
    var currentPlayer = game.createNewPlayer(socket);

    socket.on('spawn', playerName => {
        if (util.findIndex(game.players, currentPlayer.id) > -1) game.players.splice(util.findIndex(game.players, currentPlayer.id), 1);
        currentPlayer.name = playerName;
        socket.emit('welcome', currentPlayer);
    });

    socket.on('gotit', () => {
        if (util.findIndex(game.players, currentPlayer.id) > -1 || !util.validNick(currentPlayer.name)) socket.disconnect();
        else {
            sockets[currentPlayer.id] = socket;
            game.players.push(currentPlayer);
            game.updatePlayers(currentPlayer.role);
        }
    });

    socket.on('inputs', keys => currentPlayer.keys = util.validKeys(keys));

    socket.on('disconnect', () => {
        if (util.findIndex(game.players, currentPlayer.id) > -1) game.players.splice(util.findIndex(game.players, currentPlayer.id), 1);
        game.updatePlayers(currentPlayer.role);
    });
});

var game = new Game();
var sendUpdates = () => game.players.forEach(player => sockets[player.id].emit('updateGame', game));

setInterval(game.act, 1000 / config.networkUpdateFactor);
setInterval(sendUpdates, 1000 / config.networkUpdateFactor);

var serverPort = process.env.PORT || config.port;
http.listen(serverPort, () => console.log("Server is listening on port " + serverPort));