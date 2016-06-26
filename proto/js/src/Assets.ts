export class Vector2 {
	public x: number;
	public y: number;

	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}

	public scale(f:number):Vector2 {
		return new Vector2(f * this.x, f * this.y);
	}

	get len2():number {
		return this.x*this.x + this.y*this.y;
	}

	public clone():Vector2 {
		return new Vector2(this.x,this.y);
	}

	public static add(a:Vector2, b:Vector2):Vector2 {
		return new Vector2(
			a.x + b.x,
			a.y + b.y
		);
	}
}