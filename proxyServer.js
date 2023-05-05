const http = require('http');
const https = require('https');
const url = require('url');
const FileCache = require('./fileCache');

const CACHE_TTL = 60; // cache TTL in seconds
const TARGET_HOST = 'https://www.boredapi.com';
const TARGET_PORT = 443;
const TARGET_PROTOCOL = 'https:';

const cache = new FileCache('./cache');

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url);
  const options = {
    host: TARGET_HOST,
    port: TARGET_PORT,
    path: reqUrl.path,
    method: req.method,
    headers: req.headers
  };

  let cacheKey = reqUrl.href;
  const cachePathSplitted = cacheKey.split("/");
  const cachePathJoined = cachePathSplitted.join('-');
  const cachedResponse = cache.get(cachePathJoined);
  if (cachedResponse) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(cachedResponse);
  } else {
    console.log("not stored")
    const targetProtocol = TARGET_PROTOCOL === 'https:' ? https : http;
    const targetReq = targetProtocol.get(options.host + options.path, targetRes => {
      let data = '';
      targetRes.on('data', chunk => {
        data += chunk;
      });
      targetRes.on('end', () => {
        const statusCode = targetRes.statusCode;
        const headers = targetRes.headers;
        if (req.method === 'GET' && statusCode === 200) {
          cache.set(cachePathJoined, data, CACHE_TTL);
        }
        res.writeHead(statusCode, headers);
        res.end(data);
      });
    });
    targetReq.on('error', err => {
      console.error(err);
      res.statusCode = 500;
      res.end('Proxy server error');
    });
    req.pipe(targetReq);
  }
});

server.listen(8080, () => {
  console.log('Proxy server listening on port 8080');
});
