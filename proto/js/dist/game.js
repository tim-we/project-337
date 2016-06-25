var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Vector2D = (function () {
    function Vector2D(x, y) {
        this._x = x;
        this._y = y;
    }
    Object.defineProperty(Vector2D.prototype, "x", {
        get: function () { return this._x; },
        set: function (sx) { this._x = sx; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector2D.prototype, "y", {
        get: function () { return this._y; },
        set: function (sy) { this._y = sy; },
        enumerable: true,
        configurable: true
    });
    return Vector2D;
}());
var World = (function () {
    function World() {
    }
    Object.defineProperty(World.prototype, "size", {
        get: function () { return this._hsize * 2; },
        set: function (s) { this._hsize = Math.abs(s) / 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(World.prototype, "hsize", {
        get: function () { return this._hsize; },
        enumerable: true,
        configurable: true
    });
    return World;
}());
var world = new World();
world.size = 100;
var Position2D = (function (_super) {
    __extends(Position2D, _super);
    function Position2D(x, y) {
        _super.call(this, x, y);
    }
    Object.defineProperty(Position2D.prototype, "x", {
        set: function (sx) {
            var width = world.hsize;
            if (Math.abs(sx) < width) {
                this._x = sx;
            }
            else {
                if (sx > width) {
                    this._x = sx - width;
                }
                else {
                    this._x = width - sx;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position2D.prototype, "y", {
        set: function (sy) {
            var width = world.hsize;
            if (Math.abs(sy) < width) {
                this._x = sy;
            }
            else {
                if (sy > width) {
                    this._x = sy - width;
                }
                else {
                    this._x = width - sy;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    return Position2D;
}(Vector2D));
var MovingObject = (function () {
    function MovingObject(pos) {
        if (pos === void 0) { pos = new Position2D(0, 0); }
        this.Position = pos;
    }
    MovingObject.prototype.move = function (t) {
        this.Position.x += t * this.Velocity.x;
        this.Position.y += t * this.Velocity.y;
    };
    return MovingObject;
}());
window.addEventListener("load", function () {
    var display = document.getElementById("display");
    var ctx = display.getContext("2d");
});
//# sourceMappingURL=game.js.map