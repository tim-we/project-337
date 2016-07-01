import {Vector, Orientation} from "../Basics";
import { Projectile, Bullet } from "./Projectiles";

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

}

import { PLAYER_ACCELERATION } from "../Config";

export abstract class ControllableObject extends DestructableObject {

	protected a:number = PLAYER_ACCELERATION;

	public accelerate(a:number):void {
		this.Velocity = Vector.add(
				this.Velocity, 
				this.Orientation.vector.scaled(this.a)
			);
	}

	protected allowShoot():boolean {
		return true;
	}

	public shoot():Projectile {
		if(this.allowShoot()) {
			return new Bullet(this.Position, this.Velocity.scaled(0.5));
		} else {
			return null;
		}	
	}
}