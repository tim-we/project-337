import { VIEW_RADIUS } from "../shared/Config";
import { Vector, Orientation } from "../shared/Basics";
import { AbstractPlayer } from "../shared/GameObjects/GameObjects";
import { Player } from "./GameObjects/Player";
import { Asteroid } from "../shared/GameObjects/Asteroid";
import * as Textures from "./Textures";
import {WORLD_SIZE} from "../shared/Config";

type RenderCallback = (number) => void;

//canvas
var canvas = document.createElement("canvas");
var ctx:CanvasRenderingContext2D = canvas.getContext("2d");

//game data
var Players:AbstractPlayer[] = [];
var Asteroids:Asteroid[] = [];
var Stars:Star[] = [];
var CameraPosition:Vector;



//helper
var offsetX:number;
var offsetY:number;
var ratio:number;
var _stop:boolean = false;
var _endHook:RenderCallback = function() {};
var lastFrame:number;

export function init(parent:HTMLElement, _c:Vector, _p:AbstractPlayer[], _a:Asteroid[]) {

	//link data arrays
		Players = _p;
		Asteroids = _a;
		CameraPosition = _c;
	
	//set up canvas
		parent.innerHTML = "";
		parent.appendChild(canvas);
		updateSize();
		canvas.setAttribute("style","background-color: #000;");
	
	//start render loop
		_stop = false;
		lastFrame = Date.now();
		render();
}

class Star{
	Position:Vector;
	Brightness:number;
	constructor() {
		this.Position = new Vector(
				(-1+Math.random()*2) * window.innerWidth,
				(-1+Math.random()*2) * window.innerHeight
			);
		this.Brightness = Math.round((Math.random()**3)*170);
			
		
	} 
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

//the big bang 
	for(let i=0; i<5000; i++) {
		Stars.push(new Star());
	}

function render() {
	if(!_stop) { window.requestAnimationFrame(render); }

	let delta:number = (Date.now() - lastFrame) * 0.001; // time diff in seconds
	lastFrame = Date.now();

	clear();

	for(let i=0; i<Stars.length; i++) {
		drawstar(Stars[i]);
	}

	for(let i=0; i<Asteroids.length; i++) {
		drawAsteroid(Asteroids[i]);
	}

	for(let i=0; i<Players.length; i++) {
		drawPlayer(Players[i]);
	}
	
	_endHook(delta);
}

export function clear() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0,0,canvas.width,canvas.height);
}

function drawstar(s:Star) {
	
	let canvasPos = s.Position;
	
	ctx.fillStyle = "rgb("+s.Brightness+","+s.Brightness+","+s.Brightness+")";
	ctx.fillRect(canvasPos.x, canvasPos.y, 3, 1);
	ctx.fillRect(canvasPos.x+1, canvasPos.y-1, 1, 3);
	

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