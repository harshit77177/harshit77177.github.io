const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('Welcome to the home page!');
  }

  if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('This is the about page.');
  }

  if (req.url === '/contact' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('Contact us at contact@example.com.');
  }

  if (req.url === '/services' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('Our services include web development and API development.');
  }

  res.writeHead(404);
  res.end('Page not found.');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});