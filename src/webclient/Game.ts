import * as View from "./View";
import * as cfg from "../shared/Config";
import * as ccfg from "./Client-Config";
import { Player, OtherPlayer } from "./GameObjects/Player";
import { AbstractPlayer } from "../shared/GameObjects/GameObjects";
import { Asteroid } from "../shared/GameObjects/Asteroid";
import { Vector, Orientation } from "../shared/Basics";
import * as UserInput from "./UserInput";

const DEBUG:boolean = false;

var Players:AbstractPlayer[] = [];
var Asteroids:Asteroid[] = [];
var CameraPosition:Vector = new Vector(0,0);

var ws:WebSocket = null;
var changed:boolean = false;
var myID:number = 0;

var me:Player = null; /*new Player("Me");
Players.push(me);*/

window.addEventListener("load", function(){
	if(DEBUG) { alert("debug info in console [Ctrl+Shift+J]"); }

	View.init(document.body, CameraPosition, Players, Asteroids);

	View.setDrawEndHook(update);

	UserInput.enableMobile();

	if(DEBUG) {
		window.setInterval(function(){
			console.log("p: " + me.Position + " a: " + me.Orientation);
		}, 2000);
	}

	//add some asteroids
	for(let i=0; i<10; i++) {
		let o = new Orientation(Math.random() * Math.PI * 2);
		let v = o.vector.scaled(100);

		Asteroids.push(new Asteroid(v));
	}

	//add other player
	//Players.push(new OtherPlayer("that other guy"));
	initConnection()
});

function update(delta:number) {
	//update game objects
		Players.map(function(p:Player) { p.move(delta); });
		Asteroids.map(function(a:Asteroid) { a.move(delta);	});
	
	if(me && myID) {
		//update camera position
			CameraPosition.x = me.Position.x;
			CameraPosition.y = me.Position.y;

		//handle user input
		let dir = -UserInput.getAxisX();
		
		if(dir != 0) {
			me.Orientation.change(dir * cfg.PLAYER_ROTATION_SPEED * delta);
			changed = true;
		}	

		if(UserInput.isPressed("up")) {
			me.accelerate(delta);
			changed = true;
		}
	}	
}

function initConnection() {
	ws = new WebSocket("ws://awesome-projects.eu:8080/echo");

	ws.onclose = function() {
		console.log('connection lost');

		ws = null;

		setTimeout(initConnection, 1000);
	};

	ws.onmessage = function(e) {
		let msg = JSON.parse(e.data.toString());

		if(msg.a) {
			serverActionHandler(msg);
		}
	}

	ws.onopen = function() {
		ws.send(JSON.stringify({
			a: "join",
			v: "0.1",
			n: ""
		}));
	}
}

function serverActionHandler(msg) {
	if(msg.a == "denied") {
		if(ws) { ws.close(); }

		me = null;

		alert('Could not join server.\n\nReason:\n' + msg.reason);
	} else if(msg.a == "joined") {
		me = createPlayerFromServerData(msg.data);
		myID = msg.data.id;

		setInterval(function(){
			if(changed) {
				changed = false;

				ws.send(JSON.stringify({
					p: me.Position,
					v: me.Velocity,
					a: me.Orientation.alpha
				}));
			}
		}, 1000/25);
	} else if(msg.a == "update" && msg.type == "game") {
		Players = [];

		console.log(msg.players);

		msg.players.map(function(p){
			let player = createPlayerFromServerData(p.data);

			Players.push(player);

			if(p.id == myID) { me = player; }
		});
	}
}

function createPlayerFromServerData(data):Player {
	var p = new Player(data.n);

	p.Position = new Vector(data.p.x, data.p.y);
	p.Velocity = new Vector(data.v.x, data.v.y);
	p.Orientation.set(data.a);

	return p;
}