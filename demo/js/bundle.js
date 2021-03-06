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
	var View = __webpack_require__(1);
	var cfg = __webpack_require__(2);
	var Player_1 = __webpack_require__(4);
	var Asteroid_1 = __webpack_require__(7);
	var Basics_1 = __webpack_require__(3);
	var UserInput = __webpack_require__(8);
	var DEBUG = false;
	var Players = [];
	var Asteroids = [];
	var CameraPosition = new Basics_1.Vector(0, 0);
	var ws = null;
	var changed = false;
	var myID = 0;
	var me = null;
	window.addEventListener("load", function () {
	    if (DEBUG) {
	        alert("debug info in console [Ctrl+Shift+J]");
	    }
	    View.init(document.body, CameraPosition, Players, Asteroids);
	    View.setDrawEndHook(update);
	    UserInput.enableMobile();
	    if (DEBUG) {
	        window.setInterval(function () {
	            console.log("p: " + me.Position + " a: " + me.Orientation);
	        }, 2000);
	    }
	    for (var i = 0; i < 10; i++) {
	        var o = new Basics_1.Orientation(Math.random() * Math.PI * 2);
	        var v = o.vector.scaled(100);
	        Asteroids.push(new Asteroid_1.Asteroid(v));
	    }
	});
	function update(delta) {
	    Players.map(function (p) { p.move(delta); });
	    Asteroids.map(function (a) { a.move(delta); });
	    if (me && myID) {
	        CameraPosition.x = me.Position.x;
	        CameraPosition.y = me.Position.y;
	        var dir = -UserInput.getAxisX();
	        if (dir != 0) {
	            me.Orientation.change(dir * cfg.PLAYER_ROTATION_SPEED * delta);
	            changed = true;
	        }
	        if (UserInput.isPressed("up")) {
	            me.accelerate(delta);
	            changed = true;
	        }
	    }
	}
	function initConnection() {
	    ws = new WebSocket("ws://awesome-projects.eu:8080/echo");
	    ws.onclose = function () {
	        console.log('connection lost');
	        ws = null;
	        setTimeout(initConnection, 1000);
	    };
	    ws.onmessage = function (e) {
	        var msg = JSON.parse(e.data.toString());
	        if (msg.a) {
	            serverActionHandler(msg);
	        }
	    };
	    ws.onopen = function () {
	        ws.send(JSON.stringify({
	            a: "join",
	            v: "0.1",
	            n: ""
	        }));
	    };
	}
	function serverActionHandler(msg) {
	    if (msg.a == "denied") {
	        if (ws) {
	            ws.close();
	        }
	        me = null;
	        alert('Could not join server.\n\nReason:\n' + msg.reason);
	    }
	    else if (msg.a == "joined") {
	        me = createPlayerFromServerData(msg.data);
	        myID = msg.data.id;
	        setInterval(function () {
	            if (changed) {
	                changed = false;
	                ws.send(JSON.stringify({
	                    p: me.Position,
	                    v: me.Velocity,
	                    a: me.Orientation.alpha
	                }));
	            }
	        }, 1000 / 25);
	    }
	    else if (msg.a == "update" && msg.type == "game") {
	        Players = [];
	        msg.players.map(function (p) {
	            var player = createPlayerFromServerData(p.data);
	            Players.push(player);
	            if (p.id == myID) {
	                me = player;
	            }
	        });
	    }
	}
	function createPlayerFromServerData(data) {
	    var p = new Player_1.Player(data.n);
	    p.Position = new Basics_1.Vector(data.p.x, data.p.y);
	    p.Velocity = new Basics_1.Vector(data.v.x, data.v.y);
	    p.Orientation.set(data.a);
	    return p;
	}
	//# sourceMappingURL=Game.js.map

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Config_1 = __webpack_require__(2);
	var Basics_1 = __webpack_require__(3);
	var Player_1 = __webpack_require__(4);
	var Textures = __webpack_require__(6);
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	var fpsDisplay = document.createElement("div");
	fpsDisplay.setAttribute("style", "position:fixed;top:0px;right:0px;font-size:12px;");
	var frameTimeLimit = 25 / 1000;
	var frames;
	var fps;
	var badframe;
	var Players = [];
	var Asteroids = [];
	var CameraPosition;
	var offsetX;
	var offsetY;
	var ratio;
	var _stop = false;
	var _endHook = function () { };
	var lastFrame;
	var BGSIZE = 512;
	function initBackground() {
	    var bg = document.createElement("canvas");
	    bg.width = bg.height = BGSIZE;
	    var context = bg.getContext("2d");
	    context.fillStyle = "#000";
	    context.fillRect(0, 0, bg.width, bg.height);
	    for (var i = 0; i < 1500; i++) {
	        var b = Math.floor(Math.pow(Math.random(), 3) * 160);
	        var x = (-1 + Math.random() * 2) * BGSIZE;
	        var y = (-1 + Math.random() * 2) * BGSIZE;
	        if (b > 145) {
	            context.fillStyle = "rgb(70,70,70)";
	            context.fillRect(x - 1, y, 5, 1);
	            context.fillRect(x + 1, y - 2, 1, 5);
	        }
	        context.fillStyle = "rgb(" + b + "," + b + "," + b + ")";
	        context.fillRect(x, y, 3, 1);
	        context.fillRect(x + 1, y - 1, 1, 3);
	    }
	    document.body.style.backgroundImage = "url(" + bg.toDataURL() + ")";
	}
	function init(parent, _c, _p, _a) {
	    Players = _p;
	    Asteroids = _a;
	    CameraPosition = _c;
	    parent.innerHTML = "";
	    parent.appendChild(canvas);
	    updateSize();
	    parent.appendChild(fpsDisplay);
	    fps = frames = 0;
	    badframe = false;
	    window.setInterval(function () {
	        fps = frames;
	        fpsDisplay.innerHTML = "FPS: " + fps;
	        fpsDisplay.style.color = badframe ? "#f00" : "#0f0";
	        frames = 0;
	        badframe = false;
	    }, 1000);
	    _stop = false;
	    lastFrame = Date.now();
	    render();
	    initBackground();
	}
	exports.init = init;
	function stop() {
	    _stop = true;
	}
	exports.stop = stop;
	function setDrawEndHook(f) {
	    _endHook = f;
	}
	exports.setDrawEndHook = setDrawEndHook;
	function updateSize() {
	    canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
	    offsetX = 0.5 * window.innerWidth;
	    offsetY = 0.5 * window.innerHeight;
	    var max = Math.max(window.innerWidth, window.innerHeight);
	    ratio = max / (2 * Config_1.VIEW_RADIUS);
	}
	window.addEventListener("resize", function () {
	    updateSize();
	});
	function toCanvas(v) {
	    return new Basics_1.Vector(offsetX + ((v.x - CameraPosition.x) * ratio), offsetY - ((v.y - CameraPosition.y) * ratio));
	}
	function render() {
	    if (!_stop) {
	        window.requestAnimationFrame(render);
	    }
	    var delta = (Date.now() - lastFrame) * 0.001;
	    lastFrame = Date.now();
	    if (delta > frameTimeLimit) {
	        badframe = true;
	        delta = frameTimeLimit;
	    }
	    clear();
	    Asteroids.map(function (a) {
	        drawAsteroid(a);
	    });
	    Players.map(function (p) {
	        drawPlayer(p);
	    });
	    frames++;
	    _endHook(delta);
	}
	function clear() {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
	exports.clear = clear;
	function drawTextureAt(tex, pos, alpha) {
	    ctx.save();
	    ctx.translate(pos.x, pos.y);
	    ctx.rotate(-alpha);
	    ctx.drawImage(tex, -tex.width * 0.5, -tex.width * 0.5);
	    ctx.restore();
	}
	function drawAsteroid(a) {
	    var pos = toCanvas(a.Position);
	    var tex = Textures.ASTEROIDS[a.Type];
	    drawTextureAt(tex, pos, a.Orientation.alpha);
	}
	function drawPlayer(p) {
	    var pos = toCanvas(p.Position);
	    drawTextureAt(Textures.PLAYER, pos, p.Orientation.alpha);
	    if (!(p instanceof Player_1.Player)) {
	        ctx.textAlign = "center";
	        ctx.fillStyle = "rgba(255,255,255,0.42)";
	        ctx.font = "16px sans-serif";
	        ctx.fillText(p.Name, pos.x, pos.y - 25);
	    }
	}
	//# sourceMappingURL=View.js.map

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	exports.VERSION = 0.1;
	exports.WORLD_SIZE = 8000;
	exports.SERVER_PORT = 8080;
	exports.PLAYER_ACCELERATION = 250;
	exports.PLAYER_SHOOT_COOLDOWN = 16;
	exports.PLAYER_ROTATION_SPEED = 4;
	exports.VIEW_RADIUS = 500;
	exports.NUM_ASTEROIDS = 4;
	//# sourceMappingURL=Config.js.map

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	var Vector = (function () {
	    function Vector(x, y) {
	        if (x === void 0) { x = 0; }
	        if (y === void 0) { y = 0; }
	        this.x = x;
	        this.y = y;
	    }
	    Vector.prototype.toString = function () {
	        return "(" + this.x + "," + this.y + ")";
	    };
	    Vector.prototype.clone = function () {
	        return new Vector(this.x, this.y);
	    };
	    Vector.prototype.scale = function (f) {
	        this.x *= f;
	        this.y *= f;
	        return this;
	    };
	    Vector.prototype.scaled = function (f) {
	        return this.clone().scale(f);
	    };
	    Vector.add = function (a, b) {
	        return new Vector(a.x + b.x, a.y + b.y);
	    };
	    Vector.subtract = function (a, b) {
	        return new Vector(a.x - b.x, a.y - b.y);
	    };
	    Vector.prototype.length2 = function () {
	        return this.x * this.x + this.y * this.y;
	    };
	    Vector.prototype.length = function () {
	        return Math.sqrt(this.length2());
	    };
	    return Vector;
	}());
	exports.Vector = Vector;
	var Orientation = (function () {
	    function Orientation(x) {
	        if (x === void 0) { x = 0; }
	        this.set(x);
	    }
	    Orientation.prototype.set = function (alpha) {
	        this.alpha = alpha;
	        this.vector = new Vector(Math.cos(alpha), Math.sin(alpha));
	    };
	    Orientation.prototype.change = function (alpha) {
	        this.alpha += alpha;
	        this.vector = new Vector(Math.cos(this.alpha), Math.sin(this.alpha));
	    };
	    Orientation.prototype.setRandom = function () {
	        this.set(Math.random() * 2 * Math.PI);
	    };
	    Orientation.prototype.toString = function () {
	        return (Math.round(this.alpha * 180 / Math.PI) % 360) + "°";
	    };
	    return Orientation;
	}());
	exports.Orientation = Orientation;
	var Matrix = (function () {
	    function Matrix(x) {
	        if (x === void 0) { x = 1; }
	        if (x instanceof Array) {
	            this.a = x[0];
	            this.b = x[1];
	            this.c = x[2];
	            this.d = x[3];
	        }
	        else {
	            this.a = this.c = x;
	            this.b = this.d = 0;
	        }
	    }
	    Matrix.Mirror = function (alpha) {
	        var a = 2 * alpha;
	        var c = Math.cos(a);
	        var s = Math.sin(a);
	        return new Matrix([c, s, s, -c]);
	    };
	    Matrix.Rotation = function (alpha) {
	        var c = Math.cos(alpha);
	        var s = Math.sin(alpha);
	        return new Matrix([c, -s, s, c]);
	    };
	    Matrix.prototype.vector = function (v) {
	        return new Vector(this.a * v.x + this.b * v.y, this.c * v.x + this.d * v.y);
	    };
	    return Matrix;
	}());
	exports.Matrix = Matrix;
	//# sourceMappingURL=Basics.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var GameObjects_1 = __webpack_require__(5);
	var Config_1 = __webpack_require__(2);
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player(name) {
	        _super.call(this, name);
	    }
	    Player.prototype.accelerate = function (f) {
	        f = f * Config_1.PLAYER_ACCELERATION;
	        this.Velocity.x += this.Orientation.vector.x * f;
	        this.Velocity.y += this.Orientation.vector.y * f;
	    };
	    Player.prototype.shoot = function () {
	        if (!this.allowShoot()) {
	            return;
	        }
	    };
	    return Player;
	}(GameObjects_1.AbstractPlayer));
	exports.Player = Player;
	var OtherPlayer = (function (_super) {
	    __extends(OtherPlayer, _super);
	    function OtherPlayer(name) {
	        _super.call(this, name);
	    }
	    return OtherPlayer;
	}(GameObjects_1.AbstractPlayer));
	exports.OtherPlayer = OtherPlayer;
	//# sourceMappingURL=Player.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Basics_1 = __webpack_require__(3);
	var PhysicalObject = (function () {
	    function PhysicalObject(p, v, a) {
	        if (p === void 0) { p = new Basics_1.Vector(); }
	        if (v === void 0) { v = new Basics_1.Vector(); }
	        if (a === void 0) { a = 0; }
	        this.Position = p;
	        this.Velocity = v;
	        this.Orientation = new Basics_1.Orientation(a);
	    }
	    PhysicalObject.prototype.move = function (f) {
	        this.Position = Basics_1.Vector.add(this.Position, this.Velocity.scaled(f));
	    };
	    return PhysicalObject;
	}());
	exports.PhysicalObject = PhysicalObject;
	var DestructableObject = (function (_super) {
	    __extends(DestructableObject, _super);
	    function DestructableObject() {
	        _super.apply(this, arguments);
	        this.Health = 100;
	        this.Radius = 42;
	    }
	    DestructableObject.prototype.isAlive = function () {
	        return this.Health > 0;
	    };
	    return DestructableObject;
	}(PhysicalObject));
	exports.DestructableObject = DestructableObject;
	var Config_1 = __webpack_require__(2);
	var AbstractPlayer = (function (_super) {
	    __extends(AbstractPlayer, _super);
	    function AbstractPlayer(name) {
	        _super.call(this);
	        this._cooldown = Config_1.PLAYER_SHOOT_COOLDOWN;
	        this._xp = 0;
	        this.Name = name;
	    }
	    AbstractPlayer.prototype.allowShoot = function () {
	        return (Date.now() - this._lastShot) > this._cooldown;
	    };
	    return AbstractPlayer;
	}(DestructableObject));
	exports.AbstractPlayer = AbstractPlayer;
	//# sourceMappingURL=GameObjects.js.map

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var dir = "./img/";
	exports.ASTEROIDS = [
	    createTexture("asteroid1.png"),
	    createTexture("asteroid2.png"),
	    createTexture("asteroid3.png"),
	    createTexture("asteroid4.png")
	];
	exports.PLAYER = createTexture("player.png");
	exports.UFO = createTexture("ufo.png");
	function createTexture(path) {
	    var tex = new Image();
	    tex.src = dir + path;
	    return tex;
	}
	//# sourceMappingURL=Textures.js.map

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var GameObjects_1 = __webpack_require__(5);
	var Basics_1 = __webpack_require__(3);
	var Config_1 = __webpack_require__(2);
	var Asteroid = (function (_super) {
	    __extends(Asteroid, _super);
	    function Asteroid(p) {
	        if (p === void 0) { p = new Basics_1.Vector(0, 0); }
	        _super.call(this);
	        this.Type = 0;
	        this.Position = p;
	        this.Type = Math.floor(Math.random() * Config_1.NUM_ASTEROIDS);
	        this.Orientation.setRandom();
	        this.Velocity = this.Orientation.vector.scaled(Math.random() * 20);
	    }
	    return Asteroid;
	}(GameObjects_1.DestructableObject));
	exports.Asteroid = Asteroid;
	//# sourceMappingURL=Asteroid.js.map

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.SENSITIVITY = 1.1;
	var keys_pressed = [];
	var xAxis = 0;
	var yAxis = 0;
	window.addEventListener("keydown", function (e) {
	    keys_pressed.push(e.keyCode || 32);
	    if (e.keyCode == mappings["left"]) {
	        xAxis = Math.max(-1, xAxis - 1);
	    }
	    if (e.keyCode == mappings["right"]) {
	        xAxis = Math.min(xAxis + 1, 1);
	    }
	    if (e.keyCode == mappings["down"]) {
	        yAxis = Math.max(-1, xAxis - 1);
	    }
	    if (e.keyCode == mappings["up"]) {
	        yAxis = Math.min(xAxis + 1, 1);
	    }
	});
	window.addEventListener("keyup", function (e) {
	    var i;
	    while ((i = keys_pressed.indexOf(e.keyCode)) > -1) {
	        keys_pressed.splice(i, 1);
	    }
	    if (e.keyCode == mappings["left"]) {
	        xAxis = Math.min(xAxis + 1, 1);
	    }
	    if (e.keyCode == mappings["right"]) {
	        xAxis = Math.max(-1, xAxis - 1);
	    }
	    if (e.keyCode == mappings["up"]) {
	        yAxis = Math.max(-1, xAxis - 1);
	    }
	    if (e.keyCode == mappings["down"]) {
	        yAxis = Math.min(xAxis + 1, 1);
	    }
	});
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
	function enableMobile(touch) {
	    if (touch === void 0) { touch = document.body; }
	    touch.addEventListener("touchstart", function () {
	        keys_pressed.push(mappings["up"]);
	    });
	    touch.addEventListener("touchend", function () {
	        var i;
	        while ((i = keys_pressed.indexOf(mappings["up"])) > -1) {
	            keys_pressed.splice(i, 1);
	        }
	    });
	    window.addEventListener('deviceorientation', function (e) {
	        var landscape = window.innerHeight < window.innerWidth;
	        try {
	            landscape = window.matchMedia("(orientation: landscape)").matches;
	        }
	        catch (e) { }
	        var a = landscape ? e.beta : e.gamma;
	        xAxis = exports.SENSITIVITY * Math.max(-35, Math.min(a, 35)) / 20;
	    });
	}
	exports.enableMobile = enableMobile;
	function getAxisX() {
	    return xAxis;
	}
	exports.getAxisX = getAxisX;
	function getAxisY() {
	    return yAxis;
	}
	exports.getAxisY = getAxisY;
	//# sourceMappingURL=UserInput.js.map

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map