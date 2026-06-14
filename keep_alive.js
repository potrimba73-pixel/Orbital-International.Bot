const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('🤖 Orbital Bot is running! | Anonymous Language Learning Community');
});

server.listen(3000, () => {
  console.log('🌐 Keep-alive server ativo na porta 3000');
});

module.exports = server;
