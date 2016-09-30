#Mister Lister

Print a list of files and directories in a format resembling the output provided by `npm list`

###Install Globally

 `npm intall -g mister-lister`


###Run

1. In CLI, navigate to directory for which you want a list of files

2. Run `lister`


###Options

* `--depth=n` or `--maxdepth=n` where *n* is the number of file layers displayed

###Output

````
  /Users/thomas/Downloads/testDirectory
 └──┬ 📁  levelTwoDirectory1
 |  ├─── 📁  emptyDirectory
 |  └─── 📄  text1-1.txt
 └──┬ 📁  levelTwoDirectory2
 |  └──┬ 📁  levelThreeDirectory1
 |  |  └──┬ 📁  levelFourDirectory1
 |  |  |  ├─── 🗻  image4-1-1.jpg
 |  |  |  ├─── 🗻  image4-1-2.jpg
 |  |  |  ├─── 🗻  image4-1-3.jpeg
 |  |  |  ├─── 📄  text4-2-1.txt
 |  |  |  └─── 📄  text4-2-2.txt
 |  |  ├─── 🗻  image3-2-1.jpg
 |  |  └─── 📄  text3-2-1.txt
 |  └─── 📄  text2-1.txt
 ├─── 📄  text0-1.txt
 └─── 📄  text0-2.txt
 ````