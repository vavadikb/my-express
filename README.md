# MyExpress

MyExpress is a simple custom copy of library for creating HTTP servers in the style of Express with support for CRUD operations.

## Installation

Install MyExpress using git :
git clone https://github.com/vavadikb/my-express


```


Usage

const app = new MyExpress();

// Add middleware
app.use((req, res, next) => {
  console.log(`Middleware executed for ${req.method} ${req.url}`);
  next();
});

// Handle GET request
app.get('/api/users', (req, res) => {
  // Logic to handle GET request for /api/users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'GET request handled for /api/users' }));
});

// Handle POST request
app.post('/api/users', (req, res) => {
  // Logic to handle POST request for /api/users
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'POST request handled for /api/users' }));
});

// Handle PUT request
app.put('/api/users/:id', (req, res) => {
  // Logic to handle PUT request for /api/users/:id
  const userId = req.params.id;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: `PUT request handled for /api/users/${userId}` }));
});

// Handle DELETE request
app.delete('/api/users/:id', (req, res) => {
  // Logic to handle DELETE request for /api/users/:id
  const userId = req.params.id;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: `DELETE request handled for /api/users/${userId}` }));
});

// Add static content (e.g., handle static files)
app.static(__dirname + '/public');

// Start the server on port 3000
app.start(3000);
```

CRUD Operations
GET ```/api/users``` Retrieve the list of users.
POST ```/api/users``` Create a new user.
PUT ```/api/users/:id``` Update user data with the specified identifier.
DELETE ```/api/users/:id``` Delete a user with the specified identifier.

### Middleware
You can add middleware to perform additional operations before handling requests. Middleware are called in the order they are added.
```
app.use((req, res) => {
  // Middleware logic
});
```

### Static Content
The static method allows you to handle static files. For example, all files in the public folder will be available at the corresponding URLs.

```app.static(__dirname + '/public');```