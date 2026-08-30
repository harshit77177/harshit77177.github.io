// ========================================
// LECTURE 7: localStorage BASICS
// ========================================
// localStorage is like a NOTE on your browser
// It saves data forever (until you delete it)
// Perfect for: user preferences, saved settings, cached data
//
// Key Point: localStorage ONLY stores STRINGS
// If you want to store objects, use JSON.stringify()

console.log('\n========== localStorage DEMO ==========\n');

// ========================================
// PART 1: BASIC METHODS
// ========================================
console.log('[1] BASIC METHODS');
console.log('-----------------------------------');

// Method 1: setItem(key, value) - SAVE data
console.log('setItem() - Save data to localStorage');
localStorage.setItem('favColor', 'blue');
localStorage.setItem('username', 'JohnDoe');
localStorage.setItem('visitCount', '5');
console.log('Saved 3 items to localStorage\n');

// Method 2: getItem(key) - READ data
console.log('getItem() - Read data from localStorage');
console.log('favColor:', localStorage.getItem('favColor'));
console.log('username:', localStorage.getItem('username'));
console.log('visitCount:', localStorage.getItem('visitCount'));
console.log('nonexistent:', localStorage.getItem('nonexistent')); // Returns null
console.log();

// ========================================
// PART 2: CHECKING VALUES
// ========================================
console.log('[2] CHECKING VALUES');
console.log('-----------------------------------');

// Check how many items we have
console.log('Total items in localStorage:', localStorage.length);

// Check if a key exists
console.log('Does "username" exist?', localStorage.getItem('username') !== null);
console.log('Does "email" exist?', localStorage.getItem('email') !== null);
console.log();

// ========================================
// PART 3: GET ALL KEYS
// ========================================
console.log('[3] GET ALL KEYS');
console.log('-----------------------------------');

// Loop through all items
console.log('All items in localStorage:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`  [${i}] ${key} = ${value}`);
}
console.log();

// ========================================
// PART 4: REMOVING DATA
// ========================================
console.log('[4] REMOVING DATA');
console.log('-----------------------------------');

// Remove one item
console.log('Before removeItem():');
console.log('  favColor =', localStorage.getItem('favColor'));
localStorage.removeItem('favColor');
console.log('After removeItem("favColor"):');
console.log('  favColor =', localStorage.getItem('favColor')); // null
console.log();

// Clear EVERYTHING
console.log('Clearing all localStorage...');
console.log('  Items before clear():', localStorage.length);
localStorage.clear();
console.log('  Items after clear():', localStorage.length);
console.log();

// ========================================
// PART 5: COMMON PATTERNS
// ========================================
console.log('[5] COMMON PATTERNS - SAFE DATA RETRIEVAL');
console.log('-----------------------------------');

// Safe pattern: Check if exists, use default if not
function getSetting(key, defaultValue) {
  const value = localStorage.getItem(key);
  return value !== null ? value : defaultValue;
}

console.log('Theme:', getSetting('theme', 'light')); // light (default)
localStorage.setItem('theme', 'dark');
console.log('Theme:', getSetting('theme', 'light')); // dark (from storage)
console.log();

// ========================================
// PART 6: DEMONSTRATION - USER PREFERENCES
// ========================================
console.log('[6] REAL-WORLD EXAMPLE: USER PREFERENCES');
console.log('-----------------------------------');

// Simulate saving user settings
const userSettings = {
  theme: 'dark',
  fontSize: '16px',
  language: 'English',
  autoSave: 'true',
  lastLogin: '2024-01-15'
};

console.log('Saving user settings...');
for (let key in userSettings) {
  localStorage.setItem(key, userSettings[key]);
  console.log(`  Saved: ${key} = ${userSettings[key]}`);
}
console.log();

// Retrieve and display
console.log('Reading user settings back:');
console.log('  Theme:', localStorage.getItem('theme'));
console.log('  Font Size:', localStorage.getItem('fontSize'));
console.log('  Language:', localStorage.getItem('language'));
console.log();

// ========================================
// PART 7: IMPORTANT NOTES
// ========================================
console.log('[7] IMPORTANT NOTES');
console.log('-----------------------------------');
console.log('1. Data is stored as STRINGS only');
console.log('2. Everything is stored in browser memory');
console.log('3. Each origin gets ~5-10 MB space');
console.log('4. Data persists until explicitly deleted or browser cache cleared');
console.log('5. Shared across all tabs of the same website');
console.log('6. NOT sent to server (unlike cookies)');
console.log('7. Accessible to any JavaScript on the page');
console.log();

console.log('========== END OF DEMO ==========\n');

// ========================================
// CONSOLE COMMANDS TO TRY
// ========================================
console.log('TRY THESE IN CONSOLE:');
console.log('>>> localStorage.setItem("name", "Alice")');
console.log('>>> localStorage.getItem("name")');
console.log('>>> localStorage.key(0)');
console.log('>>> localStorage.length');
console.log('>>> localStorage.removeItem("name")');
console.log('>>> localStorage.clear()');
console.log('>>> console.table(localStorage)');
console.log();
