const FileCache = require('./fileCache');
const cache = new FileCache('./cache');

cache.set('key', {foo: 'bar'}, 60); // store a cache entry with key 'mykey', value {foo: 'bar'}, and TTL of 60 seconds
const value = cache.get('key'); // retrieve the value for key 'mykey'
console.log(value); // output: {foo: 'bar'}
cache.delete('key'); // remove the cache entry with key 'mykey'
cache.clear(); // remove all cache entries
