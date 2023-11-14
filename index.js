const path = require('path');  
const MyExpress = require("./myExpress.js");

const app = new MyExpress();

app.use(app.static(path.join(__dirname, 'index.html')));


app.get('/', (req, res) => {});
  app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    console.log(userId)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`User ID: ${userId}`);
  });


  app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
    console.log(postId)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`User ID: ${postId}`);
  });


app.get("/get", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  console.log("get req:");
  const data = [1, 2, 3, 4, 6, 7, 66];
  res.end("200 OK " + data);
});
  

app.post("/api", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  console.log("Received JSON data:", req.body);
  res.end("201 Created");
});

const PORT = 3000;
app.start(PORT);
