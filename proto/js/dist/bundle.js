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
	var GameObjects_1 = __webpack_require__(3);
	var canvas, ctx;
	var img = new Image();
	img.src = "./tex/asteroid1.png";
	var objects = [];
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
	function drawGameObject(o) {
	    var worldX = config_1.WORLD_SIZE + o.Position.x;
	    var worldY = config_1.WORLD_SIZE + o.Position.y;
	    // http://stackoverflow.com/questions/17411991/html5-canvas-rotate-image
	    ctx.save();
	    ctx.translate(worldX, worldY);
	    ctx.rotate(o.Rotation * Math.PI / 180);
	    ctx.drawImage(o.Texture, -o.Texture.width * 0.5, -o.Texture.width * 0.5);
	    ctx.restore();
	}
	function mainloop() {
	    window.requestAnimationFrame(mainloop);
	    var td = 1 / 60; //time diff
	    clearctx();
	    for (var i = 0; i < objects.length; i++) {
	        var o = objects[i];
	        drawGameObject(o);
	        o.move(td);
	        player.Rotation += td * 2;
	    }
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	exports.WORLD_SIZE = 200;
	exports.ASTEROID_SPEED = 50;


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
	        this.x = f * this.x;
	        this.y = f * this.y;
	    };
	    Object.defineProperty(Vector2.prototype, "len2", {
	        get: function () {
	            return this.x * this.x + this.y * this.y;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Vector2;
	}());
	exports.Vector2 = Vector2;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var config_1 = __webpack_require__(1);
	var Assets_1 = __webpack_require__(2);
	var tex = __webpack_require__(4);
	var MovingObject = (function () {
	    function MovingObject() {
	        this.Rotation = 0;
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
	                p.x = config_1.WORLD_SIZE + (config_1.WORLD_SIZE - p.x);
	            }
	        }
	        while (Math.abs(p.y) > config_1.WORLD_SIZE) {
	            if (p.y > config_1.WORLD_SIZE) {
	                p.y = (p.y - config_1.WORLD_SIZE) - config_1.WORLD_SIZE;
	            }
	            else {
	                p.y = config_1.WORLD_SIZE + (config_1.WORLD_SIZE - p.y);
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
	        this.Velocity = new Assets_1.Vector2(Math.sin(alpha), Math.cos(alpha));
	        this.Velocity.scale(config_1.ASTEROID_SPEED);
	        //pick random texture
	        this.Texture = tex.ASTEROIDS[Math.floor(Math.random() * tex.ASTEROIDS.length)];
	    }
	    return Asteroid;
	}(MovingObject));
	exports.Asteroid = Asteroid;
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player() {
	        _super.call(this);
	        this.Position = new Assets_1.Vector2();
	        this.Velocity = new Assets_1.Vector2();
	        this.Texture = tex.PLAYER;
	    }
	    return Player;
	}(MovingObject));
	exports.Player = Player;


/***/ },
/* 4 */
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