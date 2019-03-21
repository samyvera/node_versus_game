var config = require('../../config.json');
var util = require('./util');
var Player = require('./player');
var Vector2D = require('./vector2D');
var Collision = require('./collision');

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
                if (util.is(playerRole, ["player1", "player2"])) {
                    if (this.players[0].id === player.id) {
                        player.role = "player1";
                        player.keysHistory = [];
                        player.pos = new Vector2D(config.defaultPlayer1XPos, config.defaultPlayer1YPos);
                        player.action = "idle";
                    } else if (this.players.length > 1 && this.players[1].id === player.id) {
                        player.role = "player2";
                        player.keysHistory = [];
                        player.pos = new Vector2D(config.defaultPlayer2XPos, config.defaultPlayer2YPos);
                        player.action = "idle";
                    }
                } else if (this.players.length > 2 && !util.is(player.id, [this.players[0].id, this.players[1].id])) {
                    player.role = "spectator";
                    player.pos = new Vector2D(null, null);
                }
            });
        }

        this.obstacleAt = (pos, size) => pos.x < 0 || pos.x + size.x > config.gameWidth || pos.y + size.y > config.gameHeight - 32 ? true : false;

        this.collisionAt = actor => {
            let xStart = actor.pos.x;
            let xEnd = actor.pos.x + actor.size.x;
            let yStart = actor.pos.y;
            let yEnd = actor.pos.y + actor.size.y;
            var result = null;
            this.players.forEach(other => {
                let otherXStart = other.pos.x;
                let otherXEnd = other.pos.x + other.size.x;
                let otherYStart = other.pos.y;
                let otherYEnd = other.pos.y + other.size.y;
                if (other.id !== actor.id && util.is(other.role, ["player1", "player2"]) &&
                    !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) result = new Collision(actor, other);
            });
            this.collision = result;
            return result;
        }
    }
}
module.exports = Game;