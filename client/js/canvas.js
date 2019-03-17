var flipHorizontally = (context, around) => {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

class CanvasDisplay {
    constructor(parent) {
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", { alpha: false });
        this.zoom = 2;
        this.animationTime = 0;
        this.canvas.width = global.screenWidth * this.zoom;
        this.canvas.height = global.screenHeight * this.zoom;
        parent.appendChild(this.canvas);
        this.cx.scale(this.zoom, this.zoom);
        this.cx.imageSmoothingEnabled = false;
        this.data = global.gameData;

        this.drawBackground = () => {
            var back = document.createElement("img");
            back.src = "img/background.png";

            this.cx.drawImage(back,
                0, 0, this.canvas.width, this.canvas.height,
                0, 0, this.canvas.width, this.canvas.height);
        }

        this.drawPlayers = () => {
            this.data.players.forEach(player => {
                if (player.role === "player1" || player.role === "player2") {

                    this.cx.save();
                    if (!player.direction) flipHorizontally(this.cx, player.pos.x + player.size.x / 2);

                    this.cx.fillStyle = "rgba(0, 0, 255, 0.5)";
                    this.cx.fillRect(player.pos.x, player.pos.y,player.size.x, player.size.y);

                    this.cx.restore();

                    this.cx.textAlign = "center";
                    this.cx.fillStyle = "#fff";
                    this.cx.font = "18px consolas";
                    this.cx.fillText(
                        player.pos.x,
                        player.pos.x + player.size.x/2,
                        player.pos.y + player.size.y/2
                    );


                    if (player.role === "player1") {
                        player.keysHistory.forEach((keys, nb1) => {
                            this.cx.fillText(
                                keys.frames,
                                128,
                                80 + 18 * nb1
                            );
                        });
                    }
                }
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