var socket = io();

var setupSocket = socket => {
    socket.on("welcome", newPlayer => {
        socket.emit("gotit");
        global.player = newPlayer;
        global.gameStart = true;
    });

    socket.on("updateGame", newData => global.gameData = newData);

    socket.on("RIP", () => {
        global.gameStart = false;
        global.died = true;
    });

    socket.on("connect_failed", () => {
        socket.close();
        global.disconnected = true;
    });

    socket.on("disconnect", () => {
        socket.close();
        global.disconnected = true;
    });
}

var trackKeys = (socket, codes) => {
    var pressed = new Map();
    codes.forEach(code => pressed.set(code, false));
    var handler = event => {
        if (codes.get(event.keyCode) !== undefined) {
            var down = event.type === "keydown";
            pressed.set(codes.get(event.keyCode), down);
            event.preventDefault();
        }
        var obj = {};
        pressed.forEach ((v,k) => { obj[k] = v });
        socket.emit('inputs', obj);
    };
    addEventListener("keydown", handler);
    addEventListener("keyup", handler);
};

trackKeys(socket, global.arrowCodes);

var runAnimation = display => {
    var lastTime = null;
    var frame = time => {
        if (lastTime !== null) display.drawFrame(global.gameData, Math.min(time - lastTime, 100) / 1000);
        lastTime = time;
        requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};

var startGame = () => {
    runAnimation(new CanvasDisplay(document.body));
    socket.emit("spawn", global.defaultPlayerName);
    setupSocket(socket);
}

window.onload = () => startGame();