/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var config_1 = __webpack_require__(1);
	var Assets_1 = __webpack_require__(2);
	var UserInput = __webpack_require__(3);
	var GameObjects_1 = __webpack_require__(4);
	var canvas, ctx;
	var img = new Image();
	img.src = "./tex/asteroid1.png";
	var objects = [];
	var particles = [];
	var player;
	window.addEventListener("load", function () {
	    canvas = document.getElementById("display");
	    /*canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;*/
	    canvas.width = canvas.height = 2 * config_1.WORLD_SIZE;
	    ctx = canvas.getContext("2d");
	    //add 10 asteroids
	    for (var i = 0; i < 10; i++) {
	        objects.push(new GameObjects_1.Asteroid(new Assets_1.Vector2(30, 20)));
	    }
	    player = new GameObjects_1.Player();
	    objects.push(player);
	    mainloop();
	});
	function clearctx() {
	    ctx.fillStyle = "#000";
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	function toCanvasCoordinates(pos) {
	    return new Assets_1.Vector2(config_1.WORLD_SIZE + pos.x, config_1.WORLD_SIZE + pos.y);
	}
	function drawGameObject(o) {
	    var canvasPos = toCanvasCoordinates(o.Position);
	    // http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
	    ctx.save();
	    ctx.translate(canvasPos.x, canvasPos.y);
	    ctx.rotate(o.Rotation);
	    ctx.drawImage(o.Texture, -o.Texture.width * 0.5, -o.Texture.width * 0.5);
	    ctx.restore();
	}
	function mainloop() {
	    window.requestAnimationFrame(mainloop);
	    var td = 1 / 60; //time diff
	    clearctx();
	    //draw particles
	    for (var i = 0; i < particles.length; i++) {
	        var p = particles[i];
	        var cp = toCanvasCoordinates(p.Position);
	        ctx.fillStyle = "#fff";
	        ctx.fillRect(cp.x, cp.y, 2, 2);
	        p.move(td);
	    }
	    //draw gameobjects (includes player)
	    for (var i = 0; i < objects.length; i++) {
	        var o = objects[i];
	        drawGameObject(o);
	        o.move(td);
	    }
	    var dir = 0;
	    if (UserInput.isPressed("left")) {
	        dir -= 1;
	    }
	    if (UserInput.isPressed("right")) {
	        dir += 1;
	    }
	    if (dir != 0) {
	        player.Rotation += dir * config_1.PLAYER_ROTATION_SPEED * td;
	    }
	    if (UserInput.isPressed("fire")) {
	        particles.push(player.shoot());
	    }
	    if (UserInput.isPressed("up")) {
	        player.accelerate(td);
	    }
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.WORLD_SIZE = 400;
	exports.ASTEROID_SPEED = 50;
	exports.BULLET_SPEED = 100;
	exports.PLAYER_ACCELERATION = 200;
	exports.PLAYER_ROTATION_SPEED = 4;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	var Vector2 = (function () {
	    function Vector2(x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this.x = x;
	        this.y = y;
	    }
	    Vector2.prototype.scale = function (f) {
	        return new Vector2(f * this.x, f * this.y);
	    };
	    Object.defineProperty(Vector2.prototype, "len2", {
	        get: function () {
	            return this.x * this.x + this.y * this.y;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Vector2.prototype.clone = function () {
	        return new Vector2(this.x, this.y);
	    };
	    Vector2.add = function (a, b) {
	        return new Vector2(a.x + b.x, a.y + b.y);
	    };
	    return Vector2;
	}());
	exports.Vector2 = Vector2;


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var keys_pressed = [];
	window.addEventListener("keydown", function (e) {
	    keys_pressed.push(e.keyCode || 32);
	});
	window.addEventListener("keyup", function (e) {
	    var i;
	    while ((i = keys_pressed.indexOf(e.keyCode)) > -1) {
	        keys_pressed.splice(i, 1);
	    }
	});
	//http://stackoverflow.com/questions/6199038/javascript-event-triggered-by-pressing-space
	var mappings = {
	    "fire": 32,
	    "space": 32,
	    "enter": 13,
	    "esc": 27,
	    "ctrl": 17,
	    "alt": 18,
	    "shift": 16,
	    "up": 38,
	    "down": 40,
	    "right": 39,
	    "left": 37
	};
	function isPressed(id) {
	    if (mappings[id]) {
	        var i = keys_pressed.indexOf(mappings[id]);
	        return i > -1;
	    }
	    else {
	        throw new Error("Key mapping not supported.");
	    }
	}
	exports.isPressed = isPressed;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var config_1 = __webpack_require__(1);
	var Assets_1 = __webpack_require__(2);
	var tex = __webpack_require__(5);
	var MovingObject = (function () {
	    function MovingObject() {
	        this._alpha = 0;
	    }
	    MovingObject.prototype.move = function (t) {
	        var p = this.Position;
	        p.x += t * this.Velocity.x;
	        p.y += t * this.Velocity.y;
	        //repeating world
	        while (Math.abs(p.x) > config_1.WORLD_SIZE) {
	            if (p.x > config_1.WORLD_SIZE) {
	                p.x = (p.x - config_1.WORLD_SIZE) - config_1.WORLD_SIZE;
	            }
	            else {
	                p.x = config_1.WORLD_SIZE + (config_1.WORLD_SIZE + p.x);
	            }
	        }
	        while (Math.abs(p.y) > config_1.WORLD_SIZE) {
	            if (p.y > config_1.WORLD_SIZE) {
	                p.y = (p.y - config_1.WORLD_SIZE) - config_1.WORLD_SIZE;
	            }
	            else {
	                p.y = config_1.WORLD_SIZE + (config_1.WORLD_SIZE + p.y);
	            }
	        }
	    };
	    MovingObject.prototype.distance2To = function (point) {
	        var x = this.Position.x - point.x;
	        var y = this.Position.y - point.y;
	        return x * x + y * y;
	    };
	    return MovingObject;
	}());
	var Asteroid = (function (_super) {
	    __extends(Asteroid, _super);
	    function Asteroid(pos) {
	        _super.call(this);
	        this.Position = pos;
	        //random direction
	        var alpha = Math.random() * 2 * Math.PI;
	        this.Velocity = new Assets_1.Vector2(Math.cos(alpha), Math.sin(alpha));
	        this.Velocity = this.Velocity.scale(config_1.ASTEROID_SPEED);
	        //pick random texture
	        this.Texture = tex.ASTEROIDS[Math.floor(Math.random() * tex.ASTEROIDS.length)];
	    }
	    Object.defineProperty(Asteroid.prototype, "Rotation", {
	        get: function () { return this._alpha; },
	        enumerable: true,
	        configurable: true
	    });
	    return Asteroid;
	}(MovingObject));
	exports.Asteroid = Asteroid;
	var ShootingParticle = (function (_super) {
	    __extends(ShootingParticle, _super);
	    function ShootingParticle(pos, vel) {
	        _super.call(this);
	        this.alive = true;
	        this.Position = pos;
	        this.Velocity = vel;
	    }
	    Object.defineProperty(ShootingParticle.prototype, "isAlive", {
	        get: function () { return this.alive; },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ShootingParticle.prototype, "Rotation", {
	        get: function () { return this._alpha; },
	        enumerable: true,
	        configurable: true
	    });
	    return ShootingParticle;
	}(MovingObject));
	exports.ShootingParticle = ShootingParticle;
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player() {
	        _super.call(this);
	        this.Position = new Assets_1.Vector2();
	        this.Velocity = new Assets_1.Vector2();
	        this.DirectionVector = new Assets_1.Vector2(1, 0);
	        this.Texture = tex.PLAYER;
	        this.Health = 100;
	    }
	    Object.defineProperty(Player.prototype, "Rotation", {
	        get: function () { return this._alpha; },
	        set: function (a) {
	            this._alpha = a;
	            this.DirectionVector = new Assets_1.Vector2(Math.cos(a), Math.sin(a));
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "Health", {
	        get: function () { return this._health; },
	        set: function (h) { this._health = Math.max(0, h); },
	        enumerable: true,
	        configurable: true
	    });
	    Player.prototype.shoot = function () {
	        var v = Assets_1.Vector2.add(this.Velocity, this.DirectionVector.scale(config_1.BULLET_SPEED));
	        return new ShootingParticle(this.Position.clone(), v);
	    };
	    Player.prototype.accelerate = function (t) {
	        var v = this.DirectionVector.scale(config_1.PLAYER_ACCELERATION * t);
	        this.Velocity.x += v.x;
	        this.Velocity.y += v.y;
	    };
	    return Player;
	}(MovingObject));
	exports.Player = Player;


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	exports.ASTEROIDS = [
	    newTexture("./tex/asteroid1.png"),
	    newTexture("./tex/asteroid2.png"),
	    newTexture("./tex/asteroid3.png")
	];
	exports.PLAYER = newTexture("./tex/player.png");
	function newTexture(path) {
	    var tex = new Image();
	    tex.src = path;
	    return tex;
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map