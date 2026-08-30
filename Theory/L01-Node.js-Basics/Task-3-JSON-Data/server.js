const http = require('http');

const PORT = 3000;

const students = [
  { id: 1, name: 'Harshit Singh', course: 'Backend Development' },
  { id: 2, name: 'Jasprit', course: 'Node.js' },
  { id: 3, name: 'Rohit', course: 'Express.js' }
];

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && requestUrl.pathname === '/') {
    return sendJson(res, 200, {
      message: 'Welcome to the JSON Data API'
    });
  }

  if (req.method === 'GET' && requestUrl.pathname === '/students') {
    return sendJson(res, 200, students);
  }

  const studentMatch = requestUrl.pathname.match(/^\/students\/(\d+)$/);
  if (req.method === 'GET' && studentMatch) {
    const student = students.find((item) => item.id === Number(studentMatch[1]));

    if (!student) {
      return sendJson(res, 404, { error: 'Student not found' });
    }

    return sendJson(res, 200, student);
  }

  sendJson(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});