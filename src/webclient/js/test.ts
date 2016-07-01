/// <reference path="../../typings/index.d.ts" />

import {Vector,Orientation} from "../../shared/Basics";

import * as cfg from "../../shared/Config";

var socket = io('http://localhost:' + cfg.SERVER_PORT);

var test:Vector = new Vector(42,3);

document.write("vector: " + test + "<br>");

var o:Orientation = new Orientation(Math.PI);

document.write("rotation: " + o);

window.setInterval(function(){
	socket.emit('Position', test);
}, 1000);