import {WORLD_SIZE} from "./config";
import {Vector2} from "./Assets";
import {GameObject, Asteroid, Player} from "./GameObjects";

var canvas:HTMLCanvasElement,
	ctx:CanvasRenderingContext2D;

var img:HTMLImageElement = new Image();
img.src = "./tex/asteroid1.png";

var objects:GameObject[] = [];
var player:GameObject;

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

function drawGameObject(o:GameObject) {
	let worldX = WORLD_SIZE + o.Position.x;
	let worldY = WORLD_SIZE + o.Position.y;

	// http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
	ctx.save();

    ctx.translate(worldX, worldY);

    ctx.rotate(o.Rotation*Math.PI/180);

    ctx.drawImage(o.Texture,-o.Texture.width*0.5,-o.Texture.width*0.5);

    ctx.restore();
}

function mainloop():void {
	window.requestAnimationFrame(mainloop);

	let td:number = 1/60; //time diff

	clearctx();

	for(let i=0; i<objects.length; i++) {
		let o:GameObject = objects[i];
		
		drawGameObject(o);
		o.move(td);

		player.Rotation += td * 2;
	}
	
}