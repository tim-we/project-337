export var WORLD_SIZE = 400;

export var ASTEROID_SPEED = 50;

export var BULLET_SPEED = 100;

export var PLAYER_ACCELERATION = 200;

export var PLAYER_ROTATION_SPEED = 4;

export var PLAYER_MAX_SPEED2 = 1000 ** 2;

export var BULLET_LIFETIME = 5 * 1000;

export var AI_FIRE_COOLDOWN = 420;

export var STARS_NUMBER = 2000;

window.addEventListener("load", function(){
	WORLD_SIZE = Math.min(window.innerWidth, window.innerHeight) * 0.5;
});