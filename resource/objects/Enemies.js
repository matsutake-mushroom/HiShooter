export class En_sm {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.width = 10;
        this.height = 10;
        this.phase = 0;

        this.life = 2;
        this.alive = true;

        this.score = 5;
    }
    //c: context2d
    addlife(val) {
        this.life += val;
        if (this.life === 0) {
            this.alive = false;
        }
    }

    draw(c) {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = "#999999";
        c.fill();
        c.closePath();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy + Math.sin(this.phase);
        this.phase += 0.5;
    }
}
export class En_md {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.width = 20;
        this.height = 20;
        this.phase = 0;

        this.life = 5;
        this.alive = true;

        this.score = 10;
    }
    //c: context2d
    addlife(val) {
        this.life += val;
        if (this.life === 0) {
            this.alive = false;
        }
    }

    draw(c) {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = "#777777";
        c.fill();
        c.closePath();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy + Math.sin(this.phase);
        this.phase += 0.1;
    }
}