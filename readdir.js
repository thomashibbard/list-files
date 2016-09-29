var recursive = require('recursive-readdir');
var rdr = require('readdir-recursive-promise');
var directoryContents = require('directory-contents');

var dir = '/Users/thomashibbard/Desktop/ls-recursive/testDirectory';
// recursive('/Users/thomashibbard/Desktop/ls-recursive/testDirectory', function (err, files) {
//   // Files is an array of filename
//   console.log(files);
// });

directoryContents(dir, function(err, contents) {
	if (err) throw err;
	console.log(contents);
});