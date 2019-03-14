var flipHorizontally = (context, around) => {
	context.translate(around, 0);
	context.scale(-1, 1);
	context.translate(-around, 0);
}

class CanvasDisplay {
    constructor(parent) {
        this.data = global.gameData;
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", { alpha: false });
        this.cx.imageSmoothingEnabled = false;
        this.animationTime = 0;
        this.canvas.width = global.screenWidth;
        this.canvas.height = global.screenHeight;
        parent.appendChild(this.canvas);

        this.drawBackground = () => {
            this.cx.fillStyle = '#033';
            this.cx.fillRect(0, 0, global.screenWidth, global.screenHeight);
            for (let x = 0; x < this.canvas.width; x += 32) {
                for (let y = 0; y < this.canvas.height; y += 32) {
                    this.cx.strokeStyle = "lime";
                    this.cx.strokeRect(x, y, 32, 32);
                }
            }
        }

        this.drawPlayers = () => {
            this.data.players.forEach(player => {
			    var playerSprite = document.createElement("img");
                playerSprite.src = "img/player.png";

                this.cx.save();
	            if (!player.direction) flipHorizontally(this.cx, player.pos.x + player.size.x / 2);
                
                this.cx.drawImage(playerSprite,
                    0, 0, player.size.x, player.size.y,
                    player.pos.x, player.pos.y, player.size.x, player.size.y);
                
                this.cx.restore();
            });
        }

        this.drawGameStatus = () => {
            if (global.died) {
                this.cx.fillStyle = "#333333";
                this.cx.fillRect(0, 0, global.screenWidth, global.screenHeight);

                this.cx.textAlign = "center";
                this.cx.fillStyle = "#FFFFFF";
                this.cx.font = "bold 30px sans-serif";
                this.cx.fillText(
                    "You died!",
                    global.screenWidth / 2,
                    global.screenHeight / 2
                );
            } else if (!global.disconnected) {
                if (!global.gameStart) {
                    this.cx.fillStyle = "#333333";
                    this.cx.fillRect(0, 0, global.screenWidth, global.screenHeight);

                    this.cx.textAlign = "center";
                    this.cx.fillStyle = "#FFFFFF";
                    this.cx.font = "bold 30px sans-serif";
                    this.cx.fillText(
                        "Game Over!",
                        global.screenWidth / 2,
                        global.screenHeight / 2
                    );
                }
            } else {
                this.cx.fillStyle = "#333333";
                this.cx.fillRect(0, 0, global.screenWidth, global.screenHeight);

                this.cx.textAlign = "center";
                this.cx.fillStyle = "#FFFFFF";
                this.cx.font = "bold 30px sans-serif";
                if (global.kicked) {
                    this.cx.fillText(
                        "You were kicked!",
                        global.screenWidth / 2,
                        global.screenHeight / 2
                    );
                } else {
                    this.cx.fillText(
                        "Disconnected!",
                        global.screenWidth / 2,
                        global.screenHeight / 2
                    );
                }
            }
        }

        this.drawFrame = (newData, step) => {
            this.data = newData;
            this.animationTime += step;
            this.drawBackground();
            this.drawPlayers();
            this.drawGameStatus();
        };
    }
}