import {Vector, Orientation} from "../Basics";

export abstract class PhysicalObject {

	public Position:Vector;
	public Velocity:Vector;
	public Orientation:Orientation;

	constructor(p:Vector = new Vector(), v:Vector = new Vector(), a:number=0) {
		this.Position = p;
		this.Velocity = v;
		this.Orientation = new Orientation(a);
	}

}

export abstract class DestructableObject extends PhysicalObject {

	public Health:number = 100;
	public Radius:number = 42;

}

export abstract class ControllableObject extends DestructableObject {

	protected lastShot:number;

	public accelerate(a:number) {

	}

	public shoot() {

	}
}