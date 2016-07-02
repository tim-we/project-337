import {Vector} from "../shared/Basics";
import * as scfg from "./Server-Config";
import * as gcfg from "../shared/Config";

console.log("server started.");

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

	socket.on('update velocity', function(data){
		console.log('user velocity: ' + JSON.stringify(data));
	});

	socket.on("request version", function(client_version){
		socket.emit("server version", gcfg.VERSION);
	});
});