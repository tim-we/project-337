export var ASTEROIDS:HTMLImageElement[] = [
		createTexture("./tex/asteroid1.png"),
		createTexture("./tex/asteroid2.png"),
		createTexture("./tex/asteroid3.png"),
		createTexture("./tex/asteroid4.png")
	];

export var PLAYER:HTMLImageElement = createTexture("./tex/player.png");

export var UFO:HTMLImageElement = createTexture("./tex/ufo.png");

function createTexture(path:string):HTMLImageElement {
	let tex:HTMLImageElement = new Image();

	tex.src = path;

	return tex;
}