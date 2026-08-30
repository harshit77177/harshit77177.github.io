const http = require('http');

const PORT = 3000;

const sendHtml = (res, statusCode, html) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && requestUrl.pathname === '/') {
    return sendHtml(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Home</title></head>
        <body>
          <h1>Welcome to the HTML Responses Server</h1>
          <p>This is the home page.</p>
        </body>
      </html>
    `);
  }

  if (req.method === 'GET' && requestUrl.pathname === '/about') {
    return sendHtml(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
        <head><title>About</title></head>
        <body>
          <h1>About Us</h1>
          <p>We build simple and useful Node.js applications.</p>
        </body>
      </html>
    `);
  }

  if (req.method === 'GET' && requestUrl.pathname === '/contact') {
    return sendHtml(res, 200, `
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Contact</title></head>
        <body>
          <h1>Contact Us</h1>
          <p>Email: contact@example.com</p>
        </body>
      </html>
    `);
  }

  sendHtml(res, 404, `
    <!DOCTYPE html>
    <html lang="en">
      <head><title>404 - Not Found</title></head>
      <body>
        <h1>404 - Page Not Found</h1>
        <p>The requested page does not exist.</p>
      </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});