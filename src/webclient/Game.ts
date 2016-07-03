import * as View from "./View";
import * as cfg from "../shared/Config";
import * as ccfg from "./Client-Config";
import { Player } from "../shared/GameObjects/Player";
import { Asteroid } from "../shared/GameObjects/Asteroid";
import { Vector, Orientation } from "../shared/Basics";
import * as UserInput from "./UserInput";

var Players:Player[] = [];
var Asteroids:Asteroid[] = [];
var CameraPosition:Vector = new Vector(0,0);

var me:Player = new Player("Bob");
Players.push(me);

window.addEventListener("load", function(){
	alert("debug info in console [Ctrl+Shift+J]");

	View.init(document.body, CameraPosition, Players, Asteroids);

	View.setDrawEndHook(update);

	window.setInterval(function(){
		console.log("p: " + me.Position + " a: " + me.Orientation);
	}, 2000);

	//add some asteroids
	for(let i=0; i<10; i++) {
		let o = new Orientation(Math.random() * Math.PI * 2);
		let v = o.vector.scaled(100);

		Asteroids.push(new Asteroid(v));
	}
});

function update(delta:number) {
	//update game objects
		Players.map(function(p:Player) { p.move(delta); });
		Asteroids.map(function(a:Asteroid) { a.move(delta);	});

	//update camera position
		let f = 1 - ccfg.CAMERA_SMOOTHNESS;
		CameraPosition.x = f * CameraPosition.x + ccfg.CAMERA_SMOOTHNESS * me.Position.x;
		CameraPosition.y = f * CameraPosition.y + ccfg.CAMERA_SMOOTHNESS * me.Position.y;

	//handle user input
	let dir = 0;
		if(UserInput.isPressed("left")) { dir += 1; }
		if(UserInput.isPressed("right")) { dir -= 1; }
	
	if(dir != 0) {
		me.Orientation.change(dir * cfg.PLAYER_ROTATION_SPEED * delta);
	}	

	if(UserInput.isPressed("up")) {
		me.accelerate(delta);
	}
}