const http = require('http');

const PORT = 8080;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running on port 8080');
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
