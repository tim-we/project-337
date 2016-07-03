import { VIEW_RADIUS } from "../shared/Config";
import { Vector, Orientation } from "../shared/Basics";
import { Player } from "../shared/GameObjects/Player";
import { Asteroid } from "../shared/GameObjects/Asteroid";
import * as Textures from "./Textures";

type RenderCallback = (number) => void;

//canvas
var canvas = document.createElement("canvas");
var ctx:CanvasRenderingContext2D = canvas.getContext("2d");

//game data
var Players:Player[] = [];
var Asteroids:Asteroid[] = [];
var CameraPosition:Vector;

//helper
var offsetX:number;
var offsetY:number;
var ratio:number;
var _stop:boolean = false;
var _endHook:RenderCallback = function() {};
var lastFrame:number;

export function init(parent:HTMLElement, _c:Vector, _p:Player[], _a:Asteroid[]) {

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

	clear();

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

function drawPlayer(p:Player) {
	let pos = toCanvas(p.Position);

	drawTextureAt(Textures.PLAYER, pos, p.Orientation.alpha);
}