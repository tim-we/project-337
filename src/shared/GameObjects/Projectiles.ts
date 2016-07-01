import { PhysicalObject } from "./GameObjects";

export abstract class Projectile extends PhysicalObject {
	Color:string = "#fff";
}

export class Bullet extends Projectile {

}

export class LaserBlast extends Projectile {

}