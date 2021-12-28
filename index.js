import { HiokiShooter, HiddenCmd } from "./miniGame";

const cmd = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
var game = new HiokiShooter(document.getElementsByClassName("container")[0]);
let hc = new HiddenCmd(cmd, game.start, true);