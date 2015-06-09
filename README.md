# node-osx-scanner
Scanning an image in osx from Node

# Install
```bash
npm install --save node-osx-scanner
```

# Usage
```javascript
var scan = require("node-osx-scanner");
var response = scan();
console.log(response);
// {state:"Finished", imagePath:"./tmp/14338224024.jpeg"}
```
