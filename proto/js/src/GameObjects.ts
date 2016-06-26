import {WORLD_SIZE, ASTEROID_SPEED, BULLET_SPEED, PLAYER_ACCELERATION, PLAYER_MAX_SPEED2} from "./config";
import {Vector2} from "./Assets";
import * as tex from "./Textures";

export interface GameObject {
	Position:Vector2;
	Rotation:number;
	Texture:HTMLImageElement;

	move(t:number):void;

	distance2To(point:Vector2):number;
}

export interface Particle {
	Position:Vector2;
	Rotation:number;

	isAlive:boolean;

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

	Texture:HTMLImageElement;

	constructor(pos:Vector2) {
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

	Texture:HTMLImageElement;

	alive:boolean;

	constructor(pos:Vector2, vel:Vector2) {
		super();

		this.alive = true;

		this.Position = pos;
		this.Velocity = vel;
	}

	get isAlive() { return this.alive; }
	get Rotation() { return this._alpha; }

}

export class Player extends MovingObject implements GameObject {

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
		let v:Vector2 = Vector2.add(this.Velocity, this.DirectionVector.scale(BULLET_SPEED));
		return new ShootingParticle(this.Position.clone(), v);
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


export class star{
	Position:Vector2;
	constructor() {
		this.Position = new Vector2(Math.random()*WORLD_SIZE,Math.random()*WORLD_SIZE);
	} 
}