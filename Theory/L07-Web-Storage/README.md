# LECTURE 7: Web Storage API - Complete Guide

Welcome to Lecture 7! In this lecture, you'll learn how to persist data in the browser using the Web Storage API. Unlike cookies or sessions (Lecture 6), Web Storage is perfect for storing data locally on the user's machine.

---

## Table of Contents

1. [What is Web Storage?](#what-is-web-storage)
2. [localStorage vs sessionStorage](#localstorage-vs-sessionstorage)
3. [JSON Basics](#json-basics)
4. [Hands-On Examples](#hands-on-examples)
5. [Common Mistakes](#common-mistakes)
6. [Console Cheat Sheet](#console-cheat-sheet)
7. [Notes App Project](#notes-app-project)

---

## What is Web Storage?

**Web Storage** is a browser feature that allows you to store data locally on a user's computer.

### Key Characteristics:
- Data is stored as **strings** (key-value pairs)
- No server involvement - all data stays on the client side
- Much larger storage capacity than cookies (5-10 MB vs 4 KB)
- Not sent to the server with every request
- Survives browser restarts (for localStorage)

### Why Use Web Storage?

| Use Case | Example |
|----------|---------|
| User preferences | Theme (dark/light), font size, language |
| Cache | Recently viewed products, search history |
| Temporary data | Multi-step form data, shopping cart |
| Session tokens | JWT tokens for authentication |
| Offline functionality | Draft posts, unsaved changes |

---

## localStorage vs sessionStorage

Both use the **same API**, but have different lifespans:

### localStorage

```javascript
// SAVE data (persists forever)
localStorage.setItem('theme', 'dark');

// READ data
const theme = localStorage.getItem('theme'); // 'dark'

// Data survives browser restart!
```

[ADVANTAGE] Persists until explicitly deleted
[ADVANTAGE] Shared across all tabs of same website
[ADVANTAGE] Great for long-term storage (preferences, cache)

[LIMITATION] Data persists even if user forgets they saved it
[LIMITATION] Limited to current origin (domain)

### sessionStorage

```javascript
// SAVE data (clears when tab closes)
sessionStorage.setItem('cartItems', '3');

// READ data
const items = sessionStorage.getItem('cartItems'); // '3'

// Data is deleted when you close the tab!
```

[ADVANTAGE] Automatically cleared (tab-specific)
[ADVANTAGE] Private to each tab - no cross-tab pollution
[ADVANTAGE] Perfect for temporary data

[LIMITATION] Data lost when tab closes
[LIMITATION] Not accessible from other tabs

---

## API Methods

Both `localStorage` and `sessionStorage` have the same methods:

### Basic Operations

```javascript
// SAVE a value
localStorage.setItem(key, value);

// READ a value
const value = localStorage.getItem(key);

// REMOVE a specific item
localStorage.removeItem(key);

// REMOVE everything
localStorage.clear();

// Get total number of items
localStorage.length;

// Get key at index
localStorage.key(0);
```

### Example

```javascript
// Set item
localStorage.setItem('username', 'Alice');

// Get item
console.log(localStorage.getItem('username')); // 'Alice'

// Check if key exists
if (localStorage.getItem('username') !== null) {
    console.log('User found!');
}

// List all items
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key} = ${value}`);
}
```

---

## JSON Basics

### The Problem: Objects Don't Store Well

```javascript
const user = { name: 'Alice', age: 25 };

// Wrong way - object becomes string "[object Object]"
localStorage.setItem('user', user); // DATA LOST!
console.log(localStorage.getItem('user')); // "[object Object]"

// Right way - use JSON.stringify()
localStorage.setItem('user', JSON.stringify(user));
console.log(localStorage.getItem('user')); // '{"name":"Alice","age":25}'
```

### JSON.stringify() - Object to String

Converts a JavaScript object into a JSON string:

```javascript
const book = {
    title: 'Learning JS',
    pages: 450,
    author: 'John Doe'
};

// Convert to JSON string
const jsonString = JSON.stringify(book);
console.log(jsonString);
// '{"title":"Learning JS","pages":450,"author":"John Doe"}'

// Save to storage
localStorage.setItem('book', jsonString);

// Pretty print (3rd parameter = indentation)
const pretty = JSON.stringify(book, null, 2);
console.log(pretty);
/*
{
  "title": "Learning JS",
  "pages": 450,
  "author": "John Doe"
}
*/
```

### JSON.parse() - String to Object

Converts a JSON string back into a JavaScript object:

```javascript
const jsonString = '{"name":"Bob","age":30,"city":"LA"}';

// Convert string back to object
const person = JSON.parse(jsonString);
console.log(person.name); // 'Bob'
console.log(person.age);  // 30

// Now you can use it as a normal object
person.age = 31;
console.log(person.age);  // 31
```

### Complete Round Trip

```javascript
// Original object
const settings = {
    theme: 'dark',
    fontSize: 16,
    autoSave: true
};

// Step 1: Convert to JSON and save
const json = JSON.stringify(settings);
localStorage.setItem('settings', json);

// Step 2: Read from storage
const retrievedJson = localStorage.getItem('settings');

// Step 3: Convert back to object
const restoredSettings = JSON.parse(retrievedJson);
console.log(restoredSettings.theme); // 'dark'
```

---

## Hands-On Examples

### Example 1: Simple Form Saving

**Save form data to localStorage:**

```javascript
function saveForm() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;

    // Save to storage
    localStorage.setItem('formName', name);
    localStorage.setItem('formEmail', email);

    alert('Form saved!');
}

function loadForm() {
    const name = localStorage.getItem('formName');
    const email = localStorage.getItem('formEmail');

    if (name) document.getElementById('nameInput').value = name;
    if (email) document.getElementById('emailInput').value = email;
}

// Load on page load
window.addEventListener('DOMContentLoaded', loadForm);
```

### Example 2: Theme Switcher

**Save and restore user's theme preference:**

```javascript
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    // Save preference
    localStorage.setItem('theme', newTheme);

    // Apply theme
    document.body.className = newTheme;
    console.log('Theme set to:', newTheme);
}

// Load theme on page load
window.addEventListener('DOMContentLoaded', function() {
    const theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme;
});
```

### Example 3: Shopping Cart

**Store cart items with sessionStorage:**

```javascript
function addToCart(productName, price) {
    // Get existing cart
    const cartJson = sessionStorage.getItem('cart');
    let cart = cartJson ? JSON.parse(cartJson) : [];

    // Add new item
    cart.push({
        name: productName,
        price: price,
        addedAt: new Date().toLocaleString()
    });

    // Save back
    sessionStorage.setItem('cart', JSON.stringify(cart));
}

function viewCart() {
    const cartJson = sessionStorage.getItem('cart');
    const cart = cartJson ? JSON.parse(cartJson) : [];

    console.log('Cart items:', cart);
    return cart;
}

function clearCart() {
    sessionStorage.removeItem('cart');
}

// Usage
addToCart('Laptop', 1000);
addToCart('Mouse', 50);
console.log(viewCart());
```

### Example 4: Visit Counter

**Count how many times user visited:**

```javascript
function updateVisitCount() {
    // Get current count
    let count = localStorage.getItem('visitCount');
    count = count ? parseInt(count) : 0;

    // Increment
    count++;

    // Save back
    localStorage.setItem('visitCount', count);

    console.log('You have visited', count, 'times');
}

// Call on page load
window.addEventListener('DOMContentLoaded', updateVisitCount);
```

---

## Comparison Table

| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|----------------|---------|
| **Storage Capacity** | 5-10 MB | 5-10 MB | 4 KB |
| **Data Format** | String only | String only | String only |
| **Expiration** | Never (until deleted) | Tab close | Configurable |
| **Scope** | Domain-wide | Tab-specific | Domain-wide |
| **Sent to Server** | No | No | Yes |
| **Accessible by** | JavaScript only | JavaScript only | JavaScript & Server |
| **Best For** | Long-term data | Temporary data | Authentication |

---

## Common Mistakes

### [ERROR] Mistake 1: Forgetting to stringify objects

```javascript
// WRONG - object becomes "[object Object]"
const user = { name: 'Alice' };
localStorage.setItem('user', user); // BAD!

// RIGHT - stringify first
localStorage.setItem('user', JSON.stringify(user)); // GOOD!
```

### [ERROR] Mistake 2: Forgetting to parse when retrieving

```javascript
// WRONG - getting a string, not an object
const userJson = localStorage.getItem('user');
console.log(userJson.name); // undefined! (it's a string)

// RIGHT - parse first
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.name); // 'Alice' (correct!)
```

### [ERROR] Mistake 3: Not checking for null

```javascript
// WRONG - crashes if key doesn't exist
const data = JSON.parse(localStorage.getItem('key')); // Error if null!

// RIGHT - check first
const data = localStorage.getItem('key');
if (data) {
    const parsed = JSON.parse(data);
}

// OR with default value
const parsed = localStorage.getItem('key') 
    ? JSON.parse(localStorage.getItem('key'))
    : {};
```

### [ERROR] Mistake 4: Type confusion

```javascript
// Remember: storage stores STRINGS only
localStorage.setItem('count', 5);
const count = localStorage.getItem('count'); // "5" (string!)

// Need to convert
const countNum = parseInt(count); // 5 (number)

// Better: stringify everything
localStorage.setItem('data', JSON.stringify({ count: 5 }));
const { count } = JSON.parse(localStorage.getItem('data'));
```

### [ERROR] Mistake 5: Not handling missing storage

```javascript
// Check if storage is available
if (typeof(Storage) !== 'undefined') {
    localStorage.setItem('key', 'value'); // Safe
} else {
    console.log('localStorage not supported');
}
```

---

## Console Cheat Sheet

Open the browser DevTools Console (F12) and try these:

```javascript
// ===== Basic Operations =====
localStorage.setItem('key', 'value');
localStorage.getItem('key');
localStorage.removeItem('key');
localStorage.clear();

// ===== Check Storage =====
localStorage.length                    // How many items
localStorage.key(0)                     // First key
console.table(localStorage)             // Table view of all items

// ===== JSON Operations =====
JSON.stringify({a: 1, b: 2})           // Object to string
JSON.parse('{"a":1,"b":2}')            // String to object

// ===== Size Check =====
new Blob(Object.values(localStorage)).size + ' bytes'

// ===== Export All Data =====
copy(localStorage)
JSON.stringify(localStorage)

// ===== sessionStorage =====
sessionStorage.setItem('temp', 'value')
sessionStorage.getItem('temp')
sessionStorage.length
```

---

## Notes App Project

The main project for this lecture is `notes-app.html` - a complete todo/notes application using Web Storage.

### Features

[OK] Create new notes with text
[OK] View all saved notes
[OK] Mark notes as complete/incomplete
[OK] Edit existing notes
[OK] Delete individual notes
[OK] Delete all notes at once
[OK] Data persists after page refresh
[OK] Statistics (total, completed, pending)
[OK] Filter notes (All, Pending, Completed)
[OK] Professional UI with CSS styling

### Data Structure

Each note is stored as:

```javascript
{
    id: 1705330000000,           // Timestamp-based unique ID
    text: 'Learn localStorage',   // Note text (max 200 chars)
    completed: false,             // Completion status
    createdAt: '1/15/2024, 10:00', // Creation time
    updatedAt: null                 // Set when the note is edited or completed
}
```

All notes are stored as a JSON array in localStorage under the key `myNotes`:

```javascript
localStorage.getItem('myNotes')
// Returns: '[{"id":1705330000000,"text":"Learn localStorage",...}, ...]'
```

### How to Use the App

1. **Open** `notes-app.html` in your browser
2. **Add Note**: Type text and click "Add Note" (or press Enter)
3. **Complete Note**: Click "Complete" to mark as done
4. **Edit Note**: Click "Edit" to modify the text
5. **Delete Note**: Click "Delete" to remove single note
6. **Filter**: Use buttons to filter All, Pending, or Completed
7. **Statistics**: See totals at the top
8. **Clear All**: Delete all notes at once

### Key Functions

```javascript
// Get all notes
getNotes()

// Save notes to storage
saveNotes(notes)

// Add a new note
addNote()

// Mark complete/incomplete
toggleComplete(id)

// Edit note text
editNote(id)

// Delete a note
deleteNote(id)

// Delete all notes
clearAllNotes()

// Render notes to page
renderNotes()

// Filter notes (all, pending, completed)
filterNotes(status, button)
```

### Customization Ideas

Try these enhancements:

1. **Add Categories**: Add a category field to each note
2. **Search**: Filter notes by searching text
3. **Colors**: Different colors for different categories
4. **Dark Mode**: Add a toggle for dark theme
5. **Export**: Export all notes as JSON file
6. **Import**: Import notes from JSON file
7. **Sync**: Sync notes across browser tabs using storage events
8. **Timestamps**: Show note creation and update times
9. **Priority**: Add high/medium/low priority levels
10. **Due Dates**: Add due date functionality

---

## Browser DevTools Tips

### View localStorage

1. Open DevTools (F12)
2. Go to "Application" tab
3. Click "Local Storage" on the left
4. Select your domain
5. See all key-value pairs in a table

### View sessionStorage

Same as above, but click "Session Storage" instead.

### Clear Storage

```javascript
// From console
localStorage.clear()
sessionStorage.clear()

// Or from DevTools Application tab, right-click and Clear
```

### Monitor Storage Changes

```javascript
window.addEventListener('storage', function(e) {
    console.log('Storage changed!');
    console.log('Key:', e.key);
    console.log('Old value:', e.oldValue);
    console.log('New value:', e.newValue);
});
```

---

## Quick Reference

### When to Use What?

| Scenario | Use This |
|----------|----------|
| Save user preferences (permanent) | localStorage |
| Shopping cart during session | sessionStorage |
| Authentication token (1 session) | sessionStorage or cookies |
| Cache API data | localStorage |
| Form draft before submit | sessionStorage |
| Remember login (days/weeks) | localStorage |
| Temporary calculation data | sessionStorage |

### Storage Limits

- Chrome/Firefox/Edge: ~10 MB per domain
- Safari: ~5 MB per domain
- Opera: ~10 MB per domain
- IE: ~10 MB per domain

### Security Notes

[WARNING] localStorage is accessible to any JavaScript on the page
[WARNING] Don't store passwords or sensitive data
[WARNING] Don't store authentication tokens directly (use httpOnly cookies instead)
[WARNING] Clear sensitive data when user logs out

---

## Learn By Doing

1. **Run localStorage.js** - See all methods in action
2. **Run sessionStorage.js** - Compare with localStorage
3. **Run json-basics.js** - Understand stringify/parse
4. **Build notes-app.html** - Create complete working app
5. **Try console commands** - Practice in DevTools
6. **Customize the app** - Add your own features!

---

## Next Steps

After mastering Web Storage:

1. Learn about IndexedDB (for larger data)
2. Learn about Service Workers (for offline apps)
3. Learn about Sync API (background sync)
4. Combine with APIs for advanced apps

---

## Summary

[OK] localStorage - Data persists forever
[OK] sessionStorage - Data clears on tab close
[OK] JSON.stringify() - Convert objects to strings
[OK] JSON.parse() - Convert strings back to objects
[OK] Perfect for: preferences, cache, temporary data
[OK] Limit: 5-10 MB per domain
[OK] Security: Don't store sensitive data

---

**Happy coding! Master Web Storage and build amazing browser-based applications!**
