"use strict"

const yargs = require('yargs').argv
	, path = require('path')
	, fs = require('fs')
	, Promise = require('bluebird')
	, escape = require('escape-regexp')
	, isImage = require('is-image')
	, junk = require('junk');

let res = {};
let lt = function(source, parentDistance, callback) {
	// firstRun = firstRun || false;
	parentDistance = parentDistance || 0;
	callback = callback || function(){};
	source = path.resolve(path.sep + source);

	let items = fs.readdirSync(source);
	items = items.filter(junk.not)

	items.forEach((item, i, items) => {
		let pathAndItem = path.join(source, item);
		let pathAndItemLen = pathAndItem.split(path.sep).filter(Boolean).length;
		let distanceFromBase = pathAndItemLen - baseDirLen;
		let leader;
		let isDir = isDirectory(pathAndItem)
		let icon = getIcon(pathAndItem);

		if(isDir){
			leader = getVisualIndexIdentifier(distanceFromBase);
			console.log(leader, '» '.repeat(distanceFromBase - 1), icon.icon, item);
			lt(pathAndItem, distanceFromBase);
		}else{
			leader = getVisualIndexIdentifier(distanceFromBase - 1);
			// console.log(distanceFromBase)
			console.log(leader, '» '.repeat(distanceFromBase - 1), icon.icon, item);
		}
	})
}
function getIcon(path){
  
	let isImageFlag = isImage(path);
	let isDirFlag = isDirectory(path);
	var ret;
  if(isImageFlag){
  	ret = {type: 'image', icon: '🗻 '};
  }else if(isDirFlag){
  	ret = {type: 'dir', icon: '📁 '};
  }else{
  	ret = {type: 'file', icon: '📄 '};
  }
  return ret;
}

function isDirectory(item){
	return fs.lstatSync(item).isDirectory();
}

function getItemType(item){
	let ret;

	if(isImage(item)){
		ret = {type: 'image', icon: '🗻 '};
	}else if(isDir(item)){
		ret = {type: 'dir', icon: '📁 '};
	}else if(isFile(item)){
		ret = {type: 'file', icon: '📄 '};
	}
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

module.exports = lt;

