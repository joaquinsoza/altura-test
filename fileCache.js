const fs = require('fs');
const path = require('path');

class FileCache {
  constructor(cacheDir) {
    this.cacheDir = cacheDir;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
  }

  set(key, value, ttl) {
    const entry = {
      value: value,
      expiry: Date.now() + (ttl * 1000)
    };
    const filePath = this.getFilePath(key);
    fs.writeFileSync(filePath, JSON.stringify(entry));
  }

  get(key) {
    const filePath = this.getFilePath(key);
    if (fs.existsSync(filePath)) {
      const entry = JSON.parse(fs.readFileSync(filePath));
      if (entry.expiry > Date.now()) {
        return entry.value;
      } else {
        fs.unlinkSync(filePath); // delete expired cache entry
      }
    }
    return null;
  }

  delete(key) {
    const filePath = this.getFilePath(key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  clear() {
    fs.readdirSync(this.cacheDir).forEach(file => {
      const filePath = path.join(this.cacheDir, file);
      fs.unlinkSync(filePath);
    });
  }

  getFilePath(key) {
    return path.join(this.cacheDir, key + '.json');
  }
}

module.exports = FileCache;
