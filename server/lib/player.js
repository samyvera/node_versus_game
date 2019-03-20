var config = require('../../config.json');
var util = require('./util');
var Vector2D = require('./vector2D');

class Player {
    constructor(id, role) {
        this.id = id;
        this.role = role;

        this.pos = new Vector2D(null, null);
        this.size = new Vector2D(config.defaultPlayerWidth, config.defaultPlayerHeight);
        this.speed = new Vector2D(null, null);
        this.direction = null;

        this.status = null;
        this.action = null;
        this.input = null;

        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            a: false,
            b: false
        };
        this.keysHistory = [];

        this.gravity = config.gravity;
        this.moveForwardXSpeed = config.moveForwardXSpeed;
        this.moveBackwardXSpeed = config.moveBackwardXSpeed;
        this.forwardJumpXSpeed = config.forwardJumpXSpeed;
        this.backJumpXSpeed = config.backJumpXSpeed;
        this.jumpHeight = config.jumpHeight;

        this.moveX = game => {
            this.speed.x = 0;
            
            var direction = this.direction ? 1 : -1;
            if (this.action === "moveForward") this.speed.x = direction * this.moveForwardXSpeed;
            else if (this.action === "moveBackward") this.speed.x = direction * this.moveBackwardXSpeed;
            else if (this.action === "forwardJump") this.speed.x = direction * this.forwardJumpXSpeed;
            else if (this.action === "backJump") this.speed.x = direction * this.backJumpXSpeed;

            var newPos = new Vector2D(this.pos.x + this.speed.x, this.pos.y);

            var obstacle = game.obstacleAt(newPos, this.size);
            var player = game.playerAt(this.id, newPos, this.size);
            if (!obstacle) {
                if (player) {
                    var obstaclePlayerLeft = game.obstacleAt(new Vector2D(player.pos.x - 1, player.pos.y), player.size);
                    var obstaclePlayerRight = game.obstacleAt(new Vector2D(player.pos.x + 1, player.pos.y), player.size);
                    if (!obstaclePlayerLeft && !obstaclePlayerRight) {
                        var playerNewPos = player.pos.x;
                        if (util.is(player.action, ["idle"]) && util.is(this.action, ["moveForward", "moveBackward"])) {
                            if (this.pos.x + this.size.x / 2 <= player.pos.x + player.size.x / 2) playerNewPos = newPos.x + this.size.x;
                            if (this.pos.x + this.size.x / 2 > player.pos.x + player.size.x / 2) playerNewPos = newPos.x - player.size.x;
                        }
                        else if (util.is("idle", [player.action, this.action])) {
                            //same push
                        }
                        if (!game.obstacleAt(new Vector2D(playerNewPos, player.pos.y), player.size)) {
                            this.pos = newPos;
                            player.pos.x = playerNewPos;
                        } else {
                            if (player.pos.x < config.gameWidth / 2) {
                                player.pos.x = 0;
                                this.pos.x = player.size.x;
                            } else {
                                player.pos.x = config.gameWidth - player.size.x;
                                this.pos.x = config.gameWidth - player.size.x - this.size.x;
                            }
                        }
                    }
                    if (player.pos.x === 0 && this.pos.x + this.xSpeed > player.size.x) {
                        this.pos.x = player.size.x;
                    } else if (player.pos.x === config.gameWidth - player.size.x && this.pos.x + this.size.x - this.xSpeed < player.pos.x) {
                        this.pos.x = player.pos.x - this.size.x;
                    }
                } else this.pos = newPos;
            } else {
                if (this.pos.x < config.gameWidth / 2) this.pos.x = 0;
                else this.pos.x = config.gameWidth - this.size.x;
                if (player && player.pos.x === 0) this.pos.x++;
                else if (player && player.pos.x + player.size.x === config.gameWidth) this.pos.x--;
            }
        }

        this.moveY = game => {
            this.speed.y += this.gravity;

            if (util.is(this.input, ["neutralJump", "forwardJump", "backJump"])) this.speed.y += this.jumpHeight;

            var newPos = new Vector2D(this.pos.x, this.pos.y + this.speed.y);

            var obstacle = game.obstacleAt(newPos, this.size);
            if (!obstacle) this.pos = newPos;
            else {
                this.speed.y = 0;
                if (this.pos.y + this.size.y < config.gameHeight)
                    while (this.pos.y % 16 !== 0) this.pos.y++;
                if (util.is(this.action, ["forwardJump", "backJump", "neutralJump"])) this.action = "idle";
            }
        }

        this.updateKeysHistory = () => {
            if (this.keys.left && this.keys.right) {
                this.keys.left = false;
                this.keys.right = false;
            }
            if (this.keys.up && this.keys.down) {
                this.keys.down = false;
                this.keys.up = false;
            }

            if (this.keysHistory.length > 0 && util.sameKeys(this.keys, this.keysHistory[this.keysHistory.length - 1].keys)) this.keysHistory[this.keysHistory.length - 1].frames++;
            else {
                if (this.keysHistory.length === 10) this.keysHistory.splice(0, 1);
                this.keysHistory.push({
                    keys: this.keys,
                    frames: 1
                });
            }
        }

        this.updateDirection = game => {
            if (this.role === "player1") {
                if (game.players.length === 1) this.direction = true;
                else {
                    if (game.players[1].pos.x + game.players[1].size.x / 2 > this.pos.x + this.size.x / 2) this.direction = true;
                    else this.direction = false;
                }
            } else {
                if (game.players[0].pos.x + game.players[0].size.x / 2 > this.pos.x + this.size.x / 2) this.direction = true;
                else this.direction = false;
            }
        }

        this.getPlayerInput = () => {
            if (util.is(this.role, ["player1", "player2"])) {
                if (this.keys.up && util.is(this.action, ["idle", "moveForward", "moveBackward"])) {
                    if (this.keys.left && !this.direction || this.keys.right && this.direction) this.input = "forwardJump";
                    else if (this.keys.left && this.direction || this.keys.right && !this.direction) this.input = "backJump";
                    else this.input = "neutralJump";
                } else if ((this.keys.right && !this.keys.left && this.direction || this.keys.left && !this.keys.right && !this.direction) &&
                    util.is(this.action, ["idle", "moveForward", "moveBackward"])) this.input = "moveForward";
                else if ((this.keys.left && !this.keys.right && this.direction || this.keys.right && !this.keys.left && !this.direction) &&
                    util.is(this.action, ["idle", "moveForward", "moveBackward"])) this.input = "moveBackward";
                else if (util.is(this.action, ["moveForward", "moveBackward"])) this.input = "idle";
            }
        }

        this.play = game => {
            this.action = this.input ? this.input : this.action;

            if (!this.status) {
                if (util.is(this.action, ["idle", "moveForward", "moveBackward"])) {
                    this.updateDirection(game);
                    this.moveX(game);
                    this.moveY(game);
                } else if (util.is(this.action, ["forwardJump", "backJump", "neutralJump"])) {
                    this.moveX(game);
                    this.moveY(game);
                }
            }
        }

        this.spectate = game => {

        }

        this.act = game => {
            this.updateKeysHistory();
            this.getPlayerInput();
            util.is(this.role, ["player1", "player2"]) ? this.play(game) : this.spectate(game);
            this.input = null;
        }
    }
}
module.exports = Player;