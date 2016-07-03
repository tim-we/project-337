const dir:string = "./img/";

export var ASTEROIDS:HTMLImageElement[] = [
		createTexture("asteroid1.png"),
		createTexture("asteroid2.png"),
		createTexture("asteroid3.png"),
		createTexture("asteroid4.png")
	];

export var PLAYER:HTMLImageElement = createTexture("player.png");

export var UFO:HTMLImageElement = createTexture("ufo.png");

function createTexture(path:string):HTMLImageElement {
	let tex:HTMLImageElement = new Image();

	tex.src = dir + path;

	return tex;
}