import {WORLD_SIZE} from "./config";
import {Vector2} from "./Assets";
import * as UserInput from "./UserInput";
import {GameObject, Particle, Asteroid, Player} from "./GameObjects";

var canvas:HTMLCanvasElement,
	ctx:CanvasRenderingContext2D;

var img:HTMLImageElement = new Image();
img.src = "./tex/asteroid1.png";

var objects:GameObject[] = [];
var particles:Particle[] = [];
var player:Player;

window.addEventListener("load", function(){	
	canvas = <HTMLCanvasElement>document.getElementById("display");

	/*canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;*/

	canvas.width = canvas.height = 2 * WORLD_SIZE;

	ctx = canvas.getContext("2d");

	//add 10 asteroids
	for(let i=0; i<10; i++) {
		objects.push(new Asteroid(new Vector2(30,20)));
	}

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

    ctx.rotate(o.Rotation*Math.PI/180);

    ctx.drawImage(o.Texture,-o.Texture.width*0.5,-o.Texture.width*0.5);

    ctx.restore();
}

function mainloop():void {
	window.requestAnimationFrame(mainloop);

	let td:number = 1/60; //time diff

	clearctx();
	//draw particles
	for(let i=0; i<particles.length; i++) {
		let p:Particle = particles[i];

		let cp:Vector2 = toCanvasCoordinates(p.Position);

		ctx.fillStyle = "#fff";
		ctx.fillRect(cp.x,cp.y,2,2);

		p.move(td);
	}

	//draw gameobjects
	for(let i=0; i<objects.length; i++) {
		let o:GameObject = objects[i];
		
		drawGameObject(o);
		o.move(td);

	}
	
	let dir = 0;
		if(UserInput.isPressed("left")) { dir -= 1; }
		if(UserInput.isPressed("right")) { dir += 1; }
	
	player.Rotation += dir * td * 100;

	if(UserInput.isPressed("fire")) {
		particles.push(player.shoot());
	}
}