// ========================
// SESSIONS IN EXPRESS - ENHANCED
// ========================
// A session is like a "memory" on the server that remembers info about a user
// When user logs in, we save their info in the session
// Every time they make a request, the browser sends a session ID (cookie)
// The server uses this ID to recall who the user is and what data they have

const express = require('express');
const session = require('express-session');
const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Step 1: Setup session middleware
app.use(session({
  secret: 'mySecretKey123!',       // Password to encrypt session ID
  resave: false,                   // Don't save if nothing changed
  saveUninitialized: true,         // Save new sessions immediately
  cookie: { 
    maxAge: 300000,                // Session expires in 5 minutes
    secure: false                  // Use true for HTTPS
  }
}));

// ============= HELPER FUNCTION =============
// Create HTML header with styling
const getHeader = (title) => `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 50px auto; 
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    h1 { 
      color: #333;
      margin-bottom: 20px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    h2 { color: #555; margin: 20px 0 10px 0; }
    p { color: #666; line-height: 1.6; margin: 10px 0; }
    .success { color: #27ae60; font-weight: bold; }
    .error { color: #e74c3c; font-weight: bold; }
    .info { color: #3498db; font-weight: bold; }
    .warning { color: #f39c12; font-weight: bold; }
    hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }
    a, button { 
      display: inline-block;
      margin: 5px 5px 5px 0;
      padding: 10px 20px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }
    a:hover, button:hover { background: #764ba2; }
    a.secondary { background: #95a5a6; }
    a.secondary:hover { background: #7f8c8d; }
    a.danger { background: #e74c3c; }
    a.danger:hover { background: #c0392b; }
    form { margin: 20px 0; }
    input[type="text"], select { 
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
    }
    pre { 
      background: #f5f5f5; 
      padding: 15px; 
      border-radius: 5px;
      overflow-x: auto;
      margin: 10px 0;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin: 5px 0;
    }
    .active { background: #d5f4e6; color: #27ae60; }
    .expired { background: #fadbd8; color: #e74c3c; }
    .user-info { background: #eef5ff; padding: 15px; border-left: 4px solid #3498db; border-radius: 5px; }
  </style>
</head>
<body>
<div class="container">
`;

const getFooter = () => `
</div>
</body>
</html>
`;

// ========================
// ROUTE 1: HOME PAGE
// ========================
app.get('/', (req, res) => {
  const isLoggedIn = req.session.username ? true : false;
  
  res.send(getHeader('Sessions Demo') + `
    <h1>[SESSIONS] Lecture 6 - Session Management</h1>
    
    <h2>What is a Session?</h2>
    <p>A session stores user information on the SERVER side</p>
    <p>The browser sends a Session ID (cookie) with every request</p>
    <p>The server uses this ID to remember who you are</p>
    
    <hr>
    <h2>Current Status:</h2>
    ${isLoggedIn ? `
      <div class="user-info">
        <p><span class="success">STATUS: LOGGED IN</span></p>
        <p><strong>Username:</strong> ${req.session.username}</p>
        <p><strong>User ID:</strong> ${req.session.userId}</p>
        <p><strong>Role:</strong> ${req.session.role}</p>
        <p><strong>Session ID:</strong> <code>${req.sessionID.substring(0, 20)}...</code></p>
        <p><strong>Login Time:</strong> ${req.session.loginTime}</p>
      </div>
    ` : `
      <p><span class="error">STATUS: NOT LOGGED IN</span></p>
      <p>Please login to access your profile</p>
    `}
    
    <hr>
    <h2>Test These Features:</h2>
    <ul style="margin-left: 20px;">
      <li><a href="/login-form">Login Form</a> - Enter your details</li>
      <li><a href="/quick-login">Quick Login</a> - Auto-login as JohnDoe</li>
      <li><a href="/profile">View Profile</a> - Check session data</li>
      <li><a href="/session-info">Session Info</a> - Detailed info</li>
      <li><a href="/increment-counter">Counter Test</a> - Track visits</li>
      <li><a href="/logout">Logout</a> - Destroy session</li>
    </ul>
  ` + getFooter());
});

// ========================
// ROUTE 2: LOGIN FORM
// ========================
app.get('/login-form', (req, res) => {
  res.send(getHeader('Login Form') + `
    <h1>[LOGIN] User Registration</h1>
    
    <p>Fill in your details to create a session:</p>
    
    <form method="POST" action="/login">
      <label><strong>Username:</strong></label>
      <input type="text" name="username" placeholder="Enter your name" required>
      
      <label><strong>User ID:</strong></label>
      <input type="text" name="userId" placeholder="e.g., 12345" required>
      
      <label><strong>Role:</strong></label>
      <select name="role" required>
        <option value="">Select a role</option>
        <option value="admin">Admin</option>
        <option value="user">Regular User</option>
        <option value="moderator">Moderator</option>
      </select>
      
      <button type="submit" style="width: 100%; margin-top: 15px;">Login</button>
    </form>
    
    <hr>
    <p><a href="/" class="secondary">Back to Home</a></p>
  ` + getFooter());
});

// ========================
// ROUTE 3: LOGIN (POST)
// ========================
app.post('/login', (req, res) => {
  const { username, userId, role } = req.body;
  
  if (!username || !userId || !role) {
    return res.send(getHeader('Error') + `
      <h1 class="error">[ERROR] Missing Fields</h1>
      <p>Please fill in all fields</p>
      <a href="/login-form">Try Again</a>
    ` + getFooter());
  }
  
  // Save to session
  req.session.username = username;
  req.session.userId = userId;
  req.session.role = role;
  req.session.loginTime = new Date().toLocaleString();
  req.session.visitCount = 1;
  
  res.send(getHeader('Login Success') + `
    <h1><span class="success">[SUCCESS]</span> Logged In Successfully!</h1>
    
    <div class="user-info">
      <p><strong>Welcome, ${username}!</strong></p>
      <p>Your session has been created</p>
      <p><strong>Session ID:</strong> <code>${req.sessionID.substring(0, 30)}...</code></p>
      <p><strong>Login Time:</strong> ${req.session.loginTime}</p>
    </div>
    
    <hr>
    <h2>What Happened?</h2>
    <ol style="margin-left: 20px; line-height: 1.8;">
      <li>Server received your login data</li>
      <li>Server created a session with your info</li>
      <li>Server sent Session ID to your browser as a cookie</li>
      <li>Browser will send this ID with every future request</li>
    </ol>
    
    <hr>
    <h2>Next Steps:</h2>
    <a href="/profile">View Your Profile</a>
    <a href="/session-info">View Session Data</a>
    <a href="/">Back to Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 4: QUICK LOGIN
// ========================
app.get('/quick-login', (req, res) => {
  req.session.username = 'JohnDoe';
  req.session.userId = '12345';
  req.session.role = 'admin';
  req.session.loginTime = new Date().toLocaleString();
  req.session.visitCount = 1;
  
  res.send(getHeader('Quick Login') + `
    <h1><span class="success">[SUCCESS]</span> Quick Login Complete!</h1>
    
    <div class="user-info">
      <p><strong>Logged in as: JohnDoe</strong></p>
      <p><strong>User ID:</strong> 12345</p>
      <p><strong>Role:</strong> Admin</p>
      <p><strong>Session ID:</strong> <code>${req.sessionID.substring(0, 30)}...</code></p>
      <span class="status-badge active">ACTIVE SESSION</span>
    </div>
    
    <hr>
    <a href="/profile">Go to Profile</a>
    <a href="/session-info">View Session Info</a>
    <a href="/">Back to Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 5: PROFILE PAGE
// ========================
app.get('/profile', (req, res) => {
  if (!req.session.username) {
    return res.send(getHeader('Profile') + `
      <h1 class="error">[ERROR] Not Logged In</h1>
      <p>You must login first to view your profile</p>
      <a href="/login-form">Go to Login</a>
      <a href="/quick-login" class="secondary">Quick Login</a>
      <a href="/" class="secondary">Home</a>
    ` + getFooter());
  }
  
  // Increment visit counter
  req.session.visitCount = (req.session.visitCount || 0) + 1;
  
  res.send(getHeader('Your Profile') + `
    <h1><span class="success">[PROFILE]</span> Welcome ${req.session.username}!</h1>
    
    <div class="user-info">
      <h2>Your Information:</h2>
      <p><strong>Username:</strong> ${req.session.username}</p>
      <p><strong>User ID:</strong> ${req.session.userId}</p>
      <p><strong>Role:</strong> ${req.session.role}</p>
      <p><strong>Login Time:</strong> ${req.session.loginTime}</p>
      <p><strong>Visits to Profile:</strong> <span class="info">${req.session.visitCount}</span></p>
    </div>
    
    <hr>
    <h2>What This Proves:</h2>
    <p>You can see your data because the session is stored on the SERVER</p>
    <p>Your browser sent the Session ID cookie with this request</p>
    <p>Server looked up the session data using that ID</p>
    <p>Each refresh increments your visit counter (see the number above!)</p>
    
    <hr>
    <a href="/session-info">View Raw Session Data</a>
    <a href="/increment-counter">Test Counter</a>
    <a href="/logout" class="danger">Logout</a>
    <a href="/" class="secondary">Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 6: INCREMENT COUNTER
// ========================
app.get('/increment-counter', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/login-form');
  }
  
  req.session.counter = (req.session.counter || 0) + 1;
  
  res.send(getHeader('Counter') + `
    <h1>[COUNTER TEST]</h1>
    
    <div class="user-info">
      <h2>Session Counter: <span class="info" style="font-size: 24px;">${req.session.counter}</span></h2>
      <p>Click the button below multiple times</p>
      <p>The counter persists because it's stored in your SESSION</p>
      <p>Without sessions, the counter would reset every page!</p>
    </div>
    
    <hr>
    <a href="/increment-counter" style="padding: 15px 30px; font-size: 16px;">Increment Counter</a>
    <a href="/profile" class="secondary">Back to Profile</a>
  ` + getFooter());
});

// ========================
// ROUTE 7: SESSION INFO
// ========================
app.get('/session-info', (req, res) => {
  res.send(getHeader('Session Info') + `
    <h1>[SESSION INFO] Detailed Information</h1>
    
    <h2>Session ID:</h2>
    <p><code>${req.sessionID}</code></p>
    
    <h2>All Session Data:</h2>
    <pre>${JSON.stringify(req.session, null, 2)}</pre>
    
    <h2>Headers Sent:</h2>
    <p><strong>Cookie Header:</strong></p>
    <pre>${req.headers.cookie || 'No cookies found'}</pre>
    
    <hr>
    <a href="/">Back to Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 8: LOGOUT
// ========================
app.get('/logout', (req, res) => {
  const username = req.session.username || 'Guest';
  
  req.session.destroy((err) => {
    if (err) {
      return res.send(getHeader('Error') + `
        <h1 class="error">[ERROR] Logout Failed</h1>
        <p>Failed to destroy session: ${err.message}</p>
        <a href="/">Back to Home</a>
      ` + getFooter());
    }
    
    res.send(getHeader('Logout Success') + `
      <h1><span class="success">[SUCCESS]</span> Logged Out!</h1>
      
      <div class="user-info">
        <p>Goodbye, ${username}!</p>
        <p>Your session has been destroyed</p>
        <p>Session cookie has been cleared from your browser</p>
      </div>
      
      <hr>
      <h2>What Happened:</h2>
      <ol style="margin-left: 20px; line-height: 1.8;">
        <li>Server destroyed your session data</li>
        <li>Session ID cookie was invalidated</li>
        <li>You are now completely logged out</li>
        <li>Browser no longer has access to your data</li>
      </ol>
      
      <hr>
      <a href="/quick-login">Login Again</a>
      <a href="/" class="secondary">Back to Home</a>
    ` + getFooter());
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('[SERVER] Sessions Enhanced Demo Started!');
  console.log('='.repeat(60));
  console.log(`\n[INFO] Open in your browser:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log('[FEATURES]');
  console.log(`  [1] Login with custom form`);
  console.log(`  [2] Quick auto-login`);
  console.log(`  [3] View your profile`);
  console.log(`  [4] Session counter test`);
  console.log(`  [5] View raw session data`);
  console.log(`  [6] Logout functionality`);
  console.log('\n' + '='.repeat(60) + '\n');
});
