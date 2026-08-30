// ========================
// COOKIES IN EXPRESS - ENHANCED
// ========================
// A cookie is like a "note" we give to the browser
// The browser stores this note and sends it back with every request
// It's stored on the CLIENT (user's computer), not on the server

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// ============= HELPER FUNCTION =============
const getHeader = (title) => `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
    h1 { color: #333; margin-bottom: 20px; border-bottom: 3px solid #f5576c; padding-bottom: 10px; }
    h2 { color: #555; margin: 20px 0 10px 0; }
    p { color: #666; line-height: 1.6; margin: 10px 0; }
    .success { color: #27ae60; font-weight: bold; }
    .error { color: #e74c3c; font-weight: bold; }
    hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }
    a, button { 
      display: inline-block;
      margin: 5px 5px 5px 0;
      padding: 10px 20px;
      background: #f5576c;
      color: white;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
    }
    a:hover, button:hover { background: #d63447; }
    a.secondary { background: #95a5a6; }
    a.secondary:hover { background: #7f8c8d; }
    a.danger { background: #e74c3c; }
    a.danger:hover { background: #c0392b; }
    input[type="text"] { 
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    pre { 
      background: #f5f5f5; 
      padding: 15px; 
      border-radius: 5px;
      overflow-x: auto;
    }
    .cookie-box { background: #fff9e6; padding: 15px; border-left: 4px solid #f5576c; border-radius: 5px; margin: 10px 0; }
    .cookie-item { background: white; padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px; }
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
  const cookies = req.cookies;
  const cookieCount = Object.keys(cookies).length;
  
  res.send(getHeader('Cookies Demo') + `
    <h1>[COOKIES] Enhanced Demo</h1>
    
    <h2>What are Cookies?</h2>
    <p>Cookies are small text files stored in your browser</p>
    <p>Your browser sends them back with every request</p>
    <p>Perfect for: preferences, tracking, tokens, etc.</p>
    
    <hr>
    <h2>Current Browser Cookies:</h2>
    <div class="cookie-box">
      ${cookieCount > 0 ? `
        <p><span class="success">Found ${cookieCount} cookie(s)</span></p>
        ${Object.entries(cookies).map(([key, value]) => `
          <div class="cookie-item">
            <strong>${key}:</strong> ${value}
          </div>
        `).join('')}
      ` : `
        <p><span class="error">No cookies set yet</span></p>
      `}
    </div>
    
    <hr>
    <h2>Features to Try:</h2>
    <ul style="margin-left: 20px;">
      <li><a href="/set-username">Set Username Cookie</a></li>
      <li><a href="/set-preferences">Set Preferences Cookie</a></li>
      <li><a href="/set-token">Set Secure Token</a></li>
      <li><a href="/view-all">View All Cookies</a></li>
      <li><a href="/clear-all">Clear All Cookies</a></li>
    </ul>
  ` + getFooter());
});

// ========================
// ROUTE 2: SET USERNAME COOKIE
// ========================
app.get('/set-username', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 300000,   // 5 minutes
    httpOnly: true,   // Can't be accessed by JavaScript
    secure: false
  });
  
  res.send(getHeader('Set Cookie') + `
    <h1><span class="success">[SUCCESS]</span> Username Cookie Set!</h1>
    
    <div class="cookie-box">
      <p><strong>Cookie Name:</strong> username</p>
      <p><strong>Cookie Value:</strong> JohnDoe</p>
      <p><strong>Duration:</strong> 5 minutes</p>
      <p><strong>Protection:</strong> httpOnly (JavaScript can't access)</p>
    </div>
    
    <hr>
    <h2>What Happened:</h2>
    <ol style="margin-left: 20px; line-height: 1.8;">
      <li>Server sent Set-Cookie header to your browser</li>
      <li>Browser stored the cookie in its memory</li>
      <li>Next request will include this cookie</li>
      <li>Server can read it from req.cookies</li>
    </ol>
    
    <hr>
    <a href="/">Check in Home</a>
    <a href="/view-all" class="secondary">View All Cookies</a>
  ` + getFooter());
});

// ========================
// ROUTE 3: SET PREFERENCES COOKIE
// ========================
app.get('/set-preferences', (req, res) => {
  res.cookie('theme', 'dark-mode', { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  res.cookie('language', 'en', { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie('notifications', 'on', { maxAge: 7 * 24 * 60 * 60 * 1000 });
  
  res.send(getHeader('Preferences') + `
    <h1><span class="success">[SUCCESS]</span> Preference Cookies Set!</h1>
    
    <div class="cookie-box">
      <div class="cookie-item"><strong>theme:</strong> dark-mode</div>
      <div class="cookie-item"><strong>language:</strong> en</div>
      <div class="cookie-item"><strong>notifications:</strong> on</div>
      <p style="margin-top: 10px;"><strong>Duration:</strong> 7 days</p>
    </div>
    
    <hr>
    <h2>Use Case:</h2>
    <p>These cookies remember your preferences across sessions</p>
    <p>When you visit next time, your browser sends them back</p>
    <p>Website can read your preferences and apply them</p>
    
    <hr>
    <a href="/">Check in Home</a>
    <a href="/view-all" class="secondary">View All Cookies</a>
  ` + getFooter());
});

// ========================
// ROUTE 4: SET SECURE TOKEN
// ========================
app.get('/set-token', (req, res) => {
  res.cookie('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', {
    httpOnly: true,    // JavaScript can't access
    secure: false,     // Use true for HTTPS
    sameSite: 'strict' // Can't be sent to other sites
  });
  
  res.send(getHeader('Secure Token') + `
    <h1><span class="success">[SUCCESS]</span> Secure Token Set!</h1>
    
    <div class="cookie-box">
      <p><strong>Cookie:</strong> authToken</p>
      <p><strong>Value (hidden):</strong> <code style="color: #999;">eyJhbGciOi...</code></p>
      <p><strong>Protection Level:</strong> MAXIMUM</p>
      <ul style="margin-left: 20px; margin-top: 10px;">
        <li>httpOnly: Prevents JavaScript theft</li>
        <li>sameSite: Prevents CSRF attacks</li>
        <li>secure: Only over HTTPS</li>
      </ul>
    </div>
    
    <hr>
    <h2>Security:</h2>
    <p>This is how authentication tokens are safely stored</p>
    <p>JavaScript can't steal it (no XSS possible)</p>
    <p>Malicious sites can't send it (sameSite protection)</p>
    <p>Can only be sent over HTTPS (secure flag)</p>
    
    <hr>
    <a href="/">Back Home</a>
    <a href="/view-all" class="secondary">View All Cookies</a>
  ` + getFooter());
});

// ========================
// ROUTE 5: VIEW ALL COOKIES
// ========================
app.get('/view-all', (req, res) => {
  const cookies = req.cookies;
  const cookieCount = Object.keys(cookies).length;
  
  res.send(getHeader('View Cookies') + `
    <h1>[COOKIES] All Cookies in Your Browser</h1>
    
    ${cookieCount > 0 ? `
      <div class="cookie-box">
        <p><span class="success">Found ${cookieCount} cookie(s)</span></p>
        <hr>
        ${Object.entries(cookies).map(([key, value]) => `
          <div class="cookie-item">
            <strong>${key}:</strong><br>
            <code>${value}</code>
          </div>
        `).join('')}
      </div>
    ` : `
      <p><span class="error">No cookies found</span></p>
      <p>Try setting some cookies first!</p>
    `}
    
    <hr>
    <h2>How This Works:</h2>
    <ol style="margin-left: 20px; line-height: 1.8;">
      <li>Browser automatically sent all cookies with this request</li>
      <li>Server received them in the headers</li>
      <li>cookie-parser middleware parsed them</li>
      <li>They're now available in req.cookies object</li>
    </ol>
    
    <hr>
    <a href="/">Back Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 6: CLEAR ALL COOKIES
// ========================
app.get('/clear-all', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('theme');
  res.clearCookie('language');
  res.clearCookie('notifications');
  res.clearCookie('authToken');
  
  res.send(getHeader('Clear Cookies') + `
    <h1><span class="success">[SUCCESS]</span> All Cookies Cleared!</h1>
    
    <div class="cookie-box">
      <p>All cookies have been removed from your browser</p>
      <p>The browser will no longer send them with requests</p>
    </div>
    
    <hr>
    <h2>What Happened:</h2>
    <ol style="margin-left: 20px; line-height: 1.8;">
      <li>Server sent "Set-Cookie" headers with empty values</li>
      <li>Server set expiration dates in the past</li>
      <li>Browser deleted all matching cookies</li>
      <li>Empty req.cookies object on next request</li>
    </ol>
    
    <hr>
    <a href="/">Back Home</a>
    <a href="/set-username" class="secondary">Set Cookies Again</a>
  ` + getFooter());
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('[SERVER] Cookies Enhanced Demo Started!');
  console.log('='.repeat(60));
  console.log(`\n[INFO] Open in your browser:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log('[FEATURES]');
  console.log(`  [1] Set username cookie`);
  console.log(`  [2] Set preference cookies (7 days)`);
  console.log(`  [3] Set secure authentication token`);
  console.log(`  [4] View all cookies`);
  console.log(`  [5] Clear all cookies`);
  console.log('\n' + '='.repeat(60) + '\n');
});
