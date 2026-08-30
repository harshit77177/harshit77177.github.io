const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Welcome to EJS Templating',
    message: 'This page is rendered dynamically using EJS.'
  });
});

app.get('/students', (req, res) => {
  const students = [
    { name: 'Harshit Singh', course: 'Backend Development' },
    { name: 'Jasprit', course: 'Node.js' },
    { name: 'Rohit', course: 'Express.js' }
  ];

  res.render('students', {
    title: 'Student List',
    students
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});