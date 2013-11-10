var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

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
	socket.emit('news', { hello: 'world' });
	socket.on('handshake', function (data) {
		roomkey = data.room;
		socket.join(roomkey);
		clientkey = guid()
		socket.emit({client_key: clientkey});
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