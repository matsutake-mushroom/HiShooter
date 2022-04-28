import {En_sm} from "./Enemies";
import {Bullet_B1} from "../weapon/Bullets";
import { Missle } from "../weapon/Missle";
import { ItemL } from "../Items";
import { Smoke } from "../background/objects";

export class Boss1 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;

        this.width = 80;//for collision
        this.height = 80;
        this.v_width = 80;//for draw
        this.v_height = 80;

        this.mode = "appear";
        this.damaged = false;

        this.life = 450;
        this.alive = true;

        this.itr = 0;
        this.score = 100;

        this.kind = "boss";
        this.unlockStage = "stage02";
    }
    //c: context2d
    addlife(val) {
        if(val < 0){
            this.damaged = true;
        }

        this.life += val;
        if (this.life === 0) {
            this.itr = 0;
            this.mode = "explosion";
        }
    }

    draw(c) {
        /*
        c.beginPath();
        c.rect(this.x, this.y, this.v_width, this.v_height);
        c.lineWidth = 1;
        c.strokeStyle = "#777777";
        c.stroke();
        if(!this.damaged){
            c.fillStyle = "#777777";
            c.fill();
        }else{
            this.damaged = false;
        }
        c.closePath();
        */
        c.beginPath();
        c.rect(this.x, this.y, this.v_width, this.v_height);

        c.moveTo(this.x, this.y + this.v_height/2.0);
        c.lineTo(this.x + this.v_width, this.y + this.v_height);
        c.lineTo(this.x + this.v_width, this.y);
        c.closePath();


        c.lineWidth = 1;
        c.strokeStyle = "#777777";
        c.stroke();
        if(!this.damaged){
            c.fillStyle = "#777777";
            c.fill();
        }else{
            this.damaged = false;
        }
    }
    update(game_mgr) {
        switch(this.mode){
            case "appear":
                this.x -= 3;
                this.itr++;
                if(this.itr > 30){
                    this.itr = 0;
                    this.mode = "attack";
                }
                break;
            case "attack":
                if(this.itr < 100 || (this.itr >= 400 && this.itr < 500)){
                    this.x -= 0.5;
                    this.y -= 0.5;
                }else if(this.itr < 200 || (this.itr >= 500 && this.itr < 600)){
                    this.x -= 0.5;
                    this.y += 0.5;
                }else if(this.itr < 300 || (this.itr >= 600 && this.itr < 700)){
                    this.x += 0.5;
                    this.y += 0.5;
                }else if(this.itr < 400 || (this.itr >= 700 && this.itr < 800)){
                    this.x += 0.5;
                    this.y -= 0.5;
                }else if(this.itr < 1000){
                    if(this.itr % 100 === 0){
                        game_mgr.manager_addItem("main", new Missle(this.x + this.width/2.0, this.y + this.height, 0, 5, 1, game_mgr.manager_getItem("me"), game_mgr));
                        game_mgr.manager_addItem("main", new Missle(this.x + this.width/2.0, this.y, 0, -5, 1, game_mgr.manager_getItem("me"), game_mgr));
                    }
                    if(this.itr % 50 === 0){
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 + 10, -10, 1));
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 + 0, -10, 0));
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 - 10, -10, -1));
                    }
                }

                if(this.itr % 16 === 0){
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -10, 0));
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -8, -6));
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -8, 6));
                }
            
                this.itr++;
                if(this.itr > 1000){
                    this.itr = 0;
                }
                
                break;
            case "explosion":
                game_mgr.manager_addItem("bglist", new Smoke(this.x + this.width/2.0, this.y + this.height/2.0, this.width, 10));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.1, 0.5));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.2, 0.4));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.3, 0.3));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.2, 0.2));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.1, 0.1));
                this.alive = false;
            
                break;
            default:
                break;
        }
    }
}

export class Boss2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.alive = true;

        this.width = 60;//for collision
        this.height = 60;
        this.v_width = 60;//for draw
        this.v_height = 60;

        this.mode = "appear";
        this.damaged = false;

        this.life = 2000;
        this.alive = true;

        this.itr = 0;
        this.score = 1000;

        this.kind = "boss";
        this.unlockStage = "stage03";
    }
    //c: context2d
    addlife(val) {
        if(val < 0){
            this.damaged = true;
        }

        this.life += val;
        if (this.life === 0) {
            this.itr = 0;
            this.mode = "explosion";
        }
    }

    draw(c) {
        c.beginPath();
        c.rect(this.x, this.y, this.v_width, this.v_height);

        c.moveTo(this.x, this.y + this.v_height/2.0);
        c.lineTo(this.x + this.v_width, this.y + this.v_height);
        c.lineTo(this.x + this.v_width, this.y);
        c.closePath();


        c.lineWidth = 1;
        c.strokeStyle = "#777777";
        c.stroke();
        if(!this.damaged){
            c.fillStyle = "#777777";
            c.fill();
        }else{
            this.damaged = false;
        }
    }
    update(game_mgr) {
        switch(this.mode){
            case "appear":
                this.x -= 3;
                this.itr++;
                if(this.itr > 30){
                    this.itr = 0;
                    this.mode = "attack";
                }
                break;
            case "attack":
                if(this.itr < 100 || (this.itr >= 400 && this.itr < 500)){
                    this.x -= 0.5;
                    this.y -= 0.5;
                }else if(this.itr < 200 || (this.itr >= 500 && this.itr < 600)){
                    this.x -= 0.5;
                    this.y += 0.5;
                }else if(this.itr < 300 || (this.itr >= 600 && this.itr < 700)){
                    this.x += 0.5;
                    this.y += 0.5;
                }else if(this.itr < 400 || (this.itr >= 700 && this.itr < 800)){
                    this.x += 0.5;
                    this.y -= 0.5;
                }else if(this.itr < 1000){
                    if(this.itr % 100 === 0){
                        game_mgr.manager_addItem("main", new Missle(this.x + this.width/2.0, this.y + this.height, 0, 5, 1, game_mgr.manager_getItem("me"), game_mgr));
                        game_mgr.manager_addItem("main", new Missle(this.x + this.width/2.0, this.y, 0, -5, 1, game_mgr.manager_getItem("me"), game_mgr));
                    }
                    if(this.itr % 50 === 0){
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 + 10, -10, 1));
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 + 0, -10, 0));
                        game_mgr.manager_addItem("main", new En_sm(this.x, this.y + this.height/2.0 - 10, -10, -1));
                    }
                }

                if(this.itr % 16 === 0){
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -10, 0));
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -8, -6));
                    game_mgr.manager_addItem("bullet_en", new Bullet_B1(this.x, this.y + this.height/2.0, -8, 6));
                }
            
                this.itr++;
                if(this.itr > 1000){
                    this.itr = 0;
                }
                
                break;
            case "explosion":
                game_mgr.manager_addItem("bglist", new Smoke(this.x + this.width/2.0, this.y + this.height/2.0, this.width, 10));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.1, 0.5));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.2, 0.4));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.3, 0.3));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.2, 0.2));
                game_mgr.manager_addItem("item", new ItemL(this.x, this.y, -1.1, 0.1));
                this.alive = false;
            
                break;
            default:
                break;
        }
    }
}
