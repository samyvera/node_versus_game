var flipHorizontally = (context, around) => {
    context.translate(around, 0);
    context.scale(-1, 1);
    context.translate(-around, 0);
}

class CanvasDisplay {
    constructor(parent) {
        this.canvas = document.createElement('canvas');
        this.cx = this.canvas.getContext("2d", {
            alpha: false
        });
        this.zoom = 1;
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

        this.debugPlayers = () => {
            this.data.players.forEach(player => {
                if (player.role === "player1" || player.role === "player2") {

                    this.cx.save();
                    if (!player.direction) flipHorizontally(this.cx, player.pos.x + player.size.x / 2);

                    this.cx.fillStyle = "rgba(0, 0, 255, 0.5)";
                    this.cx.fillRect(player.pos.x, player.pos.y, player.size.x, player.size.y);

                    this.cx.restore();

                    this.cx.textAlign = "center";
                    this.cx.fillStyle = "#fff";
                    this.cx.font = "12px consolas";
                    this.cx.fillText(
                        "x:" + player.pos.x + " y:" + player.pos.y,
                        player.pos.x + player.size.x / 2,
                        player.pos.y - 6
                    );
                    this.cx.fillText(
                        "action:" + player.action,
                        player.pos.x + player.size.x / 2,
                        player.pos.y - 18
                    );

                    if (player.role === "player1" || player.role === "player2") {
                        var posInputX;
                        var posInputY;
                        if (player.role === "player1") {
                            posInputX = 0;
                            posInputY = 48;
                        } else {
                            posInputX = 544;
                            posInputY = 48;
                        }

                        this.cx.fillStyle = "rgba(0, 0, 0, 0.5)";
                        this.cx.fillRect(posInputX, posInputY, 96, player.keysHistory.length * 16);

                        player.keysHistory.forEach((keys, nb) => {
                            var arrow = [1, 1];
                            if (keys.keys.right && keys.keys.up) arrow = [2, 0];
                            else if (keys.keys.right && keys.keys.down) arrow = [2, 2];
                            else if (keys.keys.left && keys.keys.down) arrow = [0, 2];
                            else if (keys.keys.left && keys.keys.up) arrow = [0, 0];
                            else if (keys.keys.up) arrow = [1, 0];
                            else if (keys.keys.right) arrow = [2, 1];
                            else if (keys.keys.down) arrow = [1, 2];
                            else if (keys.keys.left) arrow = [0, 1];

                            var aButton = keys.keys.a ? 1 : 0;
                            var bButton = keys.keys.b ? 1 : 0;

                            var arrowImg = document.createElement("img");
                            arrowImg.src = "img/arrows.png";
                            this.cx.drawImage(arrowImg,
                                16 * arrow[0], 16 * arrow[1], 16, 16,
                                posInputX, posInputY + 16 * nb, 16, 16);

                            var aButtonImg = document.createElement("img");
                            aButtonImg.src = "img/a-button.png";
                            this.cx.drawImage(aButtonImg,
                                16 * aButton, 0, 16, 16,
                                posInputX + 16, posInputY + 16 * nb, 16, 16);

                            var bButtonImg = document.createElement("img");
                            bButtonImg.src = "img/b-button.png";
                            this.cx.drawImage(bButtonImg,
                                16 * bButton, 0, 16, 16,
                                posInputX + 32, posInputY + 16 * nb, 16, 16);

                            var onesImg = document.createElement("img");
                            onesImg.src = "img/numbers.png";
                            var frame = keys.frames > 999 ? "999" : keys.frames.toString();
                            for (let i = 0; i < frame.length; i++) {
                                this.cx.drawImage(onesImg,
                                    10 * frame[i], 0, 10, 16,
                                    posInputX + 64 + i * 10, posInputY + 16 * nb, 10, 16);
                            }
                        });
                    }
                }
            });

            var col = this.data.collision;
            if (col) {
                this.cx.fillStyle = "rgba(255, 0, 0, 0.5)";
                this.cx.fillRect(col.pos.x, col.pos.y, col.size.x, col.size.y);
            }
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
            this.debugPlayers();
            this.drawGameStatus();
        };
    }
}