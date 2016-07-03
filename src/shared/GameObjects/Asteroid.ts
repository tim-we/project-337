import { DestructableObject } from "./GameObjects";
import { Vector } from "../Basics";
import { NUM_ASTEROIDS } from "../Config";

export class Asteroid extends DestructableObject {

	public Type:number = 0;

	constructor(p:Vector = new Vector(0,0)) {
		super();

		this.Position = p;
		this.Type = Math.floor(Math.random() * NUM_ASTEROIDS);
	}

}