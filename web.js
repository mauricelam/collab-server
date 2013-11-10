var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

server.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
	var roomkey;
    var html_source;
	socket.on('handshake', function (data) {
		roomkey = data.room;
		connecting_clients = io.sockets.clients(roomkey);
		console.log(connecting_clients);
		console.log("Parties in the room " + connecting_clients.length);
		newroom = connecting_clients.length === 0;
		console.log("Room Key " + roomkey);
		socket.join(roomkey);
		clientkey = guid();

        var returnmsg = {client_key: clientkey, new_room: newroom};
        if (html_source) {
            returnmsg.html_source = html_source;
        }
		socket.emit('handshake', returnmsg);
	});
    socket.on('htmlsource', function (data) {
        html_source = data.source;
    });
	socket.on('mousemove', function	(data) {
		socket.broadcast.to(roomkey).emit('mousemove', data);
	});
});

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
}

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}