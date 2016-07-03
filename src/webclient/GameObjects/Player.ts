import { Vector, Orientation } from "../../shared/Basics";
import { AbstractPlayer } from "../../shared/GameObjects/GameObjects";
import { PLAYER_ACCELERATION } from "../../shared/Config";

export class Player extends AbstractPlayer {

	constructor(name:string) {
		super(name);
	}

	public accelerate(f:number):void {
		f = f * PLAYER_ACCELERATION;
		this.Velocity.x += this.Orientation.vector.x * f;
		this.Velocity.y += this.Orientation.vector.y * f;
	}

	public shoot() {
		if(!this.allowShoot()) { return; }
	}
}

export class OtherPlayer extends AbstractPlayer {
	constructor(name:string) {
		super(name);
	}
}