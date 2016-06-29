import {WORLD_SIZE, ASTEROID_SPEED, BULLET_SPEED, PLAYER_ACCELERATION, PLAYER_MAX_SPEED2, BULLET_LIFETIME, AI_FIRE_COOLDOWN} from "./config";
import {Vector2} from "./Assets";
import * as tex from "./Textures";

export interface GameObject {
	Position:Vector2;
	Rotation:number;
	Texture:HTMLImageElement;

	move(t:number):void;

	distance2To(point:Vector2):number;
}

export interface Controllable {
	Position:Vector2;
	DirectionVector:Vector2;

	accelerate(t:number):void;

	shoot():ShootingParticle;
}

export interface Particle {
	Position:Vector2;
	Rotation:number;

	isAlive:boolean;

	color:string;

	move(t:number):void;

	distance2To(point:Vector2):number;
}

class MovingObject {

	Position:Vector2;
	Velocity:Vector2;

	protected _alpha = 0;

	public move(t:number) {
		let p = this.Position;

		p.x += t * this.Velocity.x;
		p.y += t * this.Velocity.y;

		//repeating world
		while(Math.abs(p.x) > WORLD_SIZE) {
			if(p.x > WORLD_SIZE) { p.x = (p.x - WORLD_SIZE) - WORLD_SIZE; }
			else { p.x = WORLD_SIZE + (WORLD_SIZE + p.x); }
		}
		while(Math.abs(p.y) > WORLD_SIZE) {
			if(p.y > WORLD_SIZE) { p.y = (p.y - WORLD_SIZE) - WORLD_SIZE; }
			else { p.y = WORLD_SIZE + (WORLD_SIZE + p.y); }
		}
	}

	public distance2To(point:Vector2):number {
		let x = this.Position.x - point.x;
		let y = this.Position.y - point.y;

		return x*x + y*y;
	}
}

export class Asteroid extends MovingObject implements GameObject {	

	public Texture:HTMLImageElement;

	constructor(pos:Vector2 = getRandomWorldPos()) {
		super();

		this.Position = pos;

		//random direction
		let alpha = Math.random() * 2 * Math.PI;
		this.Velocity = new Vector2(Math.cos(alpha), Math.sin(alpha));	
		this.Velocity = this.Velocity.scale(ASTEROID_SPEED);

		//pick random texture
		this.Texture = tex.ASTEROIDS[Math.floor(Math.random() * tex.ASTEROIDS.length)];
		
	}

	get Rotation() { return this._alpha; }
}

export class ShootingParticle extends MovingObject implements Particle {

	public color:string = "#fff";

	private alive:boolean;
	private birth:number;

	constructor(pos:Vector2, vel:Vector2) {
		super();

		this.alive = true;
		this.birth = Date.now();

		this.Position = pos;
		this.Velocity = vel;
	}

	get isAlive() { return this.alive && (Date.now()-this.birth)<BULLET_LIFETIME; }
	get Rotation() { return this._alpha; }

}

export class LaserShootingParticle extends ShootingParticle {
	public color:string = "#00ff00";
}

export class Player extends MovingObject implements GameObject, Controllable {

	Texture:HTMLImageElement;

	private _health:number;

	DirectionVector:Vector2;

	constructor() {
		super();

		this.Position = new Vector2();
		this.Velocity = new Vector2();
		this.DirectionVector = new Vector2(1,0);

		this.Texture = tex.PLAYER;

		this.Health = 100;
	}

	set Rotation(a:number) { 
		this._alpha = a;

		this.DirectionVector = new Vector2(Math.cos(a), Math.sin(a));
	}
	get Rotation() { return this._alpha; }

	get Health() { return this._health; }
	set Health(h:number) { this._health = Math.max(0,h); }

	public shoot():ShootingParticle {
		let p:Vector2 = Vector2.add(this.Position, this.DirectionVector.scale(20));
		let v:Vector2 = Vector2.add(this.Velocity, this.DirectionVector.scale(BULLET_SPEED));
		return new ShootingParticle(p, v);
	}

	public accelerate(t:number) {
		let v = this.DirectionVector.scale(PLAYER_ACCELERATION * t);
		this.Velocity.x += v.x;
		this.Velocity.y += v.y;

		let max = PLAYER_MAX_SPEED2;

		if(this.Velocity.len2 > max) {
			let f = Math.sqrt( max / this.Velocity.len2 );

			this.Velocity = this.Velocity.scale(f);
		}
	}
}

import {getRandomWorldPos} from "./Assets";

export class Alien extends MovingObject implements GameObject, Controllable {

	DirectionVector:Vector2;

	private _enemies:GameObject[];

	private _lastShot:number;

	public Rotation:number = 0;

	public Texture:HTMLImageElement;

	constructor() {
		super();

		this._enemies = [];

		this._lastShot = 0;

		this.Texture = tex.UFO;

		this.Position = getRandomWorldPos();
		this.Velocity = new Vector2(30,15);
		this.DirectionVector = new Vector2();
	}

	public shoot():ShootingParticle {
		let p:Vector2 = Vector2.add(this.Position, this.DirectionVector.scale(20));
		let v:Vector2 = Vector2.add(this.Velocity, this.DirectionVector.scale(BULLET_SPEED));

		this._lastShot = Date.now();

		return new LaserShootingParticle(p, v);
	}

	public see(p:Player[] = [], a:Asteroid[] = []) {
		this._enemies = p;
	}

	public turnTowards(p:Vector2):void {
		let v:Vector2 = Vector2.add(this.Position, p.scale(-1));

		if(v.x == 0 && v.y == 0) { return; }

		this.DirectionVector = v.scale(-1/Math.sqrt(v.len2));
	}

	public shootMaybe():ShootingParticle {
		if((Date.now() - this._lastShot) < AI_FIRE_COOLDOWN) { return; }

		let min_d2:number = 500 ** 2;
		let enemy:GameObject = null;

		for(let i=0; i<this._enemies.length; i++) {
			let e = this._enemies[i];

			let tmp:number = e.distance2To(this.Position);

			if(tmp < min_d2) {
				min_d2 = tmp;
				enemy = e;
			}
		}

		if(enemy != null) {

			this.turnTowards(enemy.Position);

			return this.shoot();
		}

		return;
	}

	public accelerate(t:number) {}
}

export class Star{
	Position:Vector2;
	Brightness:number;
	constructor() {
		this.Position = new Vector2(
				(-1+Math.random()*2) * WORLD_SIZE,
				(-1+Math.random()*2) * WORLD_SIZE
			);
		this.Brightness = Math.round((Math.random()**7)*170);
			
		
	} 
}