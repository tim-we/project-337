import {WORLD_SIZE, ASTEROID_SPEED} from "./config";
import {Vector2} from "./Assets";
import * as tex from "./Textures";

export interface GameObject {
	Position:Vector2;
	Rotation:number;
	Texture:HTMLImageElement;

	move(t:number):void;

	distance2To(point:Vector2):number;
}

class MovingObject {

	Position:Vector2;
	Velocity:Vector2;

	Rotation:number = 0;

	public move(t:number) {
		let p = this.Position;

		p.x += t * this.Velocity.x;
		p.y += t * this.Velocity.y;

		//repeating world
		while(Math.abs(p.x) > WORLD_SIZE) {
			if(p.x > WORLD_SIZE) { p.x = (p.x - WORLD_SIZE) - WORLD_SIZE; }
			else { p.x = WORLD_SIZE + (WORLD_SIZE - p.x); }
		}
		while(Math.abs(p.y) > WORLD_SIZE) {
			if(p.y > WORLD_SIZE) { p.y = (p.y - WORLD_SIZE) - WORLD_SIZE; }
			else { p.y = WORLD_SIZE + (WORLD_SIZE - p.y); }
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
		this.Velocity = new Vector2(Math.sin(alpha), Math.cos(alpha));	
		this.Velocity.scale(ASTEROID_SPEED);

		//pick random texture
		this.Texture = tex.ASTEROIDS[Math.floor(Math.random() * tex.ASTEROIDS.length)];
		
	}

}

export class Player extends MovingObject implements GameObject {

	Texture:HTMLImageElement;

	constructor() {
		super();

		this.Position = new Vector2();
		this.Velocity = new Vector2();

		this.Texture = tex.PLAYER;
	}

}