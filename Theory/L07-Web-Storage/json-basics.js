// ========================================
// LECTURE 7: JSON BASICS
// ========================================
// JSON = JavaScript Object Notation
// It's a format for converting objects to strings and back
//
// WHY? Storage only accepts STRINGS
// But we need to save OBJECTS
// Solution: JSON.stringify() and JSON.parse()

console.log('\n========== JSON DEMO ==========\n');

// ========================================
// PART 1: THE PROBLEM
// ========================================
console.log('[1] THE PROBLEM: Objects become "[object Object]"');
console.log('-----------------------------------');

const user = { name: 'Alice', age: 25, city: 'NYC' };
console.log('Original object:', user);

// What happens if we save it directly as string?
const badAttempt = '' + user;
console.log('Saving directly:', badAttempt); // "[object Object]" - USELESS!
console.log('Lost all data!\n');

// ========================================
// PART 2: JSON.stringify() - OBJECT TO STRING
// ========================================
console.log('[2] JSON.stringify() - Convert Object to String');
console.log('-----------------------------------');

const person = {
  name: 'Bob',
  age: 30,
  city: 'LA',
  skills: ['JavaScript', 'Python', 'SQL']
};

console.log('Original object:');
console.log(person);
console.log();

// Convert to JSON string
const jsonString = JSON.stringify(person);
console.log('After JSON.stringify():');
console.log(jsonString);
console.log('Type:', typeof jsonString); // "string"
console.log();

// ========================================
// PART 3: JSON.stringify WITH FORMATTING
// ========================================
console.log('[3] JSON.stringify() - Pretty Printing');
console.log('-----------------------------------');

// Make it readable (3rd parameter = indentation)
const prettyJson = JSON.stringify(person, null, 2);
console.log('Pretty-printed JSON:');
console.log(prettyJson);
console.log();

// ========================================
// PART 4: JSON.parse() - STRING TO OBJECT
// ========================================
console.log('[4] JSON.parse() - Convert String back to Object');
console.log('-----------------------------------');

const storedJson = '{"name":"Charlie","age":28,"hobbies":["reading","gaming"]}';
console.log('Stored JSON string:');
console.log(storedJson);
console.log('Type:', typeof storedJson); // "string"
console.log();

// Convert back to object
const parsedObject = JSON.parse(storedJson);
console.log('After JSON.parse():');
console.log(parsedObject);
console.log('Type:', typeof parsedObject); // "object"
console.log();

// Now we can access properties
console.log('Accessing properties:');
console.log('  Name:', parsedObject.name);
console.log('  Age:', parsedObject.age);
console.log('  First hobby:', parsedObject.hobbies[0]);
console.log();

// ========================================
// PART 5: ARRAYS IN JSON
// ========================================
console.log('[5] JSON with ARRAYS');
console.log('-----------------------------------');

const tasks = [
  { id: 1, title: 'Learn JSON', completed: true },
  { id: 2, title: 'Build a todo app', completed: false },
  { id: 3, title: 'Deploy to server', completed: false }
];

console.log('Original array of objects:');
console.log(tasks);
console.log();

const tasksJson = JSON.stringify(tasks, null, 2);
console.log('As JSON string:');
console.log(tasksJson);
console.log();

const tasksBack = JSON.parse(tasksJson);
console.log('Parsed back:');
console.log(tasksBack);
console.log('Access task 1 title:', tasksBack[0].title);
console.log();

// ========================================
// PART 6: FULL ROUND-TRIP WITH STORAGE
// ========================================
console.log('[6] COMPLETE FLOW: Object -> Storage -> Object');
console.log('-----------------------------------');

const settings = {
  theme: 'dark',
  fontSize: 16,
  notifications: true,
  languages: ['English', 'Spanish', 'French']
};

console.log('Step 1: Original object');
console.log(settings);
console.log();

// Step 2: Save to storage
console.log('Step 2: Convert to JSON and save');
const jsonData = JSON.stringify(settings);
localStorage.setItem('userSettings', jsonData);
console.log('Saved to localStorage:', jsonData);
console.log();

// Step 3: Read from storage
console.log('Step 3: Read from localStorage');
const retrievedJson = localStorage.getItem('userSettings');
console.log('Retrieved JSON:', retrievedJson);
console.log();

// Step 4: Parse back to object
console.log('Step 4: Parse JSON back to object');
const restoredSettings = JSON.parse(retrievedJson);
console.log('Restored object:');
console.log(restoredSettings);
console.log('Access theme:', restoredSettings.theme);
console.log('Access languages:', restoredSettings.languages);
console.log();

// Clean up
localStorage.removeItem('userSettings');

// ========================================
// PART 7: ERROR HANDLING
// ========================================
console.log('[7] ERROR HANDLING: Invalid JSON');
console.log('-----------------------------------');

// This is valid JSON
try {
  const valid = JSON.parse('{"name":"Alice"}');
  console.log('Valid JSON parsed:', valid);
} catch (e) {
  console.log('Error:', e.message);
}
console.log();

// This is INVALID JSON
console.log('Trying to parse invalid JSON:');
try {
  const invalid = JSON.parse("{'name':'Alice'}"); // Single quotes - invalid!
  console.log('Parsed:', invalid);
} catch (e) {
  console.log('ERROR caught:', e.message);
  console.log('This is safe - error is handled, app continues');
}
console.log();

// ========================================
// PART 8: SPECIAL VALUES
// ========================================
console.log('[8] JSON with SPECIAL VALUES');
console.log('-----------------------------------');

console.log('String: ' + JSON.stringify('hello'));
console.log('Number: ' + JSON.stringify(42));
console.log('Boolean: ' + JSON.stringify(true));
console.log('Array: ' + JSON.stringify([1, 2, 3]));
console.log('Null: ' + JSON.stringify(null));
console.log('Undefined: ' + JSON.stringify(undefined)); // undefined becomes null
console.log();

// ========================================
// PART 9: PRACTICAL PATTERNS
// ========================================
console.log('[9] PRACTICAL HELPER FUNCTIONS');
console.log('-----------------------------------');

// Helper function to save objects
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  console.log(`Saved ${key} to localStorage`);
}

// Helper function to load objects
function loadData(key) {
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json);
  }
  return null;
}

// Using the helpers
const book = {
  title: 'Learning JavaScript',
  author: 'John Doe',
  pages: 450,
  tags: ['JavaScript', 'Programming', 'Learning']
};

console.log('\nSaving and loading data:');
saveData('myBook', book);
console.log();

const retrievedBook = loadData('myBook');
console.log('Retrieved book:');
console.log(retrievedBook);
console.log('Book title:', retrievedBook.title);
console.log('Book author:', retrievedBook.author);
console.log();

// Clean up
localStorage.removeItem('myBook');

// ========================================
// PART 10: COMMON MISTAKES
// ========================================
console.log('[10] COMMON MISTAKES');
console.log('-----------------------------------');
console.log('MISTAKE 1: Forgetting to stringify');
console.log('  Wrong: localStorage.setItem("data", {a: 1})');
console.log('  Result: "[object Object]" - data lost!');
console.log('  Right: localStorage.setItem("data", JSON.stringify({a: 1}))');
console.log();

console.log('MISTAKE 2: Forgetting to parse');
console.log('  Wrong: const obj = localStorage.getItem("data");');
console.log('  obj.a -> undefined (it\'s a string!)');
console.log('  Right: const obj = JSON.parse(localStorage.getItem("data"));');
console.log('  obj.a -> works!');
console.log();

console.log('MISTAKE 3: Not handling null');
console.log('  Wrong: JSON.parse(localStorage.getItem("key"))');
console.log('  If key doesn\'t exist -> JSON.parse(null) -> Error!');
console.log('  Right: const x = localStorage.getItem("key");');
console.log('         const data = x ? JSON.parse(x) : null;');
console.log();

console.log('========== END OF DEMO ==========\n');

// ========================================
// SUMMARY
// ========================================
console.log('SUMMARY:');
console.log('- JSON is text format for storing objects');
console.log('- JSON.stringify(object) -> converts to string');
console.log('- JSON.parse(string) -> converts back to object');
console.log('- Storage only accepts strings');
console.log('- Use JSON to save/load complex data');
console.log('- Always handle errors with try...catch');
console.log();
