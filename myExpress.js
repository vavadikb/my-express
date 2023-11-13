const http = require('http');
const fs = require('fs')
const path = require('path');  



class MyExpress {
    constructor() {
      this.routes = {
        POST: {},
        GET:{},
        PUT:{},
        DELETE:{}
      };
      this.middlewares = [];
    }
  
    use(middleware) {
      this.middlewares.push(middleware);
    }
  
    get(path, handler){
        this.routes.GET[path]= handler
    }

    post(path, handler) {
      this.routes.POST[path] = handler;
    }

    put(path,handler) {
        this.routes.PUT[path] = handler
    }

    delete(path,handler) {
        this.routes.DELETE[path] = handler
    }
  
    handleRequest(req, res) {
      const { url, method, headers } = req;
      const buffer = [];
      req.on('data', (chunk) => {
        buffer.push(chunk);
      });
      req.on('end', () => {
        const data = Buffer.concat(buffer).toString();
        req.body = data ? JSON.parse(data) : {};
  
        for (const middleware of this.middlewares) {
          middleware(req, res);
        }
  
        const routeHandler = this.routes[method][url];
        if (routeHandler) {
          routeHandler(req, res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      });
    }
    
    static(rootPath) {
        return (req, res, next) => {
          const filePath = path.join(rootPath, req.url);
      
          fs.stat(filePath, (err, stats) => {
            if (err) {
              return next();
            }
      
            if (stats.isFile()) {
              const stream = fs.createReadStream(filePath);
              stream.pipe(res);
            } else {
              return next();
            }
          });
        };
      }  
    start(port) {
      const server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });
  
      server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
      });
    }
  }

  
module.exports = MyExpress