/// <reference path="../../typings/index.d.ts" />

import {Vector,Orientation} from "../../shared/Basics";

import * as cfg from "../../shared/Config";

var p:Vector = new Vector(42,3);
var o:Orientation = new Orientation(Math.PI);

var socket;

var display:HTMLDivElement = document.createElement("div");

function println(str:string):void {
	display.innerHTML += str + "<br>\n";
}

window.addEventListener("load", function(){
	socket = io('http://localhost:' + cfg.SERVER_PORT);

	document.body.appendChild(display);

	println("position vector: " + p);
	println("rotation: " + o);
	println("directional vector: " + o.vector);

	socket.on("server version", function(data) {
		println("server version: " + data);
		println("client version: " + cfg.VERSION);
	});

	socket.emit('request version', cfg.VERSION);
});

window.setInterval(function(){
	socket.emit('update velocity', p);
}, 4200);