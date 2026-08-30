const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'experiment-12-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000, httpOnly: true }
}));

function page(title, content, req) {
  const dark = req.cookies.theme === 'dark';
  return `<!doctype html>
<html lang="en" data-theme="${dark ? 'dark' : 'light'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root { font-family: system-ui, sans-serif; color: #172033; background: #f4f7fb; }
[data-theme="dark"] { color: #e5edf8; background: #101827; }
body { margin: 0; } main { width: min(720px, calc(100% - 32px)); margin: 40px auto; }
section { padding: 24px; border-radius: 12px; border: 1px solid #cbd5e1; background: #fff; box-shadow: 0 8px 24px #17203312; }
[data-theme="dark"] section { background: #182336; border-color: #334155; box-shadow: none; }
h1 { margin-top: 0; } form { display: grid; gap: 12px; margin: 16px 0; }
input, button { font: inherit; padding: 10px 12px; border-radius: 6px; border: 1px solid #94a3b8; }
button { cursor: pointer; background: #0e7490; color: white; border-color: #0e7490; }
a { color: #0369a1; } [data-theme="dark"] a { color: #7dd3fc; }
li { margin: 10px 0; display: flex; justify-content: space-between; gap: 12px; }
.inline { display: inline; } .message { color: #b45309; }
</style></head><body><main><section>${content}</section></main></body></html>`;
}

function authMiddleware(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/login');
}

function formPage(title, action, submit, prompt, req) {
  return page(title, `<h1>${title}</h1>
    <form action="${action}" method="post">
      <label>Username <input name="username" required autocomplete="username"></label>
      <label>Password <input type="password" name="password" required autocomplete="current-password"></label>
      <button type="submit">${submit}</button>
    </form><p>${prompt}</p><p><a href="/">Home</a></p>`, req);
}

app.get('/', (req, res) => {
  const user = req.session.user;
  const content = user
    ? `<h1>Welcome, ${user.username}</h1><p>Your login is stored in the server session.</p>
       <p><a href="/dashboard">Dashboard</a> | <a href="/todo">To-do list</a></p>
       <form action="/logout" method="post"><button type="submit">Logout</button></form>`
    : `<h1>Session and Cookie Demo</h1><p>Register or log in to create a session.</p>
       <p><a href="/register">Register</a> | <a href="/login">Login</a> | <a href="/todo">Try the session to-do list</a></p>`;
  res.send(page('Session and Cookie Demo', content, req));
});

app.get('/register', (req, res) => res.send(formPage('Register', '/register', 'Create account', 'Already registered? <a href="/login">Log in</a>.', req)));
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.some(user => user.username === username)) return res.status(409).send(page('Register', '<p class="message">Username already exists.</p><p><a href="/register">Try again</a></p>', req));
  users.push({ username, password });
  res.redirect('/login');
});

app.get('/login', (req, res) => res.send(formPage('Login', '/login', 'Log in', 'Need an account? <a href="/register">Register</a>.', req)));
app.post('/login', (req, res) => {
  const user = users.find(candidate => candidate.username === req.body.username && candidate.password === req.body.password);
  if (!user) return res.status(401).send(page('Login', '<p class="message">Invalid username or password.</p><p><a href="/login">Try again</a></p>', req));
  req.session.user = { username: user.username };
  res.cookie('theme', 'dark', { maxAge: 15 * 60 * 1000, httpOnly: true });
  res.redirect('/dashboard');
});

app.get('/dashboard', authMiddleware, (req, res) => res.send(page('Dashboard', `<h1>Dashboard</h1><p>Only logged-in users can see this page.</p><p><a href="/todo">Open to-do list</a></p><p><a href="/">Home</a></p>`, req)));
app.post('/logout', (req, res) => req.session.destroy(() => { res.clearCookie('connect.sid'); res.redirect('/login'); }));

app.get('/todo', (req, res) => {
  req.session.todos = req.session.todos || [];
  const items = req.session.todos.length
    ? `<ul>${req.session.todos.map((todo, index) => `<li><span>${index + 1}. ${todo}</span><form class="inline" action="/todo/delete/${index}" method="post"><button type="submit">Delete</button></form></li>`).join('')}</ul>`
    : '<p>No to-do items yet.</p>';
  res.send(page('Session To-Do List', `<h1>Session To-Do List</h1><p>This list belongs to the current session.</p><form action="/todo" method="post"><input name="todo" placeholder="Add an item" required><button type="submit">Add</button></form>${items}<p><a href="/">Home</a></p>`, req));
});
app.post('/todo', (req, res) => { req.session.todos = req.session.todos || []; req.session.todos.push(req.body.todo.trim()); res.redirect('/todo'); });
app.post('/todo/delete/:id', (req, res) => { req.session.todos = (req.session.todos || []).filter((_, index) => index !== Number(req.params.id)); res.redirect('/todo'); });

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));