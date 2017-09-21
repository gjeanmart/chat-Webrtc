var PeerServer = require('peer').PeerServer,
    express = require('express'),
    app = express(),
    port = process.env.PORT || 3001,
    host = '0.0.0.0',
    Topics = {
        USER_CONNECTED   : 'user-connected',
        USER_DISCONNECTED: 'user-disconnected',
        USER_MESSAGE     : 'user-message'
    };


    
    
app.use(express.static(__dirname + '/public'));

var expressServer = app.listen(port,host);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);

var peerServer = new PeerServer({ host: host, port: 9000, path: '/chat' });

peerServer.on('connection', function (id) {
  io.emit(Topics.USER_CONNECTED, id);
  console.log('User connected with #', id);
});

peerServer.on('disconnect', function (id) {
  io.emit(Topics.USER_DISCONNECTED, id);
  console.log('User disconnected with #', id);
});