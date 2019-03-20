var config = require('../config.json');
var util = require('./lib/util');

class Player {
    constructor(id, role) {
        this.id = id;
        this.role = role;

        this.pos = { x:null, y:null };
        this.size = { x:config.defaultPlayerWidth, y:config.defaultPlayerHeight };
        this.speed = { x:null, y:null };
        this.direction = null;

        this.status = null;
        this.action = null;
        this.input = null;

        this.keys = { left:false, right:false, up:false, down:false, a:false, b:false };
        this.keysHistory = [];

        this.gravity = config.gravity;
        this.xSpeed = config.xSpeed;
        this.jumpHeight = config.jumpHeight;

        this.moveX = game => {
            this.speed.x = 0;
            if (this.action === "moveForward" && !this.direction || this.action === "moveBackward" && this.direction ||
                this.action === "forwardJump" && !this.direction || this.action === "backJump" && this.direction) this.speed.x = -this.xSpeed;
            if (this.action === "moveForward" && this.direction || this.action === "moveBackward" && !this.direction ||
                this.action === "forwardJump" && this.direction || this.action === "backJump" && !this.direction) this.speed.x = this.xSpeed;

            var newPos = {
                x: this.pos.x + this.speed.x,
                y: this.pos.y
            };

            var obstacle = game.obstacleAt(newPos, this.size);
            var player = game.playerAt(this.id, newPos, this.size);
            if (!obstacle) {
                if (player) {
                    var obstaclePlayerLeft = game.obstacleAt({ x:player.pos.x-1, y:player.pos.y }, player.size);
                    var obstaclePlayerRight = game.obstacleAt({ x:player.pos.x+1, y:player.pos.y }, player.size);
                    if (!obstaclePlayerLeft && !obstaclePlayerRight) {
                        var playerNewPos = player.pos.x;
                        if (player.action === null) {
                            if (this.action !== null) {
                                if (this.pos.x + this.size.x/2 < player.pos.x + player.size.x/2) playerNewPos += this.xSpeed;
                                else playerNewPos -= this.xSpeed;
                            }
                            else {
                                if (this.keys.right && this.pos.x + this.size.x/2 <= player.pos.x + player.size.x/2) playerNewPos = newPos.x + this.size.x;
                                if (this.keys.left && this.pos.x + this.size.x/2 > player.pos.x + player.size.x/2) playerNewPos = newPos.x - player.size.x;
                                if (!this.keys.right && this.pos.x + this.size.x - player.pos.x !== 0 && this.pos.x + this.size.x/2 <= player.pos.x + player.size.x/2) playerNewPos += this.xSpeed;
                                if (!this.keys.left && player.pos.x + player.size.x - this.pos.x !== 0 && this.pos.x + this.size.x/2 > player.pos.x + player.size.x/2) playerNewPos -= this.xSpeed;
                            }
                        }
                        if (!game.obstacleAt({ x:playerNewPos, y:player.pos.y }, player.size)) {
                            this.pos = newPos;
                            player.pos.x = playerNewPos;
                        }
                        else {
                            if (player.pos.x < config.gameWidth/2) {
                                player.pos.x = 0;
                                this.pos.x = player.size.x;
                            }
                            else {
                                player.pos.x = config.gameWidth - player.size.x;
                                this.pos.x = config.gameWidth - player.size.x - this.size.x;
                            }
                        }
                    }
                    if (player.pos.x === 0 && this.pos.x + this.xSpeed > player.size.x) {
                        this.pos.x = player.size.x;
                    }
                    else if (player.pos.x === config.gameWidth - player.size.x && this.pos.x + this.size.x - this.xSpeed < player.pos.x) {
                        this.pos.x = player.pos.x - this.size.x;
                    }
                }
                else this.pos = newPos;
            }
            else {
                if (this.pos.x < config.gameWidth/2) this.pos.x = 0;
                else this.pos.x = config.gameWidth - this.size.x;
                if (player && player.pos.x === 0) this.pos.x += this.xSpeed;
                else if (player && player.pos.x + player.size.x === config.gameWidth) this.pos.x -= this.xSpeed;
            }
        }

        this.moveY = game => {
            this.speed.y += this.gravity;

            if (this.input === "neutralJump" || this.input === "forwardJump" || this.input === "backJump") this.speed.y += this.jumpHeight;

            var newPos = {
                x: this.pos.x,
                y: this.pos.y + this.speed.y
            };

            var obstacle = game.obstacleAt(newPos, this.size);
            if (!obstacle) this.pos = newPos;
            else {
                this.speed.y = 0;
                if (this.pos.y + this.size.y < config.gameHeight)
                    while (this.pos.y % 16 !== 0) this.pos.y++;
                if (this.action === "forwardJump" || this.action === "backJump" || this.action === "neutralJump") this.action = "idle";
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

            if (this.keysHistory.length > 0 && util.sameKeys(this.keys, this.keysHistory[this.keysHistory.length-1].keys)) {
                this.keysHistory[this.keysHistory.length-1].frames++;
            }
            else {
                if (this.keysHistory.length === 10) this.keysHistory.splice(0, 1);
                this.keysHistory.push({ keys:this.keys, frames:1 });
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

        this.play = game => {

            if (this.keys.up && (this.action === "idle" || this.action === "moveForward" || this.action === "moveBackward")) {
                if (this.keys.left && !this.direction || this.keys.right && this.direction) this.input = "forwardJump";
                else if (this.keys.left && this.direction || this.keys.right && !this.direction) this.input = "backJump";
                else this.input = "neutralJump";
            }
            else if ((this.keys.right && !this.keys.left && this.direction || this.keys.left && !this.keys.right && !this.direction) &&
                    (this.action === "idle" || this.action === "moveForward" || this.action === "moveBackward")) this.input = "moveForward";
            else if ((this.keys.left && !this.keys.right && this.direction || this.keys.right && !this.keys.left && !this.direction) &&
                    (this.action === "idle" || this.action === "moveForward" || this.action === "moveBackward")) this.input = "moveBackward";
            else if (this.action === "moveForward" || this.action === "moveBackward") this.input = "idle";

            this.action = this.input ? this.input : this.action;

            if (!this.status) {
                if (this.action === "idle" || this.action === "moveForward" || this.action === "moveBackward") {
                    this.updateDirection(game);
                    this.moveX(game);
                    this.moveY(game);
                } else if (this.action === "forwardJump" || this.action === "backJump" || this.action === "neutralJump") {
                    this.moveX(game);
                    this.moveY(game);
                }
            }
        }

        this.spectate = game => {

        }

        this.act = game => {
            this.updateKeysHistory();
            if (this.role === "player1" || this.role === "player2") this.play(game);
            else this.spectate(game);
            this.input = null;
        }
    }
}

module.exports = Player;