import { DestructableObject } from "./GameObjects";
import { PLAYER_ACCELERATION } from "../Config";

export class Player extends DestructableObject {

	Name:string;

	Level:number;

	constructor(name:string) {
		super();

		this.Name = name;
	}

	public accelerate(f:number):void {
		f = f * PLAYER_ACCELERATION;
		this.Velocity.x += this.Orientation.vector.x * f;
		this.Velocity.y += this.Orientation.vector.y * f;
	}

}