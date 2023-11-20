const http = require('http');
const fs = require('fs');
const path = require('path');

class MyExpress {
    constructor() {
        this.settings = {
            'view engine': 'pug',
            'views': './views',
            'port': 3000,
            'env': 'development',
            'case sensitive routing': false,
            'strict routing': false,
          };
        this.routes = {
            POST: {},
            GET: {},
            PUT: {},
            DELETE: {}
        };
        this.middlewares = [];
    }

    set(setting, value) {
        this.settings[setting] = value;
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

    getContentType(filePath) {
        const extname = String(path.extname(filePath)).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'image/svg+xml',
        };

        return mimeTypes[extname] || 'application/octet-stream';
    }

    static(rootPath) {
        return (req, res, next) => {
            let filePath = rootPath
            const contentType = this.getContentType(filePath);
            fs.readFile(filePath, (error, content) => {

                if (error) {
                    if (error.code === 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('Not Found');
                    } else {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end('Internal Server Error');
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        };
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

            this.static(path.join(__dirname, 'public'))(req, res, () => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Not Found');
            });
        });
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
