#! /usr/bin/env node

"use strict"

const yargs = require('yargs').argv
	, path = require('path')
	, fs = require('fs')
	, isImage = require('is-image')
	, junk = require('junk')
	, _sortBy = require('lodash.sortby')
	, chalk = require('chalk');

function listFiles(source, parentDistance, firstRun, callback) {
	parentDistance = parentDistance || 0;
	firstRun = firstRun || false;
	source = path.resolve(path.sep + source);

	if(firstRun){
		console.log(' ', chalk.bgWhite.blue(source));
	}

	let items = fs.readdirSync(source).filter(junk.not);

	items = filterGitIgnore(items);


	//single item and path to object containing type, icon, etc
	let itemsAsObj = items.map((item, index, itemsArr) => { 
		return getFileProperties(source, item, index, itemsArr);
	});

	//sort to put directories first by name, then all other file types alphabetically

	itemsAsObj = _sortBy(itemsAsObj, [function(o) { return o.type !== 'dir'; }, 'name']);
	let index = 0;
	for(let item of itemsAsObj){

		let pathAndItemLen = item.fullPath.split(path.sep).filter(Boolean).length;
		let distanceFromBase = pathAndItemLen - baseDirLen;

		//continue loop is `maxDepth` has been specified
		if(maxDepth && distanceFromBase > maxDepth){
			continue;
		}

		if(item.type === 'dir'){
			//print item and recurse function
			console.log(' | '.repeat(distanceFromBase-1), item.familyStatus.bracket, item.icon, item.item);
			listFiles(item.fullPath, distanceFromBase);
		}else{
			//print item
			console.log(' | '.repeat(distanceFromBase-1), item.familyStatus.bracket, item.icon, item.item);
		}
		index++;		
	}
}

function filterGitIgnore(items){
	let re = /\r\n?|\n/gm;
	let gitIgnoredFiles = fs.readFileSync('.gitignore', 'utf8');
	gitIgnoredFiles = gitIgnoredFiles.split(re).filter(Boolean).concat('.git');
	// console.log('gitIgnoredFiles', gitIgnoredFiles)
	return items.filter(item => {
		return gitIgnoredFiles.indexOf(item) < 0;
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
  	returnObj.icon = '🗻 ';
  }else if(isDirFlag){
  	returnObj.type = 'dir';
  	returnObj.icon = '📁 ';
  }else{
  	returnObj.type = 'file';
  	returnObj.icon = '📄 ';
  }
  return returnObj;
}

function isDirectory(item){
	return fs.lstatSync(item).isDirectory();
}

function getFamilyStatus(fullPath, item, items, index){

	let ret = {};
	if(hasChildren(fullPath, item, items, index)){
		ret.succession = 'patriarch';
		ret.bracket = '└──┬';	
	}else if(isFirstChild(index)){
		ret.succession = 'first child';
		ret.bracket = '├───';
	}else if(isMiddleChild(items, index)){
		ret.succession = 'middle child';
		ret.bracket = '├───';
	}else if(isLastChild(items, index)){
		ret.succession = 'last child';
		ret.bracket = '└───';
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
  return index !== 0 && index !== items.length-1;
}

function isLastChild(items, index){
	return index === items.length-1;
}

let baseDir = process.cwd();
let baseDirLen = baseDir.split(path.sep).filter(Boolean).length;

let maxDepth = yargs.maxdepth || yargs.depth || false;
listFiles(baseDir, 0, true);

module.exports = listFiles;

