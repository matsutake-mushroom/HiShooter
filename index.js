import { HiokiShooter } from "./miniGame";
import { HiddenCmd } from "./hiddenCmd";

const cmd = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
//var game = new HiokiShooter(document.getElementsByClassName("main-content")[0]);
let hc = new HiddenCmd(cmd, gameStart, true);

function gameStart(){
    scrollToBottom(80).then(()=>{
        var game = new HiokiShooter(document.getElementsByClassName("main-content")[0]);
        game.start();
    })
}

function scrollToBottom (dy) {
    return new Promise((resolve)=>{
        const goalY = document.body.clientHeight; //- window.innerHeight;
        
        if (document.scrollingElement.scrollTop > goalY) return;

        let nowY = document.scrollingElement.scrollTop, oldTimestamp = null;

        function step (newTimestamp) {
            if (oldTimestamp !== null) {
                // if duration is 0 scrollY will be -Infinity
                nowY += dy;
                if (nowY > goalY){
                    document.scrollingElement.scrollTop = goalY;
                    resolve();
                    return 
                }
                document.scrollingElement.scrollTop = nowY;
            }
            oldTimestamp = newTimestamp;
            window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
    });
}
