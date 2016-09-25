
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
var isDirectory = Promise.promisify(require('is-directory'));
var glob = Promise.promisify(require("glob"));
// options is optional
glob("**/*.*").then(function(files){
	listFiles(files);
});

function listItems(items) {
	files.forEach(function(item){

	});
}