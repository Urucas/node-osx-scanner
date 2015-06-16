// es6 runtime requirements
require('babel/polyfill');
import child_process from 'child_process';
import fs from 'fs';

export default function scan({
  tmpFolder = "./tmp", 
  verbose = false
} = {}){
  // run native osx-scanner
  let process = __dirname + "/../node_modules/osx-scanner/osx-scanner/osx-scanner";
  let child = child_process.spawnSync(process, []);
  
  // parse response
  let output = " " + child.stdout.toString();
      output = output.split("\n");
      
  let response = {};
  for(let i=0;i<output.length;i++) {
    let out = output[i];
    if(verbose) console.log(out);

    if(!/\=/.test(out)) continue;

    out = out.replace(/\=/ig, ":");
    out = out.replace(/\[/ig, "{");
    out = out.replace(/\]/ig, "}");
    out = out.replace(/\'/ig, "\"");
    
    try { out = JSON.parse(out); }catch(e){ continue; }
    for(let key in out) {
      response[key] = out[key];
    }
  }

  if(response.imagePath && response.imagePath.trim() !="") {
    
    // create tmp folder
    let path = tmpFolder;
    try { fs.mkdirSync(path); }catch(e){};
    
    // copy file
    let imageName = response.imagePath.match(/[\d]+\.jpeg$/);
    let imagePath = [path,"/"+imageName].join("");
    
    response.imagePath = response.imagePath.replace(/file\:\/\//,"");
    fs.createReadStream(response.imagePath).pipe(fs.createWriteStream(imagePath));

    // remove tmp file
    fs.unlinkSync(response.imagePath);
    response.imagePath = imagePath;
  }

  return response;
}
