import { AbstractPlayer } from "../../shared/GameObjects/GameObjects";

export class Player extends AbstractPlayer {

	IP:number;

	ID:number;

	constructor(id:number, name:string) {
		super(name);

		this.ID = id;
	}

}