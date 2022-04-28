export class Cloud {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = -6;
        this.vy = 0;
    }

    //c: context2d
    draw(c){
        c.beginPath();
        c.arc(this.x, this.y, 6, Math.PI * 0.5, Math.PI * 1.5);
        c.arc(this.x + 7, this.y - 6, 7, Math.PI * 1, Math.PI * 1.85);
        c.arc(this.x + 15.2, this.y - 4.5, 5, Math.PI * 1.37, Math.PI * 1.91);
        c.arc(this.x + 20, this.y, 6, Math.PI * 1.5, Math.PI * 0.5);
        c.moveTo(this.x + 20, this.y + 6);
        c.lineTo(this.x, this.y + 6);
        c.strokeStyle = '#777777';
        c.stroke();
        c.closePath();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}          

export class Sand {
    constructor(x, y ) {
        this.x = x;
        this.y = y;
        this.vx = -6;
        this.vy = 0;
    }
    //c: context2d
    draw(c) {
        c.beginPath();
        c.rect(this.x, this.y, 1, 1);
        c.strokeStyle = '#777777';
        c.stroke();
        c.fillStyle = '#777777';
        c.fill();
        c.closePath();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

export class Smoke {
    constructor(x, y, r, dr=0.1) {
        this.x = x;
        this.y = y;
        this.radius = r;
        this.delta_r = dr;
        this.dispose = false;
    }
    //c: context2d
    draw(c) {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        c.strokeStyle = "#BABABA";
        c.stroke();
        c.fillStyle = "#BABABA";
        c.fill();
        c.closePath();
    }
    update() {
        this.radius -= this.delta_r;
        if(this.radius < 0){
            this.dispose = true;
        }
    }
}