import {Vector} from "../shared/Basics";
import * as scfg from "./Server-Config";
import * as gcfg from "../shared/Config";

console.log("Hello Motherfucker, halts Maul!");

//var http = require('http').Server(app);
var http = require("http").createServer(function(req, res){
	console.log("http request");
});

http.listen(gcfg.SERVER_PORT);

var io = require("socket.io")(http);

io.on('connection', function(socket){
	console.log('a user connected');
		socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	socket.on('Position', function(data){
		if(data instanceof Vector) {
			console.log('we got a vector!');
		}
		console.log('user position: ' + JSON.stringify(data));
	});
});

//console.log("end");