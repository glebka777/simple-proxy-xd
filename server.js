const socks = require("@heroku/socksv5");

const port = process.env.PORT || 1080;
const users = JSON.parse(process.env.USERS) || {};


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