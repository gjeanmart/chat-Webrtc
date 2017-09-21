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

ChatProxy.prototype.setUsername = function (username) {
  this._username = username;
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
      console.log(msg);
  for (var peer in this._peers) {
      console.log(peer);
      console.log(this.eventEmitter);
    this.send(peer, msg);
  }
};

ChatProxy.prototype.connect = function (username) {
  var self = this;
  this.setUsername(username);
  this.socket = io('http://192.168.0.23:3001');
  
  
   //this.socket.connect(); 
  
  this.socket.on('connect', function () {
    self.socket.on(Topics.USER_CONNECTED, function (userId) {
      if (userId === self.getUsername()) {
        return;
      }
      self._connectTo(userId);
      self.eventEmitter.emit(Topics.USER_CONNECTED, userId);
      console.log('User connected', userId);
    });
    self.socket.on(Topics.USER_DISCONNECTED, function (userId) {
      if (userId === self.getUsername()) {
        return;
      }
      self._disconnectFrom(userId);
      self.eventEmitter.emit(Topics.USER_DISCONNECTED, userId);
      console.log('User disconnected', userId);
    });
  });
  console.log('Connecting with username', username);
  this.peer = new Peer(username, {
    host: window.location.hostname,
    port: 9000,
    path: '/chat'
  });
  this.peer.on('open', function (userId) {
    self.setUsername(userId);
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