import {WORLD_SIZE, PLAYER_ROTATION_SPEED, STARS_NUMBER} from "./config";
import {Vector2} from "./Assets";
import * as UserInput from "./UserInput";
import {GameObject, Controllable, Particle, Asteroid, Player, Alien, Star} from "./GameObjects";

var canvas:HTMLCanvasElement,
	ctx:CanvasRenderingContext2D;

var objects:GameObject[] = [];
var particles:Particle[] = [];
var ai:Controllable[] = [];
var player:Player;
var allow_shoot:boolean = true;
var stars:Star[] = [];

window.addEventListener("load", function(){	
	canvas = <HTMLCanvasElement>document.getElementById("display");

	/*canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;*/

	canvas.width = canvas.height = 2 * WORLD_SIZE;

	ctx = canvas.getContext("2d");

	//add background stars
	for(let i=0; i<STARS_NUMBER; i++) {
		stars.push(new Star());
	}

	//add 10 asteroids
	for(let i=0; i<10; i++) {
		objects.push(new Asteroid());
	}

	//add ai enemies
	let a = new Alien();
	objects.push(a);
	ai.push(a);

	player = new Player();
	objects.push(player);

	mainloop();
});

function clearctx() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function toCanvasCoordinates(pos:Vector2):Vector2 {
	return new Vector2(WORLD_SIZE + pos.x, WORLD_SIZE + pos.y);
}

function drawGameObject(o:GameObject) {
	let canvasPos = toCanvasCoordinates(o.Position);

	// http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
	ctx.save();

    ctx.translate(canvasPos.x, canvasPos.y);

    ctx.rotate(o.Rotation);

    ctx.drawImage(o.Texture,-o.Texture.width*0.5,-o.Texture.width*0.5);

    ctx.restore();
}

function drawstar(s:Star) {
	
	let canvasPos = toCanvasCoordinates(s.Position);
	
	ctx.fillStyle = "rgb("+s.Brightness+","+s.Brightness+","+s.Brightness+")";
	ctx.fillRect(canvasPos.x, canvasPos.y, 3, 1);
	ctx.fillRect(canvasPos.x+1, canvasPos.y-1, 1, 3);
	

}

import {LaserShootingParticle} from "./GameObjects";

function drawParticle(p:Particle) {
	let cp:Vector2 = toCanvasCoordinates(p.Position);

	if(p instanceof LaserShootingParticle) {
		let cp2:Vector2 = toCanvasCoordinates(Vector2.add(p.Position, p.Velocity.scale(-0.15)));

		ctx.strokeStyle = p.color;
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(cp.x, cp.y);
		ctx.lineTo(cp2.x, cp2.y);

		ctx.stroke();

		
	} else {
		ctx.fillStyle = p.color;

		ctx.fillRect(cp.x,cp.y,2,2);
	}
	
}

function mainloop():void {
	window.requestAnimationFrame(mainloop);

	let td:number = 1/60; //time diff

	clearctx();

	for(let i = 0; i<stars.length;i++) {
		drawstar(stars[i]);
	}

	//draw particles
	for(let i=0; i<particles.length; i++) {
		let p:Particle = particles[i];

		//garbage-collect particles
		if(!p.isAlive) {	
			particles.splice(i, 1);
			i--;
			continue;
		}

		drawParticle(p);

		p.move(td);
	}

	//draw gameobjects (includes player)
	for(let i=0; i<objects.length; i++) {
		let o:GameObject = objects[i];
		
		drawGameObject(o);
		o.move(td);
	}
	
	let dir = 0;
		if(UserInput.isPressed("left")) { dir -= 1; }
		if(UserInput.isPressed("right")) { dir += 1; }
	
	if(dir != 0) { player.Rotation += dir * PLAYER_ROTATION_SPEED * td ; }
	

	if(UserInput.isPressed("up")) {
		player.accelerate(td);		
	}

	if(UserInput.isPressed("fire")) {
		if(allow_shoot) {
			particles.push(player.shoot());
			allow_shoot = false;
		}		
	} else {
		allow_shoot = true;
	}

	let tmp = [player];

	for(let i=0; i<ai.length; i++) {
		let _ai = <Alien>ai[i];
		_ai.see(tmp);
		let sp:Particle = _ai.shootMaybe();

		if(sp != null) {particles.push(sp); }
	}

	//particle collision
	for(let i = 0; i<particles.length; i++) {   
		let p = particles[i];
		
		for(let k=0; k<objects.length; k++) {
			if(p.distance2To(objects[k].Position)< 400) {
				p.isAlive = false;
			}
		}
	}
}