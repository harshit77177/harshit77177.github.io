const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

const studentInfo = {
  name: 'Harshit Singh',
  rollNumber: '56282',
  branch: 'Backend Development'
};

const students = [
  { id: 1, name: 'Harshit Singh', email: 'harshit@example.com', course: 'Backend Development', semester: '5' },
  { id: 2, name: 'jasprit', email: 'jasprit@example.com', course: 'Node JS', semester: '5' },
  { id: 3, name: 'rohit', email: 'rohit@example.com', course: 'Express JS', semester: '5' }
];

const timetable = [
  { day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Node JS Basics', faculty: 'Prof. Mehta' },
  { day: 'Tuesday', time: '11:00 AM - 12:00 PM', subject: 'Express Routing', faculty: 'Prof. Shah' },
  { day: 'Wednesday', time: '12:00 PM - 01:00 PM', subject: 'REST API', faculty: 'Prof. Kumar' },
  { day: 'Thursday', time: '02:00 PM - 03:00 PM', subject: 'EJS Templates', faculty: 'Prof. Singh' },
  { day: 'Friday', time: '03:00 PM - 04:00 PM', subject: 'Form Handling', faculty: 'Prof. Patel' }
];

// Task 1: Basic Server
app.get('/name/text', (req, res) => {
  res.send(`Name: ${studentInfo.name}`);
});

app.get('/name/html', (req, res) => {
  res.send(`
    <h1>Student Details</h1>
    <p><strong>Name:</strong> ${studentInfo.name}</p>
    <p><strong>Roll Number:</strong> ${studentInfo.rollNumber}</p>
    <p><strong>Branch:</strong> ${studentInfo.branch}</p>
  `);
});

app.get('/name/json', (req, res) => {
  res.json(studentInfo);
});

// Task 2: Calculator API
app.get('/calculate', (req, res) => {
  const { num1, num2, operation } = req.query;
  const n1 = parseFloat(num1);
  const n2 = parseFloat(num2);

  if (Number.isNaN(n1) || Number.isNaN(n2)) {
    return res.status(400).json({
      error: 'Please provide valid num1 and num2 query parameters'
    });
  }

  let result;

  switch (operation) {
    case 'add':
      result = n1 + n2;
      break;
    case 'subtract':
      result = n1 - n2;
      break;
    case 'multiply':
      result = n1 * n2;
      break;
    case 'divide':
      if (n2 === 0) {
        return res.status(400).json({ error: 'Division by zero is not allowed' });
      }
      result = n1 / n2;
      break;
    case 'modulus':
      if (n2 === 0) {
        return res.status(400).json({ error: 'Modulus by zero is not allowed' });
      }
      result = n1 % n2;
      break;
    case 'power':
      result = n1 ** n2;
      break;
    default:
      return res.status(400).json({
        error: 'Invalid operation',
        allowedOperations: ['add', 'subtract', 'multiply', 'divide', 'modulus', 'power']
      });
  }

  res.json({
    num1: n1,
    num2: n2,
    operation,
    result
  });
});

// Task 3: Student Management
app.get('/students', (req, res) => {
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const student = students.find((item) => item.id === Number(req.params.id));
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  res.json(student);
});

app.post('/students/add', (req, res) => {
  const { name, email, course, semester } = req.body;

  if (!name || !email || !course || !semester) {
    return res.status(400).json({
      message: 'Please provide name, email, course, and semester'
    });
  }

  const newStudent = {
    id: students.length + 1,
    name,
    email,
    course,
    semester
  };

  students.push(newStudent);

  res.status(201).json({
    message: 'Student added successfully',
    student: newStudent
  });
});

// Task 4: EJS Timetable
app.get('/timetable', (req, res) => {
  res.render('timetable', { timetable });
});

// Task 5: Form Handling
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const { name, email, course, semester } = req.body;

  res.render('result', {
    student: {
      name,
      email,
      course,
      semester
    }
  });
});

app.get('/', (req, res) => {
  res.send('Express Lab App is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});