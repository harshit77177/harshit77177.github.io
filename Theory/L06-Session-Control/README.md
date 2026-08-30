# Lecture 6: Session Control, Cookies, and Query Strings

This folder contains practical implementations of session management, cookies, and query strings in Express.js

## Overview

Web applications use the **HTTP protocol**, which is **stateless** — it does not remember any information about previous requests made by the same user. To overcome this, we use **session control mechanisms** to track users and maintain continuity across multiple requests.

## Table of Contents

1. [Sessions in Express](#sessions-in-express)
2. [Cookies in Express](#cookies-in-express)
3. [Query Strings](#query-strings)
4. [Comparison](#comparison)
5. [Files in this Folder](#files-in-this-folder)

---

## Sessions in Express

### Definition
A **session** in Express is a way to store information about a user on the **server side** that persists across multiple requests.

### How It Works
1. The server creates a session and assigns a unique **Session ID**
2. The session data (e.g., username, preferences) is stored in server memory or database
3. The session ID is sent to the browser as a cookie
4. The browser automatically sends this ID back with every request
5. The server identifies the user and retrieves their data using the ID

### Advantages
- [ADVANTAGE] Secure, since data is not stored on the client
- [ADVANTAGE] Supports storing complex data (objects, arrays)
- [ADVANTAGE] Automatically managed by middleware (`express-session`)

### Limitations
- [LIMITATION] Sessions consume server memory
- [LIMITATION] If the server restarts, session data may be lost unless stored in a database

### Example Usage
```javascript
app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// Set session
app.get('/login', (req, res) => {
  req.session.username = 'JohnDoe';
  res.send('Session started');
});

// Access session
app.get('/profile', (req, res) => {
  if (req.session.username) {
    res.send('Welcome ' + req.session.username);
  } else {
    res.send('Please log in first');
  }
});

// Destroy session
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.send('Logged out');
  });
});
```

---

## Cookies in Express

### Definition
A **cookie** is a small piece of text stored in the user's web browser. It contains information such as user preferences, session identifiers, or tokens.

### Types of Cookies
1. **Session Cookies** - Deleted when the browser is closed
2. **Persistent Cookies** - Remain stored until a set expiration time
3. **Secure Cookies** - Transmitted only over HTTPS
4. **HttpOnly Cookies** - Not accessible via JavaScript (prevents XSS attacks)

### How Cookies Work
1. The server sends a cookie with an HTTP response
2. The browser stores the cookie
3. On subsequent requests, the browser sends the cookie back to the server
4. The server reads it to identify or remember the user

### Advantages
- [ADVANTAGE] Simple to implement
- [ADVANTAGE] Useful for storing user preferences, tokens, or "remember me" data
- [ADVANTAGE] Persist across browser sessions

### Limitations
- [LIMITATION] Limited storage size (~4 KB)
- [LIMITATION] Visible to the user; can be modified
- [LIMITATION] Security risk if not marked as `HttpOnly` or `Secure`

### Security Attributes

| Attribute | Description |
|-----------|-------------|
| `maxAge` / `expires` | Defines cookie lifetime (in milliseconds) |
| `secure` | Send only over HTTPS |
| `httpOnly` | Prevent JavaScript access (protects from XSS) |
| `sameSite` | Restrict cross-site cookie usage (`strict`, `lax`, `none`) |

### Example Usage
```javascript
// Set a cookie
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000,  // 1 hour
    httpOnly: true,   // Not accessible by JavaScript
    secure: false     // Set to true for HTTPS only
  });
  res.send('Cookie set!');
});

// Read a cookie
app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;
  res.send('Welcome ' + user);
});

// Delete a cookie
app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted');
});

// Set secure cookie
res.cookie('token', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});
```

---

## Query Strings

### Definition
A **query string** is part of a URL used to send small pieces of data between web pages.

### Example
```
http://localhost:3000/welcome?user=Alice&role=admin
```
Here:
- `user` and `role` are parameters
- `Alice` and `admin` are their respective values

### Use Cases
- Sending search filters
- Pagination (e.g., `?page=2`)
- Non-sensitive configuration data

### Advantages
- [ADVANTAGE] Easy to use
- [ADVANTAGE] Works without cookies or sessions
- [ADVANTAGE] Visible and bookmarkable
- [ADVANTAGE] Easy to share URLs with parameters

### Limitations
- [LIMITATION] Data is visible in the URL
- [LIMITATION] Not suitable for sensitive information (passwords, tokens)
- [LIMITATION] Limited in length and complexity
- [LIMITATION] URL length restrictions

### Example Usage
```javascript
app.get('/welcome', (req, res) => {
  const user = req.query.user;
  const role = req.query.role;
  res.send(`Welcome ${user}, your role is ${role}`);
});

// Usage: http://localhost:3000/welcome?user=Alice&role=admin
```

---

## Comparison

| Feature | Session | Cookie | Query String |
|---------|---------|--------|--------------|
| **Storage Location** | Server | Client (Browser) | URL |
| **Security** | High | Medium | Low |
| **Data Size Limit** | Large | ~4 KB | Very small |
| **Lifespan** | Until logout/timeout | Until expiry | Only per request |
| **Visibility** | Hidden from user | User can view | Visible in URL |
| **Best For** | Login data, cart, temporary info | Preferences, tokens | Passing small parameters |

---

## Files in this Folder

### 1. **sessions.js**
Demonstrates server-side session management using `express-session`

**Routes:**
- `/login` - Create a session
- `/profile` - Access session data
- `/session-info` - View session details
- `/logout` - Destroy session

**Run:** `node sessions.js`

### 2. **cookies.js**
Demonstrates cookie management using `cookie-parser`

**Routes:**
- `/setcookie` - Set a simple cookie
- `/getcookie` - Read cookie value
- `/all-cookies` - View all cookies
- `/set-secure-cookie` - Set secure/httpOnly cookies
- `/deletecookie` - Delete a cookie

**Run:** `node cookies.js`

### 3. **querystrings.js**
Demonstrates query string parameter handling

**Routes:**
- `/` - Main page with example links
- `/welcome?user=Alice&role=admin` - Welcome with parameters
- `/products?page=2&limit=20` - Pagination example
- `/search?q=keyword` - Search example
- `/filter?price=1000&color=blue` - Filter example
- `/query-info` - View all query parameters

**Run:** `node querystrings.js`

### 4. **package.json**
Project dependencies and scripts

---

## Installation & Setup

```bash
# Install dependencies
npm install

# Run sessions example
node sessions.js

# Run cookies example
node cookies.js

# Run query strings example
node querystrings.js

# Or use nodemon for auto-reload
npm install -g nodemon
nodemon sessions.js
```

All examples run on `http://localhost:3000`

---

## Key Takeaways

1. **Sessions** are best for storing temporary, sensitive user data on the server
2. **Cookies** are useful for persistent data that should remain across sessions
3. **Query Strings** are suitable for non-sensitive parameters that need to be visible or shareable

Together, these mechanisms form the **core of state management** in web applications. In modern Node.js Express apps, these are often used alongside secure practices such as encryption, HTTPS, and token-based authentication.

---

## Security Best Practices

- ✅ Use `httpOnly` flag to prevent XSS attacks
- ✅ Use `secure` flag for HTTPS connections
- ✅ Use `sameSite` attribute to prevent CSRF attacks
- ✅ Never store sensitive data in cookies or query strings
- ✅ Validate and sanitize all user input
- ✅ Use HTTPS in production
- ✅ Implement proper session timeout mechanisms
- ✅ Use strong session secrets

---

## Additional Resources

- [Express Documentation](https://expressjs.com/)
- [express-session GitHub](https://github.com/expressjs/session)
- [cookie-parser GitHub](https://github.com/expressjs/cookie-parser)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
