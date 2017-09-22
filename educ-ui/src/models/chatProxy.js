import EventEmitter from 'event-emitter';
import events from "events";
import io from 'socket.io-client';
import Peer from 'peerjs'

var Topics = {
    USER_CONNECTED   : 'user-connected',
    USER_DISCONNECTED: 'user-disconnected',
    USER_MESSAGE     : 'user-message'
};

    
    
    
    

function ChatProxy() {  
    this.eventEmitter = new events.EventEmitter();
    this._peers = {};
}

ChatProxy.prototype = Object.create(EventEmitter.prototype);

ChatProxy.prototype.onMessage = function (cb) {
  this.eventEmitter.addListener(Topics.USER_MESSAGE, cb);
};

ChatProxy.prototype.getUsername = function () {
  return this._username;
};
ChatProxy.prototype.getChannel = function () {
  return this._channel;
};
ChatProxy.prototype.getId = function () {
  return this._id;
};

ChatProxy.prototype.setUsername = function (username) {
  this._username = username;
};
ChatProxy.prototype.setChannel = function (channel) {
  this._channel = channel;
};
ChatProxy.prototype.setId = function (data) {
  this._id = data.channel + '_' + data.username ;
};

ChatProxy.prototype.onUserConnected = function (cb) {
  this.eventEmitter.addListener(Topics.USER_CONNECTED, cb);
};

ChatProxy.prototype.onUserDisconnected = function (cb) {
  this.eventEmitter.addListener(Topics.USER_DISCONNECTED, cb);
};

ChatProxy.prototype.send = function (user, message) {
  this._peers[user].send(message);
};

ChatProxy.prototype.broadcast = function (msg) {
  for (var peer in this._peers) {
    this.send(peer, msg);
  }
};

ChatProxy.prototype.connect = function (data) {
    
    console.log("ChatProxy.connect");
    console.log(data);
    
    var self = this;
    this.setUsername(data.username);
    this.setChannel(data.channel);
    this.setId(data);
    
    this.socket = io('http://192.168.0.23:3001');

    this.socket.on('connect', function () {
        console.log("on connect");
        self.socket.on(Topics.USER_CONNECTED, function (id) {
            if (id === self.getId()) {
                return;
            }
            self._connectTo(id);
            self.eventEmitter.emit(Topics.USER_CONNECTED, id);
            console.log('User connected: '+id);
        });
        
        self.socket.on(Topics.USER_DISCONNECTED, function (id) {
            if (id === self.getId()) {
                return;
            }
            self._disconnectFrom(data.username);
            self.eventEmitter.emit(Topics.USER_DISCONNECTED, id);
            console.log('User disconnected: '+id);
        });
    });
    
    console.log('Connecting to channel #'+data.channel+' with username'+ data.username);
    
    this.peer = new Peer(data.channel+"_"+data.username, {
        host: window.location.hostname,
        port: 9000,
        path: '/chat'
    });
    
    this.peer.on('open', function (id) {
        self.setUsername(id);
    });
    
    this.peer.on('connection', function (conn) {
        self._registerPeer(conn.peer, conn);
        self.eventEmitter.emit(Topics.USER_CONNECTED, conn.peer);
    });
};

ChatProxy.prototype._connectTo = function (username) {
    var conn = this.peer.connect(username);
    conn.on('open', function () {
        this._registerPeer(username, conn);
    }.bind(this));
};

ChatProxy.prototype._registerPeer = function (username, conn) {
    console.log('Registering', username);
    this._peers[username] = conn;
    conn.on('data', function (msg) {
        console.log('Messaga received', msg);
        this.eventEmitter.emit(Topics.USER_MESSAGE, { content: msg, author: username });
    }.bind(this));
};

ChatProxy.prototype._disconnectFrom = function (username) {
    delete this._peers[username];
};


export default ChatProxy;