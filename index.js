"use strict"

let yargs = require('yargs')
	, path = require('path')
	, fs = require('fs')
	, Promise = require('bluebird')
	, escape = require('escape-regexp')
	, isDirectory = require('is-directory');

 // Promise.promisifyAll(fs)

let res = [];
function ls(source, firstRun, callback) {
	firstRun = firstRun || false;
	callback = callback || function(){};
	source = path.resolve(path.sep + source);
	// fs.readdir(source, (err, items) => {
	// 	items.forEach((item, i, items) => {
	// 		var pathAndItem = path.join(source, item);
	// 		var pathAndItemLen = pathAndItem.split(path.sep).filter(Boolean).length;
	// 		var distanceFromBase = pathAndItemLen - baseDirLen;
	// 		// console.log(baseDirLen, pathAndItemLen, distanceFromBase);
	// 		var isDir = fs.lstatSync(pathAndItem).isDirectory();
	// 		if(isDir){
	// 			// console.log(baseDir + '\n' + item)			
	// 			console.log('-'.repeat(distanceFromBase), '📁', item);
	// 			ls(pathAndItem);
	// 		}else{
	// 			// console.log(baseDir + '\n' + item)
	// 			console.log('-'.repeat(distanceFromBase), '📄', item);
	// 		}
	// 	})
	// });


	var items = fs.readdirSync(source)

// console.log('items', items)
			items.forEach((item, i, items) => {
				var pathAndItem = path.join(source, item);
				var pathAndItemLen = pathAndItem.split(path.sep).filter(Boolean).length;
				var distanceFromBase = pathAndItemLen - baseDirLen;
				// console.log(baseDirLen, pathAndItemLen, distanceFromBase);
				var isDir = fs.lstatSync(pathAndItem).isDirectory();
				if(isDir){
					// console.log(baseDir + '\n' + item)			
					console.log('-'.repeat(distanceFromBase), '📁', item);
					ls(pathAndItem);
				}else{
					// console.log(baseDir + '\n' + item)
					console.log('-'.repeat(distanceFromBase), '📄', item);
				}
			})

	



}

function dirTest(item){	
	fs.lstatSync(item).isDirectory();
}

var baseDir = '/Users/thomashibbard/Desktop/ls-recursive/testDirectory';
var baseDirLen = baseDir.split(path.sep).filter(Boolean).length;
// console.log(baseDirArr);no
ls(baseDir, true, function(){
	processResults();
});
function processResults(){

	// console.log(res);
}


function sort(a, b){
  return function(a, b){
    if (a.name > b.name)
      return -1;
    if (a.name < b.name)
      return 1;
    return 0;
  };
}

