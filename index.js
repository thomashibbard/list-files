"use strict"

const yargs = require('yargs').argv
	, path = require('path')
	, fs = require('fs')
	, Promise = require('bluebird')
	, escape = require('escape-regexp')
	, isImage = require('is-image')
	, junk = require('junk')
	, _sortBy = require('lodash.sortby')
	// , _ = require('lodash');

let res = {};
// let junkFlag = yargs.h || false;
// console.log(junkFlag);
let lt = function(source, parentDistance, callback) {
	// res[source] = [];
	parentDistance = parentDistance || 0;
	callback = callback || function(){};
	source = path.resolve(path.sep + source);

	let items = fs.readdirSync(source).filter(junk.not);
	// let items = fs.readdirSync(source).filter(junkFlag ? junk.not : () => true);

	//single item and path to object containing type, icon, etc
	let itemsAsObj = items.map((item) => { 
		return getFileProperties(source, item);
	});

	//sort to put directories first by name, then all other file types alphabetically
	itemsAsObj = _sortBy(itemsAsObj, [function(o) { return o.type !== 'dir'; }, 'name']);

	itemsAsObj.forEach((item, i, items) => {
		let pathAndItem = item.fullPath;
		let pathAndItemLen = pathAndItem.split(path.sep).filter(Boolean).length;
		let distanceFromBase = pathAndItemLen - baseDirLen;
		let leader;

		if(item.type === 'dir'){
			leader = getVisualIndexIdentifier(distanceFromBase);
			// res[item] = [];
			console.log(leader, '» '.repeat(distanceFromBase), item.icon, item.item);
			lt(pathAndItem, distanceFromBase);
		}else{
			leader = getVisualIndexIdentifier(distanceFromBase);
			//res[item].push(item);
			console.log(leader, '» '.repeat(distanceFromBase), item.icon, item.item);
		}
	});
}

function getFileProperties(source, item){
  let fullPath = path.join(source, item);
	let isImageFlag = isImage(fullPath);
	let isDirFlag = isDirectory(fullPath);
	let returnObj;
  if(isImageFlag){
  	returnObj = {type: 'image', item: item, fullPath: fullPath, icon: '🗻 '};
  }else if(isDirFlag){
  	returnObj = {type: 'dir', item: item, fullPath: fullPath, icon: '📁 '};
  }else{
  	returnObj = {type: 'file', item: item, fullPath: fullPath, icon: '📄 '};
  }
  return returnObj;
}

function isDirectory(item){
	return fs.lstatSync(item).isDirectory();
}

function getFileType(path){

}

function getVisualIndexIdentifier(distanceFromBase){
	let leader = '';
	if (distanceFromBase === 1){
		//leader = '├─';
	}	else{
		//leader = '└─'
	}
	return leader;
}

function dirTest(item){	
	fs.lstatSync(item).isDirectory();
}

let baseDir = yargs.d || path.join(__dirname, 'testDirectory');
let baseDirLen = baseDir.split(path.sep).filter(Boolean).length;

lt(baseDir, 0, function(){
	processResults();
});

function isFirstChild(){

}

function isMiddleChild(){

}

function isLastChild(){

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
// console.log(JSON.stringify(res, false, 2));
module.exports = lt;

