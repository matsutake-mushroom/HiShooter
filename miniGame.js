import { Me } from "./resource/objects/Me";
import { Missle } from "./resource/weapon/Missle";
import {En_sm, En_md} from "./resource/objects/Enemies";
import {Boss1, Boss2, LastBoss} from "./resource/objects/Boss";
import {Cloud, Sand} from "./resource/background/objects";
import {Item3, ItemL} from "./resource/Items";



export class HiokiShooter {
    #canvas;
    #parent;
    #ctx;
    #score = 0;
    #highscore = 0;

    #stage = "normal";
    #clearedStages = [];

    #gameId = 0;

    #now = Date.now();
    #then = Date.now();
    #fpsInterval = 20;//ms

    #keySet = new Set();
    #bullets = [];
    #bullets_en = [];

    #img_me = new Image();
    #img_wasd = new Image();
    #img_sp = new Image();
    #img_itemQ = new Image();
    
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
        var width = parent.clientWidth - 80;
        this.#ctx.canvas.width = (width > 200)?width:200;
        this.#ctx.canvas.height = 160;

        this.#img_me.src = "data:image/png;base64,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";
        this.#img_wasd.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAeCAYAAAC8AUekAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOBSURBVFhH1ZhLbExhFMdnvIZ6Jo2FeC6sBK2IVIhQQRCvRrUdkXhvGo1iYSGqWsQjZcVCCIOYTiSUHZqohNKNICSERCOSLoiIBkF1/P73oaPTmbm3/UT6T37Od747Z+Z83z33u6cCvVlBx3ZbtbW1JzAbbM+zRkB+SUlJg+3+Jyl5KHdcT+Lzd2Ce43ZbfRzbK2U0eXZzSyQS6adxNBodgl9mXUD42firHdeITO98XigUmu+M50AVCU+w3cBiyLOHZmQ6+RuwUINgMLgAcx7Cjj8LY/QBNZo8CT7ATI3FYiHsDDgEayiZ/tjx0AjGZDT54uLiD5jseDyuknnLUfge+wVmQhv+J6wxmS4bqR52wT3LCwTquCN7sI9s15z+RfL3QfV9XQ6JxzCzQfNGZTx5SkYPZTkl0iKfUnqH2cQiHso3KePJh8PhVhI/57iW8K+wCNW+UZnqbXKh2ZrwplVQwKJ6dHSaSF49ivsi8qO6np4+VvIkUInJ0dinNoJ2caXl+dN+0KLXW54/PWHhlW7y1zCPNSnfo1TX02A7qMW1TheP2gc7QOU2FyLgVdrkXJIvsJooR1pNnTPOKKfWXfmN1YJdNfuMldGiA4nJJ4kP5mPe8OV+HkbFjcbshXHwGUr5jo/YtKKNGMCRmuW47cQoNqVSHpUkMBizFY5ZE/50FBo58zdjq0G9jhcNhSZQWZ0ihyaohoG62FnpzvkpoN5kOMGjrBnvatM/nPkt7N5zsF5YHvWVRVcQsw6rk2wSqN1IUrrkl4H6Ez1MyzXhQxfhAIveDYPsKf9i8d9YwDaGhSope7ZDXSbPD6pkloDaWj0cOwlO+3wkil1TczYZdJq94Psmar6bUtI/7eHfSrXza6GBVdfDbcaveZB8/RWkhw0OMzwO+j7f0t8B/G4hw5fchR/2bIdSJb8ILhFwSzA+CKW64EXsdBkUgcpNvf0z64I3ZZFwLrErsGfwVQFV1pVOSkqeoGGYy+x44gtLvfhNe5hZxD7FjIQxUMMduKp5D2qFGpgOY+EsFBH/CpukpDrW7cbojftHzH3HXLC9zOJu3cUIX3JK47TtZVZie6AXkZ8f1BtWLzG3PdDuum1vuoavLxwBtz1YCichXUyiFJPDhha4yet/vNRj+JUS0Fmsxizu4EUqVzVmWrQWr7iuktf7oh1+gT6jUlRsI8lXYHurAoHf1F4jJvEFu7IAAAAASUVORK5CYII=";
        this.#img_sp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAeCAYAAAC8AUekAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKcSURBVFhH7Za5a1RRFMbfmxmYLohBEI0QsFA7QYTEQgRx6azeLPiwEIQ0+icoKrhgYSUIGquJszWmcitcCiPYaBOXTpzGIiJ2yiz+vpt7n5nJTDIWMi/4PvjmnHfOmfu+OXeZ6yVIkCBBgvXgWxuhVCpNZDKZadwAyk4oPkLUxUKhINuFLvG1Wm263W6/wjVfaDabC2EYNkxyRKhUKmqiYSqVOpDL5RZMAkTinfDegrign76UyYA4CxekS/qkU0tbMSPeTk09rsIdrL663ZNeRh/AiF92+4MfeALzYPnJ+9rpdG6l0+mXdOIKzNKVfcQ/wUv4D8mfgddMtY2z6ebK5fJR/Pu+74+7OPUNxpjF3+liqsX2g3QavW7ZBG43I3KPiazGfhhS58OtxWLxcqvVyiLQ5+U34TiC7lET0KFv+Xz+uq31qTlL/DBjT1EzQ63EKbcL0YuMUyB/YUVtMEiHDhGM6Xy05h0Y4L11e/GGge8yqARGQMwHvjMnweRfwCV1VzMFOyJl86olN4ZJYZ/qWWAJjDHGEdySavEf409Ss8MU9MCefn/W/DBA4DzLZDuDf6xWq5/hOZuKQEez5DfhHoKnEHBM3cTXklsL71yt5V5m9onNDcTQ4gV1F3F3cK8y3ZOK8dLddOwkR9lm/ClCafhcltov5DT9IdQs/cC0seq0ActAMeG4tUPDiW+448e+bBWI1zStiF5C5AyhR8zET4Rk8S/a+Gn8ukRjf8FF+IznbeS+09HX2NvUntdY8C25LdTcIH7QxkR3MKwPiiVMO/ivYNd21x7415BO6ZXvOu+On42A6Fg34u3xE+gvWM9xhdUXHesb+m6z5q3S/cJRoed6PvhWuRJ28zqOEvpDkthYXM8TJEjwf8LzfgOsaX3b3tNf7QAAAABJRU5ErkJggg==";
        this.#img_itemQ.src = "data:image/png;base64,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";
        
        //bind public functions
        this.start = this.start.bind(this);
        this.startScene = this.startScene.bind(this);
        this.changeStage = this.changeStage.bind(this);
        this.manager_addItem = this.addItem.bind(this);
        this.manager_getItem = this.getItem.bind(this);
        this.gameloop = this.gameloop.bind(this);
        this.gameOverScene = this.gameOverScene.bind(this);
        this.gameClearScene = this.gameClearScene.bind(this);

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
    
    addItem(type, obj){
        switch(type){
            case "bullet":
                this.#bullets.push(obj);
                break;
            case "bullet_en":
                this.#bullets_en.push(obj);
                break;
            case "main":
                this.#mainObjects.push(obj);
                break;
            case "item":
                this.#itemObjects.push(obj);
                break;
            case "bglist":
                this.#bgObjects.push(obj);
                break;
            default:
                break;
        }
    }
    getItem(type){
        switch(type){
            case "me":
                return this.#me;
            case "bglist":
                return this.#bgObjects;
            default:
                return null;
        }
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
        window.scrollTo(0, this.#canvas.getBoundingClientRect().y);
        this.#gameId = window.requestAnimationFrame(this.startScene);
    }

    startScene() {
        this.#stage = "normal";
        this.#clearedStages = [];

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
            this.#score = 0;
            this.#mainObjects = [];
            this.#itemObjects = [];
            this.#bullets = [];
            this.#bullets_en = [];
            this.#me = new Me(10, 70, this.#img_me);
            this.#gameId = window.requestAnimationFrame(this.startScene);
        } else {
            this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
            this.#ctx.fillStyle = "gray";
            this.#ctx.font = "14px Arial";
            this.#ctx.fillText("GAME OVER", 100, 80);
            this.#ctx.beginPath();
            this.#ctx.moveTo(100, 87);
            this.#ctx.lineTo(300, 87);
            this.#ctx.closePath();
            this.#ctx.strokeStyle = "lightgray";
            this.#ctx.stroke();

            this.#ctx.fillText("your score: " + this.#score, 100, 115);
            if(this.#score === this.#highscore && this.#score > 0){
                this.#ctx.fillStyle = "#0095DD";
                this.#ctx.font = "9px Arial";
                this.#ctx.fillText("NEW RECORD!!", 240, 115);
                this.#ctx.fillStyle = "gray"; 
            }
            if(this.#clock){
                this.#ctx.font = "12px Arial";
                this.#ctx.fillText("Press 'R' to restart.", 100, 130);
            }
            this.#gameId = window.requestAnimationFrame(this.gameOverScene);
        }
    }

    gameClearScene(){
        if (this.#keySet.has(82)) {//r pressed
            //destruct
            this.#score = 0;
            this.#mainObjects = [];
            this.#itemObjects = [];
            this.#bullets = [];
            this.#bullets_en = [];
            this.#me = new Me(10, 70, this.#img_me);
            this.#gameId = window.requestAnimationFrame(this.startScene);
        } else {
            this.#now = Date.now();
            if (this.#now - this.#then > this.#fpsInterval) {
                this.#then = new Date(this.#now);
            
                this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

                //background
                this.#me.life = 100;//keep
                var score = this.#score;
                this.#drawBackground();
                this.#collisionDetect();
                this.#updateObjects();
                this.#score = score;

                this.#ctx.font = "16px Arial";
                this.#ctx.fillStyle = "#0095DD";
                this.#ctx.fillText("Congratulations!!", 100, 60);
                this.#ctx.beginPath();
                this.#ctx.moveTo(100, 67);
                this.#ctx.lineTo(300, 67);
                this.#ctx.closePath();
                this.#ctx.strokeStyle = "#0095DD";
                this.#ctx.stroke();

                this.#ctx.fillStyle = "gray";
                this.#ctx.fillText("your score: " + this.#score, 100, 95);
                if(this.#score >= this.#highscore && this.#score > 0){
                    this.#ctx.fillStyle = "#0095DD";
                    this.#ctx.font = "9px Arial";
                    this.#ctx.fillText("NEW RECORD!!", 240, 95);
                    this.#ctx.fillStyle = "gray"; 
                }
                this.#ctx.font = "12px Arial";
                this.#ctx.fillText("Thank you for playing.", 100 + Math.random(), 110+Math.random());
                if(this.#clock){
                    this.#ctx.fillText("Press 'R' to restart.", 100, 130);
                }

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
                    this.#bgObjects.push(new ItemL(this.#me.x + 4, this.#me.y + 4, 3, (Math.random() - 0.5) * 6));
                }
            }
            this.#gameId = window.requestAnimationFrame(this.gameClearScene);
        }
    }

    changeStage(name){
        this.#clearedStages.push(this.#stage);
        this.#stage = name;
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

            if (obj.x < -10 || obj.dispose) {
                this.#bgObjects.splice(i, 1);
                i--;
            }
        }
    }

    #drawInformation(){
        //life
        this.#ctx.font = "10px Arial";
        this.#ctx.fillStyle = "gray";
        //this.#ctx.fillText("LIFE: " + "???".repeat(this.#me.life) + "???".repeat(3 - this.#me.life), 10, 10);
        this.#ctx.fillText("LIFE: " + this.#me.life, 10, 10);
        //score
        this.#ctx.fillText(("SCORE: " + this.#score).padStart(5, '0'), 200, 10);
        this.#ctx.fillText(("Hightest Score: " + this.#highscore).padStart(5, '0'), 300, 10);

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

    #calc_collision(o, b){
        if(o.x > b.x + b.width || o.x + o.width < b.x || o.y > b.y + b.height || o.y + o.height < b.y){
            ;//pass
        }else{
            return true;
        }

        //??????????????????????????????
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
            //?????????????????????->??????????????????
            var v_vec = {
                y: -(o.vx - b.vx),
                x: o.vy - b.vy,
            }
            //?????????
            var norm = Math.sqrt((v_vec.x)*(v_vec.x) + (v_vec.y)*(v_vec.y));
            v_vec.x = v_vec.x/norm;
            v_vec.y = v_vec.y/norm;

            //?????????????????????????????????????????????2??????????????????????????????
            var r_vec1 = {
                x: o.width/2.0,
                y: o.height/2.0,
            }
            var r_vec2 = {
                x: o.width/2.0,
                y: -(o.height/2.0),
            }
            //????????????????????????????????????????????????????????????
            var r_sweep = Math.max(Math.abs(v_vec.x * r_vec1.x + v_vec.y + r_vec1.y), Math.abs(v_vec.x * r_vec2.x + v_vec.y * r_vec2.y));
            
            //bullet??????????????????????????????????????????
            var v_bullet = {
                x: b.x - (o.x + o.width/2.0),
                y: b.y - (o.y + o.height/2.0),
            }
            var h = Math.abs((v_bullet.x * v_vec.x) + (v_bullet.y * v_vec.y));

            //debug//console.log("bullet " + i + ": item " + j + "::", r_sweep, h)
            if (r_sweep > h) {
                return true;
            }
        }
        return false;
    }

    #collisionDetect() {
        //bullet to object
        for (var i = 0; i < this.#bullets.length; ++i) {
            var b = this.#bullets[i];
            for (var j = 1; j < this.#mainObjects.length; ++j) {//????????????
                //bullet to object
                var o = this.#mainObjects[j];
                if(this.#calc_collision(o, b)){
                    o.addlife(-b.damage);
                    b.alive = false;
                }
            }
        }
        //enemy bullet to me
        this.#bullets_en.forEach(b=>{
            if(this.#calc_collision(this.#me, b)){
                this.#me.addlife(-b.damage);
                b.alive = false;
            }
        });

        //me to object (i==0: me)
        for (var i = 1; i < this.#mainObjects.length; ++i){
            var o = this.#mainObjects[i];
            if(o.x > this.#me.x + this.#me.width || o.x + o.width < this.#me.x || o.y > this.#me.y + this.#me.height || o.y + o.height < this.#me.y){
                continue;
            }else{
                this.#me.addlife(-1);
                switch(o.kind){
                    case "boss":
                        o.addlife(-1);
                        break;
                    default:
                        o.alive = false;
                        break;
                }
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

    #updateObjects(){
        for (var i = 0; i < this.#mainObjects.length; i++) {
            var mo = this.#mainObjects[i];

            mo.draw(this.#ctx);
            mo.update(this);

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
                if (!mo.alive || mo.x < -100 || mo.x > this.#parent.clientWidth + 100 || mo.y < -100 || mo.y > this.#parent.clientHeight + 100){
                    if(!mo.alive){//when destroyed by user
                        this.#score += mo.score;

                        if(!mo.restrictItemDrop){
                            var roll = Math.floor(Math.random() * 100);//0-99
                            if (roll % 10 == 0) {
                                this.#itemObjects.push(new Item3(mo.x, mo.y, -1, 1));
                            }
                            else if (roll % 17 == 0) {
                                this.#itemObjects.push(new ItemL(mo.x, mo.y, -1, 1));
                            }
                        }
                        if(mo.kind === "boss"){
                            this.changeStage(mo.unlockStage || "normal");
                        }
                    }

                    if(mo.alive && mo.kind === "boss"){//boss??????????????????????????????????????????????????????
                        mo.x = this.#parent.clientWidth;//warp
                    }else{
                        this.#mainObjects.splice(i, 1);
                        i--;
                    }
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

        //bullets-enemy
        for (var i = 0; i < this.#bullets_en.length; i++) {
            var b = this.#bullets_en[i];
            b.draw(this.#ctx);
            b.update();
            if (b.x > this.#parent.clientWidth || b.x < -100 || !b.alive) {
                this.#bullets_en.splice(i, 1);
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
            //esc
            if (this.#keySet.has(27)) {
                this.#me.life = 0;
            }
            /*
            //e
            if (this.#keySet.has(69)) {
                this.#me.life = 5000;
            }
            //r
            if (this.#keySet.has(82)) {
                this.#mainObjects.push(new Missle(550, 50, 0, 3, 3, this.#me, this));
            }
            //t
            if (this.#keySet.has(84)) {
                this.#bullets.push(new Missle(550, 50, 0, 3, 3, this.#me, this));
            }
            */

            //update score
            if(this.#score >= this.#highscore){
                this.#highscore = this.#score;
            }

            //change stage
            if(this.#score >= 100 && this.#stage != "boss1" &&!this.#clearedStages.includes("boss1")){
                this.#stage = "boss1";
                this.#mainObjects.push(new Boss1(this.#canvas.width, 50));
            }else if(this.#score >= 1000 && this.#stage != "boss2" &&!this.#clearedStages.includes("boss2")){
                this.#stage = "boss2";
                this.#mainObjects.push(new Boss2(this.#canvas.width, 50));
            }else if(this.#score >= 5000 && this.#stage != "boss3" &&!this.#clearedStages.includes("boss3")){
                this.#stage = "boss3";
                this.#mainObjects.push(new LastBoss(this.#canvas.width, 50));
            }

            //generate enemy etc.
            switch(this.#stage){
                case "normal":
                    var roll = Math.floor(Math.random() * 100);//0-99
                    if (roll % 20 == 0) {
                        this.#mainObjects.push(new En_md(this.#canvas.width, Math.random() * 100, -20, 0));
                    }
                    break;
                case "boss":
                    break;
                case "stage02":
                    var roll = Math.floor(Math.random() * 100);//0-99
                    if (roll % 20 == 0) {
                        this.#mainObjects.push(new En_md(this.#canvas.width, Math.random() * 100, -20, 0));
                    }

                    if (roll % 16 == 0) {
                        this.#mainObjects.push(new En_sm(this.#canvas.width, Math.random() * 100, -10, 0));
                    }
                    break;
                 case "stage03":
                    var roll = Math.floor(Math.random() * 100);//0-99
                    if (roll % 20 == 0) {
                        this.#mainObjects.push(new En_md(this.#canvas.width, Math.random() * 100, -25, 0));
                    }

                    if (roll % 16 == 0) {
                        this.#mainObjects.push(new En_sm(this.#canvas.width + Math.random() * 10, Math.random() * 100, -9, 0));
                        this.#mainObjects.push(new En_sm(this.#canvas.width + Math.random() * 10, Math.random() * 100, -7, 0));
                    }
                    break;
                case "clear":
                case "result":
                    window.cancelAnimationFrame(this.#gameId);

                    if(this.#highscore < this.#score){
                        this.#highscore = this.#score;
                    }
                    this.#gameId = window.requestAnimationFrame(this.gameClearScene);
                    return;
                default:
                    break;
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
            this.#updateObjects();            
        }
        //detect gameover
        if(this.#me.life <= 0){
            window.cancelAnimationFrame(this.#gameId);

            if(this.#highscore < this.#score){
                this.#highscore = this.#score;
            }
            this.#gameId = window.requestAnimationFrame(this.gameOverScene);
        }else{
            this.#gameId = window.requestAnimationFrame(this.gameloop);
        }
    }
};
