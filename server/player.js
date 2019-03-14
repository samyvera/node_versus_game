var config = require('../config.json');
class Player {
    constructor(id, pos, size, speed, direction, keys) {
        this.id = id;

        this.pos = pos;
        this.size = size;
        this.speed = { x:0, y:0 };
        this.direction = direction;

        this.status = null;
        this.action = null;

        this.keys = keys;
        this.gravity = config.gravity;
        this.xSpeed = config.xSpeed;
        this.jumpHeight = config.jumpHeight;

        this.moveX = game => {
            this.speed.x = 0;
            if (this.keys.left && !this.keys.right && this.action === null ||
                this.action === "forwardJump" && !this.direction || this.action === "backJump" && this.direction) this.speed.x = -this.xSpeed;
            if (this.keys.right && !this.keys.left && this.action === null ||
                this.action === "forwardJump" && this.direction || this.action === "backJump" && !this.direction) this.speed.x = this.xSpeed;

            var newPos = { x:this.pos.x + this.speed.x, y:this.pos.y };
            var obstacles = game.obstaclesAt(newPos, this.size);
            if (!obstacles) this.pos = newPos;
        }

        this.moveY = game => {
            this.speed.y += this.gravity;
            
            if (this.keys.up && this.action === null) {
                this.speed.y += this.jumpHeight;

                if (this.keys.left && !this.direction || this.keys.right && this.direction) this.action = "forwardJump";
                else if (this.keys.left && this.direction || this.keys.right && !this.direction) this.action = "backJump";
                else this.action = "neutralJump";
            }

            var newPos = { x:this.pos.x, y:this.pos.y + this.speed.y };
            var obstacles = game.obstaclesAt(newPos, this.size);
            if (!obstacles) this.pos = newPos;
            else {
                this.speed.y = 0;
                if (this.pos.y + this.size.y < config.gameHeight) while (this.pos.y % 16 !== 0) this.pos.y++;
                if (this.action === "forwardJump" || this.action === "backJump" || this.action === "neutralJump") this.action = null;
            }
        }

        this.act = game => {
            if (!this.status) {
                if (!this.action) {
                    this.moveX(game);
                    this.moveY(game);
                }
                else if (this.action === "forwardJump" || this.action === "backJump" || this.action === "neutralJump") {
                    this.moveX(game);
                    this.moveY(game);
                }
            }
        }
    }
}

module.exports = Player;