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
let lt = function(source, parentDistance, callback) {
	res[source] = [];
	parentDistance = parentDistance || 0;
	callback = callback || function(){};
	source = path.resolve(path.sep + source);

	let items = fs.readdirSync(source).filter(junk.not);
	let itemsAsObj = items.map((item, i, items) => { 
		let pathAndItem = path.join(source, item);
		return getFileProperties(item, pathAndItem);
	});

	itemsAsObj = _sortBy(itemsAsObj, [function(o) { return o.type !== 'dir'; }, 'name']);

	itemsAsObj.forEach((item, i, items) => {
		let pathAndItem = item.fullPath;
		let pathAndItemLen = pathAndItem.split(path.sep).filter(Boolean).length;
		let distanceFromBase = pathAndItemLen - baseDirLen;
		let leader;

		if(item.type === 'dir'){
			leader = getVisualIndexIdentifier(distanceFromBase);
			// res[item] = [];
			console.log(leader, '» '.repeat(distanceFromBase - 1), item.icon, item.item);
			lt(pathAndItem, distanceFromBase);
		}else{
			leader = getVisualIndexIdentifier(distanceFromBase - 1);
			//res[item].push(item);
			console.log(leader, '» '.repeat(distanceFromBase - 1), item.icon, item.item);
		}
	});
}

function getFileProperties(item, fullPath){
  // console.log('item', item);
	let isImageFlag = isImage(fullPath);
	let isDirFlag = isDirectory(fullPath);
	var ret;
  if(isImageFlag){
  	ret = {type: 'image', item: item, fullPath: fullPath, icon: '🗻 '};
  }else if(isDirFlag){
  	ret = {type: 'dir', item: item, fullPath: fullPath, icon: '📁 '};
  }else{
  	ret = {type: 'file', item: item, fullPath: fullPath, icon: '📄 '};
  }
  return ret;
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

let baseDir = yargs.d || '/Users/thomashibbard/Desktop/ls-recursive/testDirectory';
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

