// ========================
// QUERY STRINGS IN EXPRESS - ENHANCED
// ========================
// A query string is like sending a "question" in the URL
// Format: /route?key1=value1&key2=value2
// Example: /search?q=laptop&category=electronics

const express = require('express');
const app = express();

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
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .container { 
      max-width: 700px; 
      margin: 50px auto; 
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    h1 { color: #333; margin-bottom: 20px; border-bottom: 3px solid #00f2fe; padding-bottom: 10px; }
    h2 { color: #555; margin: 20px 0 10px 0; }
    p { color: #666; line-height: 1.6; margin: 10px 0; }
    .success { color: #27ae60; font-weight: bold; }
    .error { color: #e74c3c; font-weight: bold; }
    .info { color: #3498db; font-weight: bold; }
    hr { margin: 20px 0; border: none; border-top: 1px solid #ddd; }
    a { 
      display: inline-block;
      margin: 5px 5px 5px 0;
      padding: 10px 20px;
      background: #00f2fe;
      color: #333;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
      font-weight: bold;
    }
    a:hover { background: #4facfe; color: white; }
    a.secondary { background: #95a5a6; color: white; }
    a.secondary:hover { background: #7f8c8d; }
    .param-display { 
      background: #f0f8ff;
      border-left: 4px solid #00f2fe;
      padding: 15px;
      margin: 10px 0;
      border-radius: 5px;
    }
    .param-item { 
      background: white;
      padding: 10px;
      margin: 5px 0;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: monospace;
    }
    pre { 
      background: #f5f5f5; 
      padding: 15px; 
      border-radius: 5px;
      overflow-x: auto;
    }
    table { 
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
    th, td { 
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th { background: #f0f8ff; font-weight: bold; }
    .product-grid { 
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .product-card { 
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 5px;
      background: #f9f9f9;
    }
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
  res.send(getHeader('Query Strings') + `
    <h1>[QUERY STRINGS] Enhanced Demo</h1>
    
    <h2>What are Query Strings?</h2>
    <p>Query strings pass data in the URL after the <strong>?</strong> symbol</p>
    <p>Format: <code>/route?key1=value1&key2=value2</code></p>
    <p><strong>WARNING:</strong> Data is visible in URL - don't use for passwords!</p>
    
    <hr>
    <h2>Interactive Examples:</h2>
    <ul style="margin-left: 20px;">
      <li><a href="/welcome?name=Alice&age=25&city=NYC">Welcome Page</a> (Personal greeting)</li>
      <li><a href="/products?page=1&sort=price">Products Page</a> (Pagination)</li>
      <li><a href="/search?q=laptop">Search Results</a> (Search)</li>
      <li><a href="/filter?price=500-1000&brand=Dell&color=Silver">Product Filter</a> (Filtering)</li>
      <li><a href="/calculator?a=10&b=5&operation=multiply">Calculator</a> (Calculation)</li>
    </ul>
    
    <hr>
    <h2>Real-World Use Cases:</h2>
    <table>
      <tr>
        <th>Use Case</th>
        <th>Example URL</th>
      </tr>
      <tr>
        <td>Search</td>
        <td><code>?q=keyword</code></td>
      </tr>
      <tr>
        <td>Pagination</td>
        <td><code>?page=2&limit=20</code></td>
      </tr>
      <tr>
        <td>Filters</td>
        <td><code>?category=tech&price=100-500</code></td>
      </tr>
      <tr>
        <td>Tracking</td>
        <td><code>?utm_source=google&utm_campaign=sale</code></td>
      </tr>
    </table>
  ` + getFooter());
});

// ========================
// ROUTE 2: WELCOME PAGE
// ========================
app.get('/welcome', (req, res) => {
  const { name, age, city } = req.query;
  
  if (!name || !age || !city) {
    return res.send(getHeader('Error') + `
      <h1 class="error">[ERROR] Missing Parameters</h1>
      <p>Usage: /welcome?name=Alice&age=25&city=NYC</p>
      <a href="/welcome?name=Alice&age=25&city=NYC">Try with default values</a>
      <a href="/" class="secondary">Back Home</a>
    ` + getFooter());
  }
  
  res.send(getHeader('Welcome') + `
    <h1><span class="success">[WELCOME]</span></h1>
    
    <div class="param-display">
      <p><strong>Hello, ${name}!</strong></p>
      <p>Age: ${age} years old</p>
      <p>City: ${city}</p>
    </div>
    
    <hr>
    <h2>Parameters Received:</h2>
    <pre>${JSON.stringify(req.query, null, 2)}</pre>
    
    <h2>How It Works:</h2>
    <ol style="margin-left: 20px; line-height: 1.8;">
      <li>Browser reads parameters from the URL</li>
      <li>Sends them to the server</li>
      <li>Server extracts them from req.query</li>
      <li>Server uses them to create personalized response</li>
    </ol>
    
    <hr>
    <a href="/">Back Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 3: PRODUCTS PAGE
// ========================
app.get('/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const sort = req.query.sort || 'name';
  const itemsPerPage = 5;
  const totalProducts = 47;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startItem = (page - 1) * itemsPerPage + 1;
  const endItem = Math.min(page * itemsPerPage, totalProducts);
  
  const products = [
    'Dell Laptop', 'HP Monitor', 'Gaming Mouse', 'Mechanical Keyboard', 'USB-C Hub',
    'Webcam 1080p', 'Portable SSD', 'Wireless Charger', 'Phone Stand', 'Cable Organizer'
  ];
  
  res.send(getHeader('Products') + `
    <h1>[PRODUCTS] Pagination Demo</h1>
    
    <div class="param-display">
      <p><strong>Page:</strong> ${page} of ${totalPages}</p>
      <p><strong>Sort By:</strong> ${sort}</p>
      <p><strong>Showing:</strong> Items ${startItem}-${endItem} (Total: ${totalProducts})</p>
    </div>
    
    <hr>
    <h2>Products on This Page:</h2>
    <div class="product-grid">
      ${products.slice((page-1)*itemsPerPage, page*itemsPerPage).map((p, i) => `
        <div class="product-card">
          <p><strong>${startItem + i}. ${p}</strong></p>
          <p style="font-size: 12px; color: #999;">$${Math.floor(Math.random() * 500) + 50}</p>
        </div>
      `).join('')}
    </div>
    
    <hr>
    <h2>Pagination Links:</h2>
    ${page > 1 ? `<a href="/products?page=${page-1}&sort=${sort}">[Previous]</a>` : ''}
    ${[1,2,3,4,5].map(p => `
      <a href="/products?page=${p}&sort=${sort}" ${p === page ? 'style="background: #764ba2; color: white;"' : ''}>[${p}]</a>
    `).join('')}
    ${page < totalPages ? `<a href="/products?page=${page+1}&sort=${sort}">[Next]</a>` : ''}
    
    <hr>
    <h2>Sort Options:</h2>
    <a href="/products?page=1&sort=name">Name</a>
    <a href="/products?page=1&sort=price">Price</a>
    <a href="/products?page=1&sort=newest">Newest</a>
    
    <hr>
    <a href="/" class="secondary">Back Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 4: SEARCH
// ========================
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  const category = req.query.category || 'all';
  
  if (!query) {
    return res.send(getHeader('Search') + `
      <h1 class="error">[SEARCH] No Query Provided</h1>
      <p>Usage: /search?q=keyword&category=electronics</p>
      <a href="/search?q=laptop&category=electronics">Try example search</a>
      <a href="/" class="secondary">Back Home</a>
    ` + getFooter());
  }
  
  const results = [
    'Laptop Pro 15',
    'Gaming Laptop RTX',
    'Budget Laptop 2024',
    'Laptop Backpack',
    'Laptop Stand'
  ];
  
  res.send(getHeader('Search') + `
    <h1><span class="info">[SEARCH RESULTS]</span></h1>
    
    <div class="param-display">
      <p><strong>Query:</strong> "${query}"</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Results Found:</strong> ${results.length}</p>
    </div>
    
    <hr>
    <h2>Results:</h2>
    <ol style="margin-left: 20px;">
      ${results.map((r, i) => `<li>${r}</li>`).join('')}
    </ol>
    
    <hr>
    <h2>Filter by Category:</h2>
    <a href="/search?q=${query}&category=electronics">Electronics</a>
    <a href="/search?q=${query}&category=computers">Computers</a>
    <a href="/search?q=${query}&category=accessories">Accessories</a>
    
    <hr>
    <a href="/" class="secondary">Back Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 5: FILTER
// ========================
app.get('/filter', (req, res) => {
  const price = req.query.price || 'all';
  const brand = req.query.brand || 'all';
  const color = req.query.color || 'all';
  
  res.send(getHeader('Filter') + `
    <h1><span class="info">[FILTER RESULTS]</span></h1>
    
    <div class="param-display">
      <div class="param-item"><strong>Price Range:</strong> ${price}</div>
      <div class="param-item"><strong>Brand:</strong> ${brand}</div>
      <div class="param-item"><strong>Color:</strong> ${color}</div>
    </div>
    
    <hr>
    <h2>Found 23 Products Matching Your Filters</h2>
    
    <hr>
    <h2>Refine Your Search:</h2>
    <h3>Price Range:</h3>
    <a href="/filter?price=0-500&brand=${brand}&color=${color}">Under $500</a>
    <a href="/filter?price=500-1000&brand=${brand}&color=${color}">$500-$1000</a>
    <a href="/filter?price=1000&brand=${brand}&color=${color}">Over $1000</a>
    
    <h3>Brand:</h3>
    <a href="/filter?price=${price}&brand=Dell&color=${color}">Dell</a>
    <a href="/filter?price=${price}&brand=HP&color=${color}">HP</a>
    <a href="/filter?price=${price}&brand=Lenovo&color=${color}">Lenovo</a>
    
    <h3>Color:</h3>
    <a href="/filter?price=${price}&brand=${brand}&color=Silver">Silver</a>
    <a href="/filter?price=${price}&brand=${brand}&color=Black">Black</a>
    <a href="/filter?price=${price}&brand=${brand}&color=Gold">Gold</a>
    
    <hr>
    <a href="/" class="secondary">Back Home</a>
  ` + getFooter());
});

// ========================
// ROUTE 6: CALCULATOR
// ========================
app.get('/calculator', (req, res) => {
  const a = parseFloat(req.query.a) || 0;
  const b = parseFloat(req.query.b) || 0;
  const operation = req.query.operation || 'add';
  
  let result;
  switch(operation) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide': result = b !== 0 ? a / b : 'Error: Cannot divide by zero'; break;
    default: result = 'Unknown operation';
  }
  
  res.send(getHeader('Calculator') + `
    <h1>[CALCULATOR] Query String Math</h1>
    
    <div class="param-display">
      <p><strong>First Number (a):</strong> ${a}</p>
      <p><strong>Second Number (b):</strong> ${b}</p>
      <p><strong>Operation:</strong> ${operation}</p>
      <hr>
      <p><strong>Result:</strong> <span class="info" style="font-size: 24px;">${result}</span></p>
    </div>
    
    <hr>
    <h2>Try Different Operations:</h2>
    <a href="/calculator?a=10&b=5&operation=add">10 + 5</a>
    <a href="/calculator?a=10&b=5&operation=subtract">10 - 5</a>
    <a href="/calculator?a=10&b=5&operation=multiply">10 * 5</a>
    <a href="/calculator?a=10&b=5&operation=divide">10 / 5</a>
    
    <hr>
    <a href="/" class="secondary">Back Home</a>
  ` + getFooter());
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('[SERVER] Query Strings Enhanced Demo Started!');
  console.log('='.repeat(60));
  console.log(`\n[INFO] Open in your browser:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log('[FEATURES]');
  console.log(`  [1] Welcome with personalization`);
  console.log(`  [2] Products pagination`);
  console.log(`  [3] Search with filters`);
  console.log(`  [4] Product filter system`);
  console.log(`  [5] Calculator demo`);
  console.log('\n' + '='.repeat(60) + '\n');
});
