export class Bullet {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;

        this.lifetime = 20;
        this.damage = 1;

        this.height = 2;
        this.width = 2;
    }

    //c: context2d
    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.height, 0, 2 * Math.PI);
        c.fillStyle = "green";
        c.fill();
        c.lineWidth = 1;
        c.strokeStyle = "yellow";
        c.stroke();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        if(this.lifetime<0){
            this.alive = false;
        }
    }
}

export class Bullet_B1 {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;

        this.lifetime = 120;
        this.damage = 1;

        this.height = 2;
        this.width = 2;
    }

    //c: context2d
    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.height, 0, 2 * Math.PI);
        c.fillStyle = "red";
        c.fill();
        c.lineWidth = 1;
        c.strokeStyle = "yellow";
        c.stroke();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.lifetime--;
        if(this.lifetime<0){
            this.alive = false;
        }
    }
}