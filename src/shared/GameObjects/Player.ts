import { DestructableObject } from "./GameObjects";
import { PLAYER_ACCELERATION } from "../Config";

export class Player extends DestructableObject {

	Name:string;

	Level:number;

	constructor(name:string) {
		super();

		this.Name = name;
	}

}