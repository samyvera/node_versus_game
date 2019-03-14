var global = {

    arrowCodes: new Map([
        [37, "left"],
        [38, "up"],
        [39, "right"],
        [40, "down"],
        [81, "a"],
        [83, "b"]
    ]),

    defaultPlayerName: "Joe",
    screenWidth: 640,
    screenHeight: 384,
    gameStart: false,
    disconnected: false,
    died: false,
    kicked: false,
    continuity: false,
    startPingTime: 0,

    gameData: {
        players: []
    }
};
