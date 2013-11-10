var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, { log: false });

server.listen(process.env.PORT || 5000);

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.get('/client', function (req, res) {
  res.sendfile('blank.html');
});

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

var images = {};
var htmls = {};

io.sockets.on('connection', function (socket) {
	var roomkey;
	socket.on('handshake', function (data) {
		roomkey = data.room;
		connecting_clients = io.sockets.clients(roomkey);
		console.log("Parties in the room " + connecting_clients.length);
		newroom = connecting_clients.length === 0;
		console.log("Room Key " + roomkey);
		socket.join(roomkey);
		clientkey = guid();

    console.log('source', images);
    var returnmsg = {client_key: clientkey, new_room: newroom};
    if (images[roomkey]) {
      returnmsg.image = images[roomkey];
    }
    if (htmls[roomkey]) {
      returnmsg.source = htmls[roomkey];
    }
		socket.emit('handshake', returnmsg);
	});
  socket.on('htmlsource', function (data) {
    htmls[roomkey] = data.source;
    socket.broadcast.to(roomkey).emit('htmlsource', htmls[roomkey]);
  });
  socket.on('pageimage', function (data) {
    images[roomkey] = data.source;
    console.log(data.source);
    socket.broadcast.to(roomkey).emit('pageimage', images[roomkey]);
  });
	socket.on('mousemove', function	(data) {
		socket.broadcast.to(roomkey).emit('mousemove', data);
	});
  socket.on('broadcast', function (data) {
    socket.broadcast.to(roomkey).emit('broadcast', data);
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