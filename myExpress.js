const http = require("http");
const fs = require("fs");
const path = require("path");

class MyExpress {
    constructor() {
      this.routes = {
        POST: {},
        GET: {},
        PUT: {},
        DELETE: {}
      };
      this.middlewares = [];
    }
  
    use(middleware) {
      this.middlewares.push(middleware);
    }
  
    addRoute(method, path, handler) {
      const paramNames = [];
      const pathRegex = path.replace(/:([^/]+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      });
  
      const regex = new RegExp(`^${pathRegex}$`);
  
      this.routes[method][path] = { handler, paramNames, regex };
    }
  
    get(path, handler) {
      this.addRoute('GET', path, handler);
    }
  
    post(path, handler) {
      this.addRoute('POST', path, handler);
    }
  
    put(path, handler) {
      this.addRoute('PUT', path, handler);
    }
  
    delete(path, handler) {
      this.addRoute('DELETE', path, handler);
    }
  
    handleRequest(req, res) {
      const { url, method } = req;
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
  
        const routes = this.routes[method];

        for (const routePath in routes) {
          if (routes.hasOwnProperty(routePath)) {
            const { handler, paramNames, regex } = routes[routePath];
            const match = url.match(regex);
  
            if (match) {
              const params = {};
              paramNames.forEach((paramName, index) => {
                params[paramName] = match[index + 1];
              });
  
              req.params = params;
              handler(req, res);
              return; 
            }
          }
        }
  
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
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

module.exports = MyExpress;
