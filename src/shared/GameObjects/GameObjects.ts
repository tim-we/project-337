import {Vector, Orientation} from "../Basics";
//circular dependency, http://stackoverflow.com/questions/35240716/webpack-import-returns-undefined-depending-on-the-order-of-imports
//import { Projectile, Bullet } from "./Projectiles";

export abstract class PhysicalObject {

	public Position:Vector;
	public Velocity:Vector;
	public Orientation:Orientation;

	constructor(p:Vector = new Vector(), v:Vector = new Vector(), a:number=0) {
		this.Position = p;
		this.Velocity = v;
		this.Orientation = new Orientation(a);
	}

	public move(f:number) {
		this.Position = Vector.add(this.Position, this.Velocity.scaled(f));
	}
}

export abstract class DestructableObject extends PhysicalObject {

	public Health:number = 100;
	public Radius:number = 42;

	public isAlive():boolean {
		return this.Health > 0;
	}

}

import { PLAYER_SHOOT_COOLDOWN } from "../Config";

export abstract class AbstractPlayer extends DestructableObject {

	public Name:string;

	public Level:number;

	private _lastShot:number;

	private _cooldown:number = PLAYER_SHOOT_COOLDOWN;

	private _xp:number = 0;

	constructor(name:string) {
		super();

		this.Name = name;
	}

	public allowShoot():boolean {
		return (Date.now() - this._lastShot) > this._cooldown;
	}

}