import { Smoke } from "../background/objects";
export class Missle{
    constructor(x, y, vx, vy, life, tgt, go) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.target = tgt;//target
        this.life = life;
        this.bglist = go.manager_getItem("bglist");//to draw smoke
        this.dtheta = Math.PI/40;//10 degree per frame

        this.width = 1;
        this.height = 1;
        this.v_width = 14;
        this.v_height = 5;

        this.damage = 2;
        this.angle = Math.atan2(this.vy, this.vx);

        this.score = 1;
        this.restrictItemDrop = true;
    }

    //c: context2d
    draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        c.beginPath();
        //c.drawImage(image, -(this.width/2.0), -(this.height/2.0));
        c.rect(-this.v_width/2.0, -this.v_height/2.0, this.v_width, this.v_height);
        c.fillStyle = "#A19100";
        c.fill();
        c.closePath();
        c.restore();
    }
    #norm(a,b){
        return Math.sqrt(a*a + b*b);
    }
    update() {
        this.bglist.push(new Smoke(this.x - this.vx * this.v_width * 0.5 / this.#norm(this.vx,this.vy), this.y - this.vy * this.v_width * 0.5 / this.#norm(this.vx, this.vy), 4));
        this.x += this.vx;
        this.y += this.vy;
        
        var dx = (this.target.x + this.target.width/2.0) - (this.x + this.width/2.0);
        var dy = (this.target.y + this.target.height/2.0) - (this.y + this.height/2.0);

        var cos = (this.vx * dx + this.vy * dy)/(Math.sqrt(this.vx * this.vx + this.vy * this.vy) * Math.sqrt(dx*dx + dy*dy));
        if(cos < Math.cos(this.dtheta)){
            cos = Math.cos(this.dtheta);
        }
        var sin = Math.sqrt(1 - (cos*cos)) || 0;//たまにcos = 1.00000001みたいになる

        var new_vx = 0;
        var new_vy = 0;
        if(this.vx * dy - this.vy * dx > 0){//need rotate clock-wise
            new_vx = this.vx * cos - this.vy * sin;
            new_vy = this.vx * sin + this.vy * cos; 
        }else{
            new_vx = this.vx * cos + this.vy * sin;
            new_vy = -this.vx * sin + this.vy * cos;
        }
        
        this.vx = new_vx;
        this.vy = new_vy;
        this.angle = Math.atan2(this.vy, this.vx);
    }
    addlife(val){
        this.life += val;
        if (this.life === 0) {
            this.alive = false;
        }
    }
}