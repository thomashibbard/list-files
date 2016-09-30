"use strict"

const yargs = require('yargs').argv
	, path = require('path')
	, fs = require('fs')
	, Promise = require('bluebird')
	, isImage = require('is-image')
	, junk = require('junk')
	, _sortBy = require('lodash.sortby')
	, chalk = require('chalk')
	// , _ = require('lodash');

let res = {};
// let junkFlag = yargs.h || false;
// console.log(junkFlag);
let listFiles = function(source, parentDistance, firstRun, callback) {
	// res[source] = [];
	parentDistance = parentDistance || 0;
	firstRun = firstRun || false;
	callback = callback || (() => {});
	source = path.resolve(path.sep + source);

	if(firstRun){
		console.log(' ', chalk.bgWhite.blue('' + source));
	}
	let items = fs.readdirSync(source).filter(junk.not);
	// let items = fs.readdirSync(source).filter(junkFlag ? junk.not : () => true);

	//single item and path to object containing type, icon, etc
	let itemsAsObj = items.map((item, index, itemsArr) => { 
		return getFileProperties(source, item, index, itemsArr);
	});
	// console.log(JSON.stringify(itemsAsObj, false, 2));
	//sort to put directories first by name, then all other file types alphabetically
	itemsAsObj = _sortBy(itemsAsObj, [function(o) { return o.type !== 'dir'; }, 'name']);

	itemsAsObj.forEach((item, index, itemsArr) => {
		// let pathAndItem = item.fullPath;
		// console.log(item)
		let pathAndItemLen = item.fullPath.split(path.sep).filter(Boolean).length;
		let distanceFromBase = pathAndItemLen - baseDirLen;
		let leader;

		if(item.type === 'dir'){//print item and recurse function
			leader = getVisualIndexIdentifier(distanceFromBase);
			console.log(leader, ' | '.repeat(distanceFromBase), item.familyStatus.bracket, item.icon, item.item);
			listFiles(item.fullPath, distanceFromBase);
		}else{//print item
			leader = getVisualIndexIdentifier(distanceFromBase);
			console.log(leader, ' | '.repeat(distanceFromBase), item.familyStatus.bracket, item.icon, item.item);
		}
	});
}

function getFileProperties(source, item, index, items){
  let fullPath = path.join(source, item);
	let isImageFlag = isImage(fullPath);
	let isDirFlag = isDirectory(fullPath);

	let familyStatus = getFamilyStatus(fullPath, item, items, index);
	let returnObj = {};
  returnObj.item = item;
  returnObj.fullPath = fullPath;
  returnObj.familyStatus = familyStatus;

  if(isImageFlag){
  	returnObj.type = 'image';
  	returnObj.icon = ' 🗻 ';
  }else if(isDirFlag){
  	returnObj.type = 'dir';
  	returnObj.icon = ' 📁 ';
  }else{
  	returnObj.type = 'file';
  	returnObj.icon = ' 📄 ';
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

function getFamilyStatus(fullPath, item, items, index){
	// console.log(fullPath, item, items, index);
	let ret = {};
	if(hasChildren(fullPath, item, items, index)){
		ret.succession = 'patriarch';
		ret.bracket = '└──┬';	
		// console.log(ret)	
	}else if(isFirstChild(index)){
		ret.succession = 'first child';
		ret.bracket = '├──';
	}else if(isMiddleChild(items, index)){
		ret.succession = 'middle child';
		ret.bracket = '├──';
	}else if(isLastChild(items, index)){
		ret.succession = 'last child';
		ret.bracket = '└──';
	}else{
		ret.bracket= '»';
	}
	return ret;
}

function hasChildren(fullPath, item, items, index){
	if(isDirectory(fullPath) && fs.readdirSync(fullPath).length > 0){
		return true;
	}else{
		return false;
	}
}

function isFirstChild(index){
	return index === 0;
}

function isMiddleChild(items, index){
	// console.log(index, items)

  return index !== 0 && index !== items.length-1;
}

function isLastChild(items, index){
	// console.log(index, items.length-1)
	return index === items.length-1;
}

let baseDir = yargs.d || path.join(__dirname, 'testDirectory');
let baseDirLen = baseDir.split(path.sep).filter(Boolean).length;

listFiles(baseDir, 0, true, function(){
	console.log('done');
});



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
module.exports = listFiles;

