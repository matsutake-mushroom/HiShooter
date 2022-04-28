import { Bullet } from "../weapon/Bullets";
export class Me {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.vx = 4;
        this.vy = 4;
        this.alive = true;
        this.width = 60;
        this.height = 20;
        this.life = 10;
        this.defaultBulletMaker = (objlist, subject)=>{
            objlist.push(new Bullet(subject.x + 61, subject.y + 10, 20, 0));
        };

        this.bulletMaker = this.defaultBulletMaker;
        this.img_me = img;
        this.timer = null;
        this.flashtimer = null;
        this.drawflag = true;
    }
    //c: context2d
    draw(c) {
        //console.log(this.drawflag);
        if(this.drawflag){
            c.drawImage(this.img_me, this.x, this.y, this.width, this.height);
        }else{
            ;
        }
    }
    update() {
        if (this.y + 20 > 120) {
            this.y = 80;
            this.addlife(-1);
        };
    }

    addlife(val) {
        this.life += val;

        if(val<0){
            clearTimeout(this.timer);
            clearTimeout(this.flashtimer);

            this.flashtimer = setInterval(()=>{
                this.drawflag = !(this.drawflag);
            }, 100);
            
            this.timer = setTimeout(()=>{
                clearInterval(this.flashtimer);
                this.drawflag = true;
                clearTimeout(this.timer);
            }, 1000)
            
        }

        /*
        if(this.life > 3){
            this.life = 3;
        }
        */
        if (this.life === 0) {
            this.alive = false;
        }
    }
}