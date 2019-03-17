var global = {

    arrowCodes: new Map([
        [81, "left"],
        [90, "up"],
        [68, "right"],
        [83, "down"],
        [79, "a"],
        [80, "b"]
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
