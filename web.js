var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server, { log: false });

server.listen(process.env.PORT || 5000);

console.log(process.env.PORT);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
	var roomkey;
	socket.on('handshake', function (data) {
		roomkey = data.room;
		connecting_clients = io.sockets.clients(roomkey);
		console.log(connecting_clients);
		console.log("Parties in the room "+connecting_clients.length);
		newroom = true;
		if (!connecting_clients){
			newroom = false;
		}
		console.log("Room Key "+roomkey);
		socket.join(roomkey);
		clientkey = guid()
		socket.emit('handshake', {client_key: clientkey, new_room: newroom});
	});
	socket.on('mousemove', function	(data) {
		socket.broadcast.to(roomkey).emit('mousemove', data);
	});
});

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}