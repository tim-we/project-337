import { AbstractPlayer } from "./GameObjects";
import { PLAYER_ACCELERATION } from "../Config";
import { Vector, Orientation } from "../Basics";

/*export class Player extends DestructableObject {

	Name:string;

	Level:number;

	constructor(name:string) {
		super();

		this.Name = name;
	}

}*/

export class PlayerTransfer {

	Name:string;

	ID:number;

	Position:Vector;

	Veclocity:Vector;

	alpha:number;

	constructor(p:AbstractPlayer,id:number) {
		this.Name = p.Name;
		this.ID = id;
		this.Position = p.Position;
		this.Veclocity = p.Velocity;
		this.alpha = p.Orientation.alpha;
	}
}