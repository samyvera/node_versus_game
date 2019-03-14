var config = require('../config.json');
class Game {
    constructor() {
        this.players = [];
        this.act = () => this.players.forEach(player => player.act(this));

        this.obstaclesAt = (pos, size) => {
            var xStart = pos.x;
            var xEnd = pos.x + size.x;
            var yStart = pos.y;
            var yEnd = pos.y + size.y;
            if (xStart < 0) {
                return true;
            }
            if (xEnd > config.gameWidth) {
                return true;
            }
            if (yStart < 0) {
                return false;
            }
            if (yEnd > config.gameHeight - 32) {
                return true;
            }
            return false;
            // var blocBuffer = null;
            // for (let x = xStart; x < xEnd; x++) {
            //     for (let y = yStart; y < yEnd; y++) {
            //         var bloc = this.layer1.get(x + ", " + y);
            //         if (bloc) {
            //             if (bloc.fieldType === "wood" || bloc.fieldType === "wood-left" || bloc.fieldType === "wood-right") {
            //                 blocBuffer = bloc;
            //             } else {
            //                 return bloc;
            //             }
            //         }
            //     }
            // }
            // return blocBuffer;
        }

        this.actorAt = (actor) => {
            let xStart = actor.pos.x;
            let xEnd = actor.pos.x + actor.size.x;
            let yStart = actor.pos.y;
            let yEnd = actor.pos.y + actor.size.y;
            var result = null;
            this.actors.forEach((other) => {
                let otherXStart = other.pos.x;
                let otherXEnd = other.pos.x + other.size.x;
                let otherYStart = other.pos.y;
                let otherYEnd = other.pos.y + other.size.y;
                if (other !== actor && !(otherXStart > xEnd || otherXEnd < xStart || otherYStart > yEnd || otherYEnd < yStart)) {
                    result = other;
                }
            });
            return result;
        }
    }
}

module.exports = Game;