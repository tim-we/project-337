export var ASTEROIDS:HTMLImageElement[] = [
		newTexture("./tex/asteroid1.png"),
		newTexture("./tex/asteroid2.png"),
		newTexture("./tex/asteroid3.png")
	];

export var PLAYER:HTMLImageElement = newTexture("./tex/player.png");

function newTexture(path:string):HTMLImageElement {
	let tex:HTMLImageElement = new Image();

	tex.src = path;

	return tex;
}