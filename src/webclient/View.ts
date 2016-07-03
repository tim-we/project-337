import { VIEW_RADIUS } from "../shared/Config";
import { Vector, Orientation } from "../shared/Basics";
import { AbstractPlayer } from "../shared/GameObjects/GameObjects";
import { Player } from "./GameObjects/Player";
import { Asteroid } from "../shared/GameObjects/Asteroid";
import * as Textures from "./Textures";
import {WORLD_SIZE} from "../shared/Config";

type RenderCallback = (number) => void;

//canvas
var canvas:HTMLCanvasElement = document.createElement("canvas");
var ctx:CanvasRenderingContext2D = canvas.getContext("2d");

//fps-counter
var fpsDisplay:HTMLDivElement = document.createElement("div");
fpsDisplay.setAttribute("style","position:fixed;top:0px;right:0px;font-size:12px;");
const frameTimeLimit:number = 25/1000;
var frames:number;
var fps:number;
var badframe:boolean;

//game data
var Players:AbstractPlayer[] = [];
var Asteroids:Asteroid[] = [];
var CameraPosition:Vector;

//helper
var offsetX:number;
var offsetY:number;
var ratio:number;
var _stop:boolean = false;
var _endHook:RenderCallback = function() {};
var lastFrame:number;

const BGSIZE:number = 512;

function initBackground() {
	let bg:HTMLCanvasElement = document.createElement("canvas");
	bg.width = bg.height = BGSIZE;
	let context:CanvasRenderingContext2D = bg.getContext("2d");

	context.fillStyle = "#000";
	context.fillRect(0, 0, bg.width, bg.height);

	//big bang
	for(let i=0; i<5000; i++) {
		let brightness = Math.floor(Math.random()**3 * 170);
		let x = (-1+Math.random()*2) * BGSIZE;
		let y = (-1+Math.random()*2) * BGSIZE;

		//draw star 
		context.fillStyle = "rgb("+brightness+","+brightness+","+brightness+")";
		context.fillRect(x, y, 3, 1);
		context.fillRect(x+1, y-1, 1, 3);
	}

	document.body.style.backgroundImage = "url("+bg.toDataURL()+")";
}

export function init(parent:HTMLElement, _c:Vector, _p:AbstractPlayer[], _a:Asteroid[]) {

	//link data arrays
		Players = _p;
		Asteroids = _a;
		CameraPosition = _c;
	
	//set up canvas
		parent.innerHTML = "";
		parent.appendChild(canvas);
		updateSize();
		//canvas.setAttribute("style","background-color: #000;");
	
	//set up frame counter
		parent.appendChild(fpsDisplay);
		fps = frames = 0;
		badframe = false;
		window.setInterval(function(){
			fps = frames;
			fpsDisplay.innerHTML = "FPS: " + fps;
			fpsDisplay.style.color = badframe ? "#f00" : "#0f0";
			frames = 0;
			badframe = false;
		}, 1000);

	//start render loop
		_stop = false;
		lastFrame = Date.now();
		render();

	initBackground();
}

export function stop() {
	_stop = true;
}

export function setDrawEndHook(f:RenderCallback) {
	_endHook = f;
}

function updateSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	offsetX = 0.5 * window.innerWidth;
	offsetY = 0.5 * window.innerHeight;

	let max = Math.max(window.innerWidth, window.innerHeight);

	ratio = max / (2 * VIEW_RADIUS);
}

window.addEventListener("resize", function() {
	updateSize();
});

/* convert world position to canvas position */
function toCanvas(v:Vector):Vector {
	return new Vector(
			offsetX + ((v.x - CameraPosition.x) * ratio),
			offsetY - ((v.y - CameraPosition.y) * ratio)
		);
}

function render() {
	if(!_stop) { window.requestAnimationFrame(render); }

	let delta:number = (Date.now() - lastFrame) * 0.001; // time diff in seconds
	lastFrame = Date.now();
	if(delta > frameTimeLimit) { badframe = true; delta = frameTimeLimit; }

	clear();

	Asteroids.map(function(a:Asteroid){
		drawAsteroid(a);
	});

	Players.map(function(p:AbstractPlayer){
		drawPlayer(p);
	});

	document.body.style.backgroundPositionX = 0 + "px";
	document.body.style.backgroundPositionY = 0 + "px";

	frames++;

	_endHook(delta);
}

export function clear() {
	/*ctx.fillStyle = "#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);*/
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * draws texture at given position with given angle
 * pos is the center point
 * expects canvas pixel coordinates for pos */
function drawTextureAt(tex:HTMLImageElement, pos:Vector, alpha:number) {
	// http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
	ctx.save();

    ctx.translate(pos.x, pos.y);

	//https://developer.mozilla.org/de/docs/Web/API/CanvasRenderingContext2D/rotate (clockwise radians)
    ctx.rotate(-alpha);

    ctx.drawImage(tex,-tex.width*0.5,-tex.width*0.5);

    ctx.restore();
}

function drawAsteroid(a:Asteroid) {
	let pos = toCanvas(a.Position);
	let tex = Textures.ASTEROIDS[a.Type];

	drawTextureAt(tex, pos, a.Orientation.alpha);
}

function drawPlayer(p:AbstractPlayer) {
	let pos = toCanvas(p.Position);

	drawTextureAt(Textures.PLAYER, pos, p.Orientation.alpha);

	if(!(p instanceof Player)) {
		ctx.textAlign = "center";

		ctx.fillStyle = "rgba(255,255,255,0.42)";
		ctx.font = "16px sans-serif";

		ctx.fillText(p.Name, pos.x, pos.y - 25);
	}
}