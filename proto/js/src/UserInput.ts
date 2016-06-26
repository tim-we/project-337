var keys_pressed:number[] = [];

window.addEventListener("keydown", function(e) {
	keys_pressed.push(e.keyCode || 32);
});
window.addEventListener("keyup", function(e) {
	let i:number;

	while((i = keys_pressed.indexOf(e.keyCode)) > -1) {
		keys_pressed.splice(i, 1);
	}
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