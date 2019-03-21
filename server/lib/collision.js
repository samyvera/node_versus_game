var Vector2D = require('./vector2D');

class Collision {
    constructor(actorA, actorB) {
        this.actorA = actorA;
        this.actorB = actorB;
        this.pos = new Vector2D(null, null);
        this.size = new Vector2D(null, null);
        this.getCollision = (r1, r2) => {
            [r1, r2] = [r1, r2].map(r => new Vector2D([r.x1, r.x2].sort(), [r.y1, r.y2].sort()));
            if(!(r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] || r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0])) {
                this.pos.x = Math.max(r1.x[0], r2.x[0]),
                this.pos.y =  Math.max(r1.y[0], r2.y[0]),
                this.size.x = Math.min(r1.x[1], r2.x[1]) - this.pos.x,
                this.size.y = Math.min(r1.y[1], r2.y[1]) - this.pos.y
            }
        };
        this.getCollision(
            {
                x1:this.actorA.pos.x,
                x2:this.actorA.pos.x + this.actorA.size.x,
                y1:this.actorA.pos.y,
                y2:this.actorA.pos.y + this.actorA.size.y,
            },
            {
                x1:this.actorB.pos.x,
                x2:this.actorB.pos.x + this.actorB.size.x,
                y1:this.actorB.pos.y,
                y2:this.actorB.pos.y + this.actorB.size.y,
            }
        );
    }
}
module.exports = Collision;