const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/userdb';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true, trim: true },
	email: { type: String, required: true, unique: true, trim: true },
	password: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#039;');

const resultPage = (title, body, className = '') => `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1">
			<title>${escapeHtml(title)}</title>
			<style>
				body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
				.success { color: #16803c; }
				.error { color: #c62828; }
				a { color: #0069d9; }
			</style>
		</head>
		<body>
			<h2 class="${className}">${escapeHtml(title)}</h2>
			${body}
			<a href="/">Go back to home</a>
		</body>
	</html>`;

app.get('/', (req, res) => {
	res.send(`
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>User Management System</title>
				<style>
					body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
					.container { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
					input { width: 100%; padding: 10px; margin: 5px 0; box-sizing: border-box; }
					button { background: #007bff; color: white; padding: 10px 20px; border: 0; cursor: pointer; margin: 5px; }
					button:hover { background: #0056b3; }
				</style>
			</head>
			<body>
				<h1>User Management System</h1>
				<div class="container">
					<h2>Register New User</h2>
					<form action="/signup" method="POST">
						<input type="text" name="username" placeholder="Username" required>
						<input type="email" name="email" placeholder="Email" required>
						<input type="password" name="password" placeholder="Password" minlength="8" pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d]).{8,}" title="Use at least 8 characters with uppercase, lowercase, number, and special character" required>
						<button type="submit">Sign Up</button>
					</form>
				</div>
				<div class="container">
					<h2>Login</h2>
					<form action="/login" method="POST">
						<input type="text" name="username" placeholder="Username" required>
						<input type="password" name="password" placeholder="Password" required>
						<button type="submit">Login</button>
					</form>
				</div>
				<div class="container">
					<h2>View All Users</h2>
					<form action="/users" method="GET"><button type="submit">Show All Registered Users</button></form>
				</div>
			</body>
		</html>`);
});

app.post('/signup', async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!strongPasswordPattern.test(password)) {
			return res.status(400).send(resultPage(
				'Registration error',
				'<p>Password must be at least 8 characters and include uppercase, lowercase, number, and special character.</p>',
				'error'
			));
		}
		const hashedPassword = await bcrypt.hash(password, 12);
		const newUser = new User({ username, email, password: hashedPassword });
		const user = await newUser.save();
		res.send(resultPage(
			'Registration successful',
			`
				<p>User registered successfully!</p>
				<p>Username: ${escapeHtml(user.username)}</p>
				<p>Email: ${escapeHtml(user.email)}</p>
			`,
			'success'
		));
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).send(resultPage('Registration error', '<p>Username or email already exists.</p>', 'error'));
		}
		res.status(400).send(resultPage('Registration error', `<p>${escapeHtml(error.message)}</p>`, 'error'));
	}
});

app.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });

		if (!user) {
			return res.status(401).send(resultPage('Login error', '<p>User not found.</p>', 'error'));
		}
		if (!(await bcrypt.compare(password, user.password))) {
			return res.status(401).send(resultPage('Login error', '<p>Incorrect password.</p>', 'error'));
		}

		res.send(resultPage(
			'Login successful',
			`
				<p>Welcome back, ${escapeHtml(user.username)}!</p>
				<p>Email: ${escapeHtml(user.email)}</p>
				<p>Account created: ${user.createdAt.toDateString()}</p>
			`,
			'success'
		));
	} catch (error) {
		res.status(500).send(resultPage('Login error', `<p>${escapeHtml(error.message)}</p>`, 'error'));
	}
});

app.get('/users', async (req, res) => {
	try {
		const users = await User.find().sort({ createdAt: -1 });
		if (users.length === 0) {
			return res.send(resultPage('Registered users', '<p>No users registered yet.</p>'));
		}

		const userList = users.map((user) => `
			<li><strong>Username:</strong> ${escapeHtml(user.username)} |
				<strong>Email:</strong> ${escapeHtml(user.email)} |
				<strong>Joined:</strong> ${user.createdAt.toDateString()}</li>`).join('');
		res.send(resultPage('Registered users', `<ul>${userList}</ul>`));
	} catch (error) {
		res.status(500).send(resultPage('Users error', `<p>${escapeHtml(error.message)}</p>`, 'error'));
	}
});

mongoose.connect(DB_URL)
	.then(() => console.log('Connected to MongoDB successfully'))
	.catch((error) => console.error('MongoDB connection error:', error.message));

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
