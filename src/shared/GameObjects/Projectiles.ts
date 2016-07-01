import { Vector } from "../Basics";
import { PhysicalObject } from "./GameObjects";

export abstract class Projectile extends PhysicalObject {
	Color:string = "#fff";

	constructor(p:Vector, v:Vector) {
		super(p,v);
	}
}

export class Bullet extends Projectile {
	constructor(p:Vector, v:Vector) {
		super(p,v);
	}
}

export class LaserBlast extends Projectile {

	Color:string = "#00ff00";

	constructor(p:Vector, v:Vector) {
		super(p,v);
	}
}