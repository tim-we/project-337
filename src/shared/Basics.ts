export class Vector {

	public x:number;
	public y:number;

	constructor(x:number = 0, y:number = 0) {
		this.x = x;
		this.y = y;
	}

	public toString():string {
		return "(" + this.x + "," + this.y + ")";
	}

	public clone():Vector {
		return new Vector(this.x, this.y);
	}

	/* scales this vector */
	public scale(f:number):Vector {
		this.x *= f;
		this.y *= f;

		return this;
	}

	/* returns a new scaled vector */
	public scaled(f:number):Vector {
		return this.clone().scale(f);
	}

	public static add(a:Vector, b:Vector):Vector {
		return new Vector(a.x + b.x, a.y + b.y);
	}

	public static subtract(a:Vector, b:Vector):Vector {
		return new Vector(a.x - b.x, a.y - b.y);
	}

	public length2():number {
		return this.x*this.x + this.y*this.y;
	}

	public length():number {
		return Math.sqrt(this.length2());
	}
}

export class Orientation {
	public alpha:number;

	public vector:Vector;

	constructor(x:number = 0) {
		this.alpha = x;

		this.vector = new Vector(
			Math.cos(x),
			Math.sin(x)
		);
	}
}

/* 2x2 matrix */
export class Matrix {

	a: number;
	b: number;
	c: number;
	d: number;

	constructor(x:number|number[] = 1) {
		if(x instanceof Array) {
			//assume x.length == 4
			this.a = x[0];
			this.b = x[1];
			this.c = x[2];
			this.d = x[3];
		} else {
			//multiple of unit matrix
			this.a = this.c = x;
			this.b = this.d = 0;
		}
	}

	public static Mirror(alpha:number) {
		let a = 2 * alpha;
		let c = Math.cos(a);
		let s = Math.sin(a);

		return new Matrix([c,s,s,-c]);
	}

	public static Rotation(alpha:number) {
		let c = Math.cos(alpha);
		let s = Math.sin(alpha);

		return new Matrix([c,-s,s,c]);
	}

	/* matrix-vector product */
	public vector(v:Vector):Vector {
		return new Vector(
			this.a * v.x + this.b * v.y,
			this.c * v.x + this.d * v.y
		);
	}
}