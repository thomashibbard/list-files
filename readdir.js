var recursive = require('recursive-readdir');

recursive('/Users/thomashibbard/Desktop/ls-recursive/testDirectory', function (err, files) {
  // Files is an array of filename
  console.log(files);
});