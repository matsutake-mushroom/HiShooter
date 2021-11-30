class HiddenCmd {
    #cmd = []
    #func = function () { };
    #itr = 0;
    #isOnce = false;

    constructor(cmd, func, onlyOnce) {
        this.#cmd = cmd;
        this.#func = func;
        this.#isOnce = onlyOnce;
        this.onKeyDown = this.onKeyDown.bind(this);

        window.addEventListener("keydown", this.onKeyDown, true);
    }

    onKeyDown(e) {
        var keyCode = (window.event) ? e.which : e.keyCode;
        if (this.#cmd[this.#itr] === keyCode) {
            this.#itr++;
        } else {
            this.#itr = 0;
        }

        if (this.#itr === this.#cmd.length) {
            this.#func();
            this.#itr = 0;
            if (this.#isOnce) {
                window.removeEventListener("keydown", this.onKeyDown, true);
            }
        }
    }
};
class Me {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.vx = 4;
        this.vy = 4;
        this.alive = true;
        this.width = 60;
        this.height = 20;
        this.life = 3;
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
        }
    }
    update() {
        if (this.y + 20 > 120) {
            this.y = 80;
            this.life--;
            console.log("ouch!!!!");
        };
    }

    addlife(val) {
        this.life += val;

        if(val<0){
            //clearTimeout(this.timer);
            //clearTimeout(this.flashtimer);

            this.flashtimer = setInterval(function(){
                this.drawflag = !(this.drawflag);
                console.log(this.drawflag);
            }, 100);
            /*
            this.timer = setTimeout(function(){
                clearInterval(this.flashtimer);
                //this.drawflag = true;
                clearTimeout(this.timer);
            }, 3000)
            */
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

class En1 {
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
        c.fillStyle = "gray";
        c.fill();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy + Math.sin(this.phase);
        this.phase += 0.1;
    }
}

class Bullet {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;

        this.lifetime = 20;

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
class Missle{
    constructor(x, y, vx, vy, life, tgt, bglist) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.alive = true;
        this.target = tgt;//target
        this.life = life;
        this.bglist = bglist;//to draw smoke
        this.dtheta = Math.PI/40;//10 degree per frame

        this.width = 12;
        this.height = 3;
        this.angle = Math.atan2(this.vy, this.vx);

        this.score = 1;
    }

    //c: context2d
    draw(c) {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.angle);
        //c.drawImage(image, -(this.width/2.0), -(this.height/2.0));
        c.rect(-this.width/2.0, -this.height/2.0, this.width, this.height);
        c.fillStyle = "gray";
        c.fill();
        c.restore();
    }
    update() {
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
class Cloud {
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
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}          

class Sand {
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
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Item3 {
    constructor(x, y, vx, vy, img) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.img = img;
    }

    //c: context2d
    draw(c) {
        c.drawImage(this.img, this.x, this.y, 12, 12);
    }

    effect(obj){
        obj.bulletMaker = (objlist, subject)=>{
            objlist.push(new Bullet(subject.x + 61, subject.y + 10, 8, 6));
            objlist.push(new Bullet(subject.x + 61, subject.y + 10, 10, 0));
            objlist.push(new Bullet(subject.x + 61, subject.y + 10, 8, -6));
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class ItemL {
    constructor(x, y, vx, vy, img) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.img = img;
    }

    //c: context2d
    draw(c) {
        c.drawImage(this.img, this.x, this.y, 12, 12);
    }

    effect(obj){
        obj.addlife(1);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class HiokiShooter {
    #canvas;
    #parent;
    #ctx;
    #score = 0;
    #highscore = 0;

    #gameId = 0;

    #now = Date.now();
    #then = Date.now();
    #fpsInterval = 20;//ms

    #keySet = new Set();
    #bullets = [];

    #img_me = new Image();
    #img_wasd = new Image();
    #img_sp = new Image();
    #img_item3 = new Image();
    #img_itemQ = new Image();
    #img_itemL = new Image();
    
    #clock = false;
    #secondClock = setInterval(()=>{
        this.#clock = !this.#clock;
    }, 500);

    constructor(parent) {
        var c = document.createElement("canvas");
        c.style.display = "none";
        parent.appendChild(c);

        this.#canvas = c;
        this.#parent = parent;
        this.#ctx = this.#canvas.getContext("2d");
        this.#ctx.canvas.width = parent.clientWidth;
        this.#ctx.canvas.height = 160;

        this.#img_me.src = "data:image/png;base64,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";
        this.#img_wasd.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAeCAYAAAC8AUekAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOBSURBVFhH1ZhLbExhFMdnvIZ6Jo2FeC6sBK2IVIhQQRCvRrUdkXhvGo1iYSGqWsQjZcVCCIOYTiSUHZqohNKNICSERCOSLoiIBkF1/P73oaPTmbm3/UT6T37Od747Z+Z83z33u6cCvVlBx3ZbtbW1JzAbbM+zRkB+SUlJg+3+Jyl5KHdcT+Lzd2Ce43ZbfRzbK2U0eXZzSyQS6adxNBodgl9mXUD42firHdeITO98XigUmu+M50AVCU+w3cBiyLOHZmQ6+RuwUINgMLgAcx7Cjj8LY/QBNZo8CT7ATI3FYiHsDDgEayiZ/tjx0AjGZDT54uLiD5jseDyuknnLUfge+wVmQhv+J6wxmS4bqR52wT3LCwTquCN7sI9s15z+RfL3QfV9XQ6JxzCzQfNGZTx5SkYPZTkl0iKfUnqH2cQiHso3KePJh8PhVhI/57iW8K+wCNW+UZnqbXKh2ZrwplVQwKJ6dHSaSF49ivsi8qO6np4+VvIkUInJ0dinNoJ2caXl+dN+0KLXW54/PWHhlW7y1zCPNSnfo1TX02A7qMW1TheP2gc7QOU2FyLgVdrkXJIvsJooR1pNnTPOKKfWXfmN1YJdNfuMldGiA4nJJ4kP5mPe8OV+HkbFjcbshXHwGUr5jo/YtKKNGMCRmuW47cQoNqVSHpUkMBizFY5ZE/50FBo58zdjq0G9jhcNhSZQWZ0ihyaohoG62FnpzvkpoN5kOMGjrBnvatM/nPkt7N5zsF5YHvWVRVcQsw6rk2wSqN1IUrrkl4H6Ez1MyzXhQxfhAIveDYPsKf9i8d9YwDaGhSope7ZDXSbPD6pkloDaWj0cOwlO+3wkil1TczYZdJq94Psmar6bUtI/7eHfSrXza6GBVdfDbcaveZB8/RWkhw0OMzwO+j7f0t8B/G4hw5fchR/2bIdSJb8ILhFwSzA+CKW64EXsdBkUgcpNvf0z64I3ZZFwLrErsGfwVQFV1pVOSkqeoGGYy+x44gtLvfhNe5hZxD7FjIQxUMMduKp5D2qFGpgOY+EsFBH/CpukpDrW7cbojftHzH3HXLC9zOJu3cUIX3JK47TtZVZie6AXkZ8f1BtWLzG3PdDuum1vuoavLxwBtz1YCichXUyiFJPDhha4yet/vNRj+JUS0Fmsxizu4EUqVzVmWrQWr7iuktf7oh1+gT6jUlRsI8lXYHurAoHf1F4jJvEFu7IAAAAASUVORK5CYII=";
        this.#img_sp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAeCAYAAAC8AUekAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKcSURBVFhH7Za5a1RRFMbfmxmYLohBEI0QsFA7QYTEQgRx6azeLPiwEIQ0+icoKrhgYSUIGquJszWmcitcCiPYaBOXTpzGIiJ2yiz+vpt7n5nJTDIWMi/4PvjmnHfOmfu+OXeZ6yVIkCBBgvXgWxuhVCpNZDKZadwAyk4oPkLUxUKhINuFLvG1Wm263W6/wjVfaDabC2EYNkxyRKhUKmqiYSqVOpDL5RZMAkTinfDegrign76UyYA4CxekS/qkU0tbMSPeTk09rsIdrL663ZNeRh/AiF92+4MfeALzYPnJ+9rpdG6l0+mXdOIKzNKVfcQ/wUv4D8mfgddMtY2z6ebK5fJR/Pu+74+7OPUNxpjF3+liqsX2g3QavW7ZBG43I3KPiazGfhhS58OtxWLxcqvVyiLQ5+U34TiC7lET0KFv+Xz+uq31qTlL/DBjT1EzQ63EKbcL0YuMUyB/YUVtMEiHDhGM6Xy05h0Y4L11e/GGge8yqARGQMwHvjMnweRfwCV1VzMFOyJl86olN4ZJYZ/qWWAJjDHGEdySavEf409Ss8MU9MCefn/W/DBA4DzLZDuDf6xWq5/hOZuKQEez5DfhHoKnEHBM3cTXklsL71yt5V5m9onNDcTQ4gV1F3F3cK8y3ZOK8dLddOwkR9lm/ClCafhcltov5DT9IdQs/cC0seq0ActAMeG4tUPDiW+448e+bBWI1zStiF5C5AyhR8zET4Rk8S/a+Gn8ukRjf8FF+IznbeS+09HX2NvUntdY8C25LdTcIH7QxkR3MKwPiiVMO/ivYNd21x7415BO6ZXvOu+On42A6Fg34u3xE+gvWM9xhdUXHesb+m6z5q3S/cJRoed6PvhWuRJ28zqOEvpDkthYXM8TJEjwf8LzfgOsaX3b3tNf7QAAAABJRU5ErkJggg==";
        this.#img_item3.src = "data:image/png;base64,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";
        this.#img_itemQ.src = "data:image/png;base64,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";
        this.#img_itemL.src = " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADbUExURQAAAFhYWFhYWFhYWFRUY1hYWFhYWP93tFhYWKSkpP93tKqqqv93tKioqKenp/93tP93tP93tKmpqehzqKioqKenp/B0rPJ1raioqPN1rf93tP93tP53tP53s/53tP53s/53s/53s/53s/13s/13s/13s/13s/13s/13s/13s/13s/t2sv13s/x3s/13s/13s/13s/13s/53s/53s/53s/53tP93tKamp6enp6enqKioqKioqaipqampqamqqqqqqqurq+15rfx4tPx5s/12s/14tP53s/53tP93tEafYvwAAAA3dFJOUwADBAYLCwwTFRwtOUlVcXp+gY6fqsbe3+Pm5ufo6urr7O3u7/Dx8vP09fb39/j4+fr7/P3+/v772edkAAADoUlEQVR42u2baXPTMBCGxVHABBkwMghTWpIeOTAOcZoC5ihnq///i6AdYNZXdHhXmmF4v8V2Zh9Jq5Ut7TLWUsSTVMoKW1IkPGJaRTG+aSDBNeZFRS4RBTV/hdBjn8vKlzoHIqk8KmnbF5VXtYYhrTwrDdr+Vh8kVQABP+DN7olHBjHLThHnoncuGEeKoar3tIy6HIDQfCvW/XaDCF6LGbFiaC1qdQBn5OKtLvDZ/mYfRHUiwbxI1FssmkNCLuB0svYrYcx7F0RwBHzZh43mIDYIbwBg6UtAd3B/ADFYFGUIgBHwQu9zoO4EEIB5FLBqBZBdKQjApFgrqNVR5hFgulFdWmZ+ABaqXzN6gEO1XUtigJXSKqcEUEaakAEoQzU6IZvMlq8Xu8MBlLEK8K/879XNeBiAstAfX8zK2uXTvQEAaxsAddzzn9wZYK7sdBmwuq6vXQEs7auyt8vcANYKTy4AmVKUBHqAXJESdAF8HuQBlgRdAJ9qT1wgA6y0AGcf4AM3sXtAHekAPr6DDzw6V6SD0AXwFty/e/odewzUXAfwBty//+TiB2kXdDkhBHj4+PwrOsALC4AHTxX6EPyK1duH4D24f+/lF6Uox0AXiG6/+kYAsLsd4IwyEDZfDbRrAQnAxgJgQUJgATANDfCcBCAzB8hCA7D/AGVogFlogCzwNKRxgmAfJk4ABLGwtAIgcIJD2o/TwS8kTYAC2/6JJQD6GOzZ7pD4fi2vbHZIHTSm3aSy/Do1AyioBoBgn1CrG04AeF5wQLxVq9PMda94jGN/6b5bXiIvQvbnBbgfRA4A+xTblFZHNgWFfatDqzWBfbtTs0H2b2GcG+LbtwTYQQuArienB1gB0PnseO5kf4F4eO0yGXPU0/MVqn2X/IGNpf01egIDSgAalEHh/gqKlcLhfkCClUOCNQDuSSymnniNCoCdGNmfkqXxmC3OK0YIYBKRGCmAPiozYgDd5g0jB2B3ttnf8QDArg9s/2CA3pC0Yb4AmOv8awNIx4TGjo+2Y5esVgAwskuGyq1eAOriIKMydc7rnvTtQtoACJDWm1pnhC26duJNJEBaLx+U1ZrtHxVluXjmnMvGoT94y2xOao2WIZPbL9sch0zv53Ue/wUOTaAwJR7Bi1yCl/mwSOpK8UjMg+WPtypDOX6p1yhO+8seQxe7hS/3C1/wGL7kM3zRa3su0Ely/SrxD9de60ItJ2WQsUkBPk8EQfW/TDvL/38C8eliQ4rCzPkAAAAASUVORK5CYII=";

        //bind public functions
        this.start = this.start.bind(this);
        this.startScene = this.startScene.bind(this);
        this.gameloop = this.gameloop.bind(this);
        this.gameOverScene = this.gameOverScene.bind(this);

        window.addEventListener("keydown", this.#keydown.bind(this));
        window.addEventListener("keyup", this.#keyup.bind(this));
        window.addEventListener("resize", this.#resize.bind(this));
    }

    #keydown(e) {
        var key = (window.event) ? e.which : e.keyCode;
        this.#keySet.add(key);
    }

    #keyup(e) {
        var key = (window.event) ? e.which : e.keyCode;
        this.#keySet.delete(key);
    }
    #resize(e) {
        this.#ctx.canvas.width = this.#parent.clientWidth;
    }

    start() {
        this.#canvas.style.display = "block";//show
        
        //generate initial objects
        for(var i=0; i<100; ++i){
        var roll = Math.floor(Math.random() * 100);//0-99
        if (roll % 40 == 0) {
            this.#bgObjects.push(new Cloud(Math.random() * this.#canvas.width, 20 + Math.random() * 20));
        }
        if (roll % 3 == 0) {
            this.#bgObjects.push(new Sand(Math.random() * this.#canvas.width, 120 + Math.random() * 30));
        }
        }
        this.#gameId = window.requestAnimationFrame(this.startScene);
    }

    startScene() {
        

        if (this.#keySet.has(32)) {//spacekey pressed
            window.cancelAnimationFrame(this.#gameId);
            //init
            this.#mainObjects.push(this.#me);

            this.#gameId = window.requestAnimationFrame(this.gameloop);
        } else {
            this.#now = Date.now();
            if (this.#now - this.#then > this.#fpsInterval) {
                this.#then = new Date(this.#now);
                this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
                this.#drawTitle();
            }
            this.#gameId = window.requestAnimationFrame(this.startScene);
        }
    }

    gameOverScene(){
        if (this.#keySet.has(82)) {//r pressed
            //destruct
            this.#mainObjects = [];
            this.#itemObjects = [];
            this.#bullets = [];
            this.#me = new Me(10, 70, this.#img_me);
            this.#gameId = window.requestAnimationFrame(this.startScene);
        } else {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.#ctx.fillStyle = "gray";
            this.#ctx.font = "14px Arial";
            this.#ctx.fillText("GAME OVER", 100, 100);
            this.#ctx.font = "12px Arial";
            this.#ctx.fillText("Press 'R' to restart.", 100, 120);
            this.#gameId = window.requestAnimationFrame(this.gameOverScene);
        }
    }

    #drawTitle() {
        this.#drawBackground();
        this.#ctx.font = "16px Arial";
        this.#ctx.fillText("HIOKI Shooter", 100, 60);
        if(this.#clock){
            this.#ctx.font = "10px Arial";
            this.#ctx.fillStyle = "#0095DD";
            this.#ctx.fillText("Press 'space' to start", 100, 80);
        }
        this.#ctx.font = "10px Arial";
        this.#ctx.fillStyle = "gray";
        this.#ctx.fillText("Ver 1.0.0  (c) 2022 T.M.", 100, 110);
    }

    #bgObjects = [];
    #me = new Me(10, 70, this.#img_me);
    #mainObjects = [];
    #itemObjects = [];

    #drawBackground() {
        //draw line
        this.#ctx.beginPath();
        this.#ctx.moveTo(0, 120);
        this.#ctx.lineTo(this.#parent.clientWidth, 120);
        this.#ctx.strokeStyle = '#777777';
        this.#ctx.stroke();

        //generate objects
        var roll = Math.floor(Math.random() * 100);//0-99
        if (roll % 40 == 0) {
            this.#bgObjects.push(new Cloud(this.#canvas.width, 20 + Math.random() * 20));
        }
        if (roll % 3 == 0) {
            this.#bgObjects.push(new Sand(this.#canvas.width, 120 + Math.random() * 30));
        }
        
        //draw and remove objects
        for (var i = 0; i < this.#bgObjects.length; i++) {
            var obj = this.#bgObjects[i];
            obj.draw(this.#ctx);
            obj.update();

            if (obj.x < -10) {
                this.#bgObjects.splice(i, 1);
                i--;
            }
        }
    }

    #drawInformation(){
        //life
        this.#ctx.font = "10px Arial";
        this.#ctx.fillStyle = "gray";
        //this.#ctx.fillText("LIFE: " + "◆".repeat(this.#me.life) + "◇".repeat(3 - this.#me.life), 10, 10);
        this.#ctx.fillText("LIFE: " + this.#me.life, 10, 10);
        //score
        this.#ctx.fillText(("SCORE: " + this.#score).padStart(5, '0'), 200, 10);

        //controll explanation
        this.#ctx.drawImage(this.#img_wasd, 10, 130);
        this.#ctx.font = "10px Arial";
        this.#ctx.fillStyle = "gray";
        this.#ctx.fillText(":move", 60, 150);

        this.#ctx.drawImage(this.#img_sp, 110, 130);
        this.#ctx.font = "10px Arial";
        this.#ctx.fillStyle = "gray";
        this.#ctx.fillText(":shoot", 160, 150);
    }

    #collisionDetect() {
        //bullet to object
        for (var i = 0; i < this.#bullets.length; ++i) {
            var b = this.#bullets[i];
            for (var j = 0; j < this.#mainObjects.length; ++j) {
                //bullet to object
                var collided = false;
                var o = this.#mainObjects[j];

                if(o.x > b.x + b.width || o.x + o.width < b.x || o.y > b.y + b.height || o.y + o.height < b.y){
                    ;//pass
                }else{
                    collided = true;
                }

                if(!collided){
                    //衝突範囲にあるか判定
                    var g_rect = {
                        x: o.x + o.width/2.0,
                        y: o.y + o.height/2.0,
                    }
                    var g_rect2 = {
                        x: g_rect.x + o.vx,
                        y: g_rect.y + o.vy,
                    }

                    var pn1 = o.vx * b.x + o.vy * b.y - (o.vx * g_rect.x + o.vy * g_rect.y);
                    var pn2 = o.vx * b.x + o.vy * b.y - (o.vx * g_rect2.x + o.vy * g_rect2.y);

                    if(pn1*pn2 < 0){
                        //相対速度へ変更->法線を求める
                        var v_vec = {
                            y: -(o.vx - b.vx),
                            x: o.vy - b.vy,
                        }
                        //正規化
                        var norm = Math.sqrt((v_vec.x)*(v_vec.x) + (v_vec.y)*(v_vec.y));
                        v_vec.x = v_vec.x/norm;
                        v_vec.y = v_vec.y/norm;

                        //長方形中央から同一直線上にない2頂点ベクトルを求める
                        var r_vec1 = {
                            x: o.width/2.0,
                            y: o.height/2.0,
                        }
                        var r_vec2 = {
                            x: o.width/2.0,
                            y: -(o.height/2.0),
                        }
                        //法線方向への正射影のうち大きい方を求める
                        var r_sweep = Math.max(Math.abs(v_vec.x * r_vec1.x + v_vec.y + r_vec1.y), Math.abs(v_vec.x * r_vec2.x + v_vec.y * r_vec2.y));
                        
                        //bulletの位置の法線方向成分を求める
                        var v_bullet = {
                            x: b.x - (o.x + o.width/2.0),
                            y: b.y - (o.y + o.height/2.0),
                        }
                        var h = Math.abs((v_bullet.x * v_vec.x) + (v_bullet.y * v_vec.y));

                        //debug//console.log("bullet " + i + ": item " + j + "::", r_sweep, h)
                        if (r_sweep > h) {
                            collided = true;
                        }
                    }
                }
                if(collided){
                    o.addlife(-1);
                    b.alive = false;
                }
            }
        }
        //me to object (i==0: me)
        for (var i = 1; i < this.#mainObjects.length; ++i){
            var o = this.#mainObjects[i];
            if(o.x > this.#me.x + this.#me.width || o.x + o.width < this.#me.x || o.y > this.#me.y + this.#me.height || o.y + o.height < this.#me.y){
                continue;
            }else{
                this.#me.addlife(-1);
                //o.addlife(-1);
                o.alive = false;
            }
        }
        //me to items
        for (var i = 0; i < this.#itemObjects.length; ++i){
            var o = this.#itemObjects[i];
            if(o.x > this.#me.x + this.#me.width || o.x + o.width < this.#me.x || o.y > this.#me.y + this.#me.height || o.y + o.height < this.#me.y ){
                continue;
            }else{
                o.effect(this.#me);
                this.#itemObjects.splice(i, 1);
                i--;
            }
        }
    }

    gameloop() {
        this.#now = Date.now();
        if (this.#now - this.#then > this.#fpsInterval) {
            this.#then = new Date(this.#now);

            //------
            // key event
            //------

            //a
            if (this.#keySet.has(65)) {
                this.#me.x -= this.#me.vx;
            }
            //w
            if (this.#keySet.has(87)) {
                this.#me.y -= this.#me.vy;
            }
            //d
            if (this.#keySet.has(68)) {
                this.#me.x += this.#me.vx;
            }
            //s
            if (this.#keySet.has(83)) {
                this.#me.y += this.#me.vy;
            }
            //space
            if (this.#keySet.has(32)) {
                this.#me.bulletMaker(this.#bullets, this.#me);
                //this.#bullets.push(new Bullet(this.#me.x + 61, this.#me.y + 10, 20, 0));
            }
            //e
            if (this.#keySet.has(69)) {
                this.#me.life = 5000;
            }
            //r
            if (this.#keySet.has(82)) {
                this.#mainObjects.push(new Missle(550, 50, 0, 3, 3, this.#me, this.#bgObjects));
            }


            //generate enemy
            var roll = Math.floor(Math.random() * 100);//0-99
            if (roll % 20 == 0) {
                this.#mainObjects.push(new En1(this.#canvas.width, Math.random() * 100, -20, 0));
            }

            //------
            // draw
            //------
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

            //background
            this.#drawBackground();

            //collision
            this.#collisionDetect();

            //UI
            this.#drawInformation();

            //------
            // update objects
            //------
            //objects
            for (var i = 0; i < this.#mainObjects.length; i++) {
                var mo = this.#mainObjects[i];

                mo.draw(this.#ctx);
                mo.update();

                if(i===0){//#me
                    if(mo.x < 0){
                        mo.x = 0;
                    }
                    if(mo.y < 0){
                        mo.y = 0;
                    }
                    if(mo.x > this.#canvas.length){
                        mo.x = this.#canvas.length - 10;
                    }
                }else{
                    if (!mo.alive || mo.x < -100 || mo.x > this.#parent.clientWidth || mo.y < -50 || mo.y > this.#parent.clientHeight){
                        if(!mo.alive){//when destroyed by user
                            this.#score += mo.score;

                            var roll = Math.floor(Math.random() * 100);//0-99
                            if (roll % 10 == 0) {
                                this.#itemObjects.push(new Item3(mo.x, mo.y, -1, 1, this.#img_item3));
                            }
                            if (roll % 17 == 0) {
                                this.#itemObjects.push(new ItemL(mo.x, mo.y, -1, 1, this.#img_itemL));
                            }

                        }
                        this.#mainObjects.splice(i, 1);
                        i--;
                    }
                }
            }
            //items
            for (var i = 0; i < this.#itemObjects.length; i++) {
                var io = this.#itemObjects[i];

                io.draw(this.#ctx);
                io.update();

                if (io.x > this.#parent.clientWidth || io.x < -10 || io.y < -10 || io.y > this.#parent.clientHeight) {
                    this.#itemObjects.splice(i, 1);
                    i--;
                }
            }

            //bullets
            for (var i = 0; i < this.#bullets.length; i++) {
                var b = this.#bullets[i];

                b.draw(this.#ctx);
                b.update();

                if (b.x > this.#parent.clientWidth || !b.alive) {
                    this.#bullets.splice(i, 1);
                    i--;
                }
            }

            
        }
        //detect gameover
        if(this.#me.life <= 0){
            window.cancelAnimationFrame(this.#gameId);
            this.#highscore = this.#score;
            this.#score = 0;
            this.#gameId = window.requestAnimationFrame(this.gameOverScene);
        }else{
            this.#gameId = window.requestAnimationFrame(this.gameloop);
        }
    }
};

const cmd = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

var game = new HiokiShooter(document.body);//document.getElementsByClassName("main-content")[0]);
let hc = new HiddenCmd(cmd, game.start, true);
