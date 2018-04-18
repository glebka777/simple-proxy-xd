const socks = require("@heroku/socksv5");
const WebSocketServer = require("ws").Server;
const express = require("express");

const port = process.env.PORT || 1080;
const users = JSON.parse(process.env.USERS) || {};


const app = express();
app.use(express.static(__dirname + "/"));

const server = socks.createServer(function(info, accept, deny) {
  accept();
}).on('error', (err) => {
  console.log('Got error: ' + err);
}).on('connection', (connection) => {
  console.log('Connection: ' + connection.srcAddr + ':' + connection.srcPort + ' => ' + connection.dstAddr + ':' + connection.dstPort);
});
server.useAuth(socks.auth.UserPassword(function(user, password, cb) {
  let foundPassword = users[user];
  let matched = (password === foundPassword);
  if (matched)
    console.log('Authorized user: ' + user);
  else
    console.log('Failed login attempt. User: ' + user);
  cb(matched);
}));
server.listen(port, function() {
  console.log('SOCKS server listening on port ' + port);
});


const wss = new WebSocketServer({server: server});

wss.on('connection', (socket) => {
  console.log('Client connected via web-socket');
  socket.on('disconnect', () => console.log('Client disconnected via web-socket'));
});