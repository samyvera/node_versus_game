var config = require('../config.json');
var Player = require('./player.js');

class Game {
    constructor() {
        this.players = [];
        this.act = () => this.players.forEach(player => player.act(this));

        this.createNewPlayer = socket => {
            var role;
            if (this.players.length === 0) role = "player1";
            else if (this.players.length === 1) role = "player2";
            else role = "spectator";
            return new Player(socket.id, role);
        }

        this.updatePlayers = playerRole => {
            this.players.forEach(player => {
                if (playerRole === "player1" || playerRole === "player2") {
                    if (this.players[0].id === player.id) {
                        player.role = "player1";
                        player.keysHistory = [];
                        player.pos = {
                            x: config.defaultPlayer1XPos,
                            y: config.defaultPlayer1YPos
                        };
                        player.action = "idle";
                    } else if (this.players.length > 1 && this.players[1].id === player.id) {
                        player.role = "player2";
                        player.keysHistory = [];
                        player.pos = {
                            x: config.defaultPlayer2XPos,
                            y: config.defaultPlayer2YPos
                        };
                        player.action = "idle";
                    }
                } else if (this.players.length > 2 && player.id !== this.players[0].id && player.id !== this.players[1].id) {
                    player.role = "spectator";
                    player.pos = {
                        x: null,
                        y: null
                    };
                }
            });
        }

        this.obstacleAt = (pos, size) => pos.x < 0 || pos.x + size.x > config.gameWidth || pos.y + size.y > config.gameHeight - 32 ? true : false;

        this.playerAt = (id, pos, size) => {
            let xStart = pos.x;
            let xEnd = pos.x + size.x;
            let yStart = pos.y;
            let yEnd = pos.y + size.y;
            var result = null;
            this.players.forEach(other => {
                let otherXStart = other.pos.x;
                let otherXEnd = other.pos.x + other.size.x;
                let otherYStart = other.pos.y;
                let otherYEnd = other.pos.y + other.size.y;
                if (other.id !== id && (other.role === "player1" || other.role === "player2") &&
                    !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) {
                    result = other;
                }
            });
            return result;
        }
    }
}

module.exports = Game;