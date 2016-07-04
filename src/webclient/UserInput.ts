export var SENSITIVITY:number = 1;

var keys_pressed:number[] = [];

var xAxis:number = 0;
var yAxis:number = 0;

window.addEventListener("keydown", function(e) {
	keys_pressed.push(e.keyCode || 32);

	if(e.keyCode == mappings["left"]) { xAxis = Math.max(-1, xAxis-1); }
	if(e.keyCode == mappings["right"]) { xAxis = Math.min(xAxis+1, 1); }

	if(e.keyCode == mappings["down"]) { yAxis = Math.max(-1, xAxis-1); }
	if(e.keyCode == mappings["up"]) { yAxis = Math.min(xAxis+1, 1); }
});
window.addEventListener("keyup", function(e) {
	let i:number;

	while((i = keys_pressed.indexOf(e.keyCode)) > -1) {
		keys_pressed.splice(i, 1);
	}

	if(e.keyCode == mappings["left"]) { xAxis = Math.min(xAxis+1, 1); }
	if(e.keyCode == mappings["right"]) { xAxis = Math.max(-1, xAxis-1); }

	if(e.keyCode == mappings["up"]) { yAxis = Math.max(-1, xAxis-1); }
	if(e.keyCode == mappings["down"]) { yAxis = Math.min(xAxis+1, 1); }
});

//http://stackoverflow.com/questions/6199038/javascript-event-triggered-by-pressing-space
var mappings:{ [key:string]:number; } = {
	"fire": 32,
	"space": 32,
	"enter": 13,
	"esc": 27,
	"ctrl": 17,
	"alt": 18,
	"shift": 16,
	"up": 38,
	"down": 40,
	"right": 39,
	"left": 37
}

export function isPressed(id:string):boolean {
	if(mappings[id]) {
		let i = keys_pressed.indexOf(mappings[id]);

		return i>-1;
	} else {
		throw new Error("Key mapping not supported.");
	}
}

export function enableMobile(touch:HTMLElement = document.body):void {
	touch.addEventListener("touchstart", function(){
		keys_pressed.push(mappings["up"]);
	});

	touch.addEventListener("touchend", function(){
		let i:number;

		while((i = keys_pressed.indexOf(mappings["up"])) > -1) {
			keys_pressed.splice(i, 1);
		}
	});

	window.addEventListener('deviceorientation', function(e:DeviceOrientationEvent){
		let landscape:boolean = window.innerHeight < window.innerWidth;

		try {
			landscape = window.matchMedia("(orientation: landscape)").matches;
		} catch(e) { /* not supported by device */ }
		
		let a = landscape ? e.beta : e.gamma;
		xAxis = SENSITIVITY * Math.max(-35, Math.min(a, 35)) / 15;
	});
}

export function getAxisX():number {
	return xAxis;
}

export function getAxisY():number {
	return yAxis;
}