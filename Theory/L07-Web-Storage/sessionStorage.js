
console.log('[1] BASIC METHODS (Same as localStorage)');
console.log('-----------------------------------');

// setItem - SAVE data
sessionStorage.setItem('sessionUser', 'AliceDoe');
sessionStorage.setItem('sessionID', 'sess_123456789');
sessionStorage.setItem('loginTime', new Date().toLocaleString());
console.log('Saved session data\n');

// getItem - READ data
console.log('Reading session data:');
console.log('User:', sessionStorage.getItem('sessionUser'));
console.log('Session ID:', sessionStorage.getItem('sessionID'));
console.log('Login Time:', sessionStorage.getItem('loginTime'));
console.log();

// ========================================
// PART 2: LENGTH & KEYS
// ========================================
console.log('[2] CHECKING STORAGE');
console.log('-----------------------------------');

console.log('Total items:', sessionStorage.length);
console.log('All keys:');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  console.log(`  [${i}] ${key}`);
}
console.log();

// ========================================
// PART 3: REMOVING DATA
// ========================================
console.log('[3] REMOVING DATA');
console.log('-----------------------------------');

console.log('Before removeItem():');
console.log('  loginTime =', sessionStorage.getItem('loginTime'));
sessionStorage.removeItem('loginTime');
console.log('After removeItem():');
console.log('  loginTime =', sessionStorage.getItem('loginTime'));
console.log();

// Clear everything
console.log('Clearing sessionStorage...');
sessionStorage.clear();
console.log('Items remaining:', sessionStorage.length);
console.log();

// ========================================
// PART 4: WHEN TO USE EACH
// ========================================
console.log('[4] COMPARISON: localStorage vs sessionStorage');
console.log('-----------------------------------');
console.log('localStorage:');
console.log('  - Data persists forever');
console.log('  - Shared across ALL tabs');
console.log('  - Use for: preferences, cache, long-term data');
console.log();
console.log('sessionStorage:');
console.log('  - Data deleted when tab closes');
console.log('  - Isolated per tab');
console.log('  - Use for: temporary data, form data, session tokens');
console.log();

// ========================================
// PART 5: REAL-WORLD EXAMPLE
// ========================================
console.log('[5] REAL-WORLD EXAMPLE: MULTI-STEP FORM');
console.log('-----------------------------------');

// Imagine a 3-step registration form
// Step 1: User enters name
function stepOne(name) {
  sessionStorage.setItem('formName', name);
  console.log('Step 1: Saved name -', name);
}

// Step 2: User enters email
function stepTwo(email) {
  sessionStorage.setItem('formEmail', email);
  console.log('Step 2: Saved email -', email);
}

// Step 3: User enters password
function stepThree(password) {
  sessionStorage.setItem('formPassword', password);
  console.log('Step 3: Saved password -', '(hidden)');
}

// Step 4: Submit form
function submitForm() {
  console.log('\nSubmitting form...');
  console.log('Name:', sessionStorage.getItem('formName'));
  console.log('Email:', sessionStorage.getItem('formEmail'));
  console.log('Password: (hidden)');
  
  // After submit, clear session data
  sessionStorage.clear();
  console.log('Form data cleared from sessionStorage');
}

// Run the example
stepOne('Alice');
stepTwo('alice@example.com');
stepThree('password123');
submitForm();
console.log();

// ========================================
// PART 6: KEY BEHAVIOR DIFFERENCE
// ========================================
console.log('[6] KEY DIFFERENCE: Tab Isolation');
console.log('-----------------------------------');
console.log('IMPORTANT:');
console.log('- Open this page in 2 different tabs');
console.log('- sessionStorage data is NOT shared between tabs');
console.log('- Each tab has its own isolated sessionStorage');
console.log();
console.log('localStorage, however, IS shared:');
console.log('- localStorage is shared across ALL tabs');
console.log('- Changes in one tab appear in all tabs immediately');
console.log();

// ========================================
// PART 7: PRACTICAL DEMO
// ========================================
console.log('[7] PRACTICAL DEMO: SHOPPING CART');
console.log('-----------------------------------');

// Simulate adding items to cart
function addToCart(productName, price) {
  const items = sessionStorage.getItem('cartItems') || '0';
  const count = parseInt(items) + 1;
  sessionStorage.setItem('cartItems', count.toString());
  sessionStorage.setItem('lastItem', productName);
  console.log(`Added ${productName} ($${price})`);
}

// Add items
addToCart('Laptop', 1000);
addToCart('Mouse', 50);
addToCart('Keyboard', 100);

// Show cart summary
console.log('\nCart Summary:');
console.log('Items in cart:', sessionStorage.getItem('cartItems'));
console.log('Last item added:', sessionStorage.getItem('lastItem'));
console.log();
console.log('Note: When you close this tab, cart data will be gone!');
console.log('(Use localStorage for persistent shopping carts)\n');

console.log('========== END OF DEMO ==========\n');

// ========================================
// CONSOLE COMMANDS TO TRY
// ========================================
console.log('TRY THESE IN CONSOLE:');
console.log('>>> sessionStorage.setItem("tempKey", "tempValue")');
console.log('>>> sessionStorage.getItem("tempKey")');
console.log('>>> sessionStorage.length');
console.log('>>> sessionStorage.clear()');
console.log();
console.log('THEN: Close this tab and open it again');
console.log('All sessionStorage data will be gone!');
console.log();
