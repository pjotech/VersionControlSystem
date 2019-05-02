let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
var readlines = require('n-readlines');
let manifestFilename = "";


//-----------------------------Functions--------------------------------------------------------
const commitProject = (src, destination, version, label1, label2, label3, label4) => {

  return new Promise(resolve => {
    if (fs.existsSync(destination))
      fs.readdir(src, (err, files) => {

        files.forEach(file => {

          let temp_subFolderName = file;
          let destDir = `${destination}\\${temp_subFolderName}`;
          if (fs.existsSync(destDir))
            checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4)
          else
            fs.mkdir(destDir, { recursive: true }, (err) => {
              if (err) throw err;

              checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4)
            });
        });
        resolve("Files Copied");
      });
    else
      console.log("Sorry! Repository with same name already exists");
  })

};

const artifactID = (filePath) => {

  let artifactID;
  let stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  let arr = []; arr.push(1, 7, 3, 7, 11);
  let sum = 0;
  let stats = fs.statSync(filePath);
  let fileSizeInBytes = stats["size"];


  return new Promise((resolve, reject) => {

    stream.on('data', data => {
      for (let i = 0; i < fileSizeInBytes; i++) {
        sum = sum + data[i].charCodeAt(0) * arr[0];
        arr.push(arr[0]);
        arr.shift();
        artifactID = sum + '-' + 'L' + fileSizeInBytes;
        stream.destroy();
      }
      resolve(artifactID)
    }, () => {
      resolve(artifactID)
    })
      .on('error', err => {
        reject(err)
      });
  });
};

const makeAndCopyCheckout = (file1, src, destDir, repopath, version) => {
  let f = file1.split('.')[1];

  if (!fs.lstatSync(destDir + "\\" + file1).isDirectory()) {

    if (f !== undefined)

      copyFileCheckout(file1, src, destDir, repopath, version);
  }
  else {

    fs.readdir(src, (err, files) => {
      files.forEach(file => {



        let temp_subFolderName1 = file;
        if (!fs.existsSync(destDir + "\\" + file1 + "\\" + temp_subFolderName1)) {


          let f2 = temp_subFolderName1.split('.')[1];
          if (f2 === undefined) {

            fs.readFile(manifestFilename, function (err, data) {
              if (err) throw err;

              if (data.indexOf(src + "\\" + temp_subFolderName1) >= 0) {

                fs.mkdir(destDir + "\\" + file1 + "\\" + temp_subFolderName1, { recursive: false }, (err) => {
                  if (err) throw err;
                  let f = file.split('.')[1];

                  if (f !== undefined) {
                    fs.readdir(`${src}\\${temp_subFolderName1}`, (err, files) => {
                      files.forEach(file => {
                        copyFileCheckout(file, `${src}\\${temp_subFolderName1}`, destDir + "\\" + file1, repopath, version);
                      })
                    });
                  } else if (f === undefined) {
                    makeAndCopyCheckout(file, `${src}\\${temp_subFolderName1}`, destDir + "\\" + file1, repopath, version);
                  }
                });
              }
            });
          }
          else {

            fs.readdir(`${src}\\${temp_subFolderName1}`, (err, files) => {
              files.forEach(file => {
                fs.readFile(manifestFilename, function (err, data) {
                  if (err) throw err;

                  if (data.indexOf(src + "\\" + temp_subFolderName1) >= 0) {

                    copyFileCheckout(file, `${src}\\${temp_subFolderName1}`, destDir + "\\" + file1, repopath, version);
                  } else {
                    // manifest file empty folder
                    manifestFile(`${src}`, "Checkout empty folder", "", repopath, version, "", "", "", "");
                  }
                });
              })
            });

          }
        } else {
          let f = file.split('.')[1];


          if (f !== undefined) {
            fs.readdir(`${src}\\${temp_subFolderName1}`, (err, files) => {
              files.forEach(file => {

                copyFileCheckout(file, `${src}\\${temp_subFolderName1}`, destDir + "\\" + file1, repopath, version);
              })
            });
          } else {

            makeAndCopyCheckout(file, `${src}\\${temp_subFolderName1}`, destDir + "\\" + temp_subFolderName1, repopath, version);
          }
        }

      });
    });
  }
};

const copyFileCheckout = (file, src, dir2, repopath, version) => {
  let fs = require('fs');
  let path = require('path');


  //gets file name and adds it to dir2
  let f = path.basename(file, path.extname(file));
  let fnm = f.split('_')[0];

  let filename = fnm + path.extname(file);

  fs.readFile(manifestFilename, function (err, data) {
    if (err) throw err;
    if (data.indexOf(`${src}\\${file}`) >= 0) {
      if (!fs.existsSync(`${dir2}\\${filename}`)) {

        let source = fs.createReadStream(`${src}\\${file}`);
        let dest = fs.createWriteStream(path.resolve(dir2, filename));

        source.pipe(dest); +
          source.on('end', function () { //console.log('Succesfully copied');
          });
        source.on('error', function (err) { //console.log(err);
        });
        manifestFile(`${src}\\${file}`, "Checkout Repo TARGETPATH", "", repopath, version, "", "", "", "");
      }

    }
  });

};

const makeandcopy = (filepath, temp_subFolderName, destDir, targetRepo, version, label1, label2, label3, label4) => {

  fs.readdir(filepath, function (err, files) {   //If empty directory add path in manifest file
    if (!err) {
      if (!files.length) {
        manifestFile(destDir, "commit empty folder", "", targetRepo, version, label1, label2, label3, label4);
        //console.log(`Empty Folder:${filepath}`)
      }
    }
  });

  if (!fs.lstatSync(filepath).isDirectory()) {
    copyFile(filepath, destDir, targetRepo, version, label1, label2, label3, label4);
  }
  else {

    fs.readdir(filepath, (err, files) => {
      files.forEach(file => {

        let temp_subFolderName1 = file;
        if (!fs.existsSync(destDir + "\\" + temp_subFolderName1)) {
          fs.mkdir(destDir + "\\" + temp_subFolderName1, { recursive: false }, (err) => {
            if (err) throw err;
            console.log(err)
            if (!fs.lstatSync(filepath + "\\" + file).isDirectory()) {
              copyFile(filepath + "\\" + file, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4);
            }
            else {
              makeandcopy(filepath + "\\" + file, temp_subFolderName1, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4)
            }
          });
        } else {
          if (!fs.lstatSync(filepath + "\\" + file).isDirectory()) {
            copyFile(filepath + "\\" + file, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4);
          }
          else {
            makeandcopy(filepath + "\\" + file, temp_subFolderName1, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4)
          }
        }

      });
    });

  }
};

const checkDirectory = (filepath, temp_subFolderName, destination, version, label1, label2, label3, label4) => {
  let destDir = destination + "\\" + temp_subFolderName;
  let targetRepo = destination;
  if (!fs.lstatSync(filepath).isDirectory()) {
    let artid = artifactID(filepath);

    copyFile(filepath, destDir, targetRepo, version, label1, label2, label3, label4);
  } else {

    makeandcopy(filepath, temp_subFolderName, destDir, targetRepo, version, label1, label2, label3, label4)

  }

}

const copyFile = (file, dir2, targetRepo, version, label1, label2, label3, label4) => {
  let fs = require('fs');
  let path = require('path');

  //gets file name and adds it to dir2
  let f = path.basename(file, path.extname(file));
  artifactID(file).then((artifactID) => {
    let filename = f + "_" + artifactID + path.extname(file);


    if (!fs.existsSync(`${dir2}\\${filename}`)) {

      let source = fs.createReadStream(file);
      let dest = fs.createWriteStream(path.resolve(dir2, filename));

      source.pipe(dest); +
        source.on('end', function () {
          //console.log('Succesfully copied');
        });
      source.on('error', function (err) { console.log(err); });

    }

    manifestFile(dir2 + "\\" + filename, "commit SOURCEPATH TARGETPATH", artifactID, targetRepo, version, label1, label2, label3, label4);
    //Because we want to all files to be copied in manifest file.Whether content of file is changed or not.
  }, (err) => {
    console.log(err)
  });

};

//--------------------------- manifest file creation------------------------------------------------------
const manifestFile = (filePath, commandLine, fileartifactID, targetRepo, version, label1, label2, label3, label4) => {

  let manifestPath = filePath;

  let command = commandLine;
  let teName = label1 + label2 + label3 + label4;
  let FileDetails_artifactID = fileartifactID; let formattedDate = Date();
  let fileName = "";
  if (label1 !== "") {
    fileName = 'manifest-' + label1 + 'name';
  } else if (label2 !== "") {
    fileName = 'manifest-' + label2 + 'name';
  } else if (label3 !== "") {
    fileName = 'manifest-' + label3 + 'name';
  } else if (label4 !== "") {
    fileName = 'manifest-' + label4 + 'name';
  }
  console.log(fileName + "=---" + version);
  let buffer = "\r\ncommand : " + command + "\r\nfile particulars :" + FileDetails_artifactID +

    "\r\nTimeStamp:" + formattedDate + "\r\nFilePath: " + manifestPath + "\r\n/////////////////////////////////////////////////////////////////////";

  if (label1 !== null || label2 !== null || label3 !== null || label4 !== null) {
    if (!fs.existsSync(`${targetRepo}\\Manifest\\${fileName}.txt`)) {

      fs.writeFileSync(`${targetRepo}\\Manifest\\${fileName}.txt`, buffer, function (err) {
        if (err) throw (err);
      });
      let bufferindex = "";
      if (label1 !== "") {
        bufferindex = bufferindex + "\r\n" + fileName + ":" + label1;
      } if (label2 !== "") {
        bufferindex = bufferindex + "\r\n" + fileName + ":" + label2;
      } if (label3 !== "") {
        bufferindex = bufferindex + "\r\n" + fileName + ":" + label3;
      } if (label4 !== "") {
        bufferindex = bufferindex + "\r\n" + fileName + ":" + label4;
      }

      bufferindex = bufferindex + "\r\n";

      fs.appendFile(`${targetRepo}\\Manifest\\ManifestIndex.txt`, bufferindex, function (err) {
        if (err) throw err;
      });

    } else {
      fs.appendFile(`${targetRepo}\\Manifest\\${version}`, buffer, function (err) {
        if (err) throw err;
      })
    }
  } else {
    fs.appendFile(`${targetRepo}\\Manifest\\${version}`, buffer, function (err) {
      if (err) throw err;
    })
  }

};


module.exports = {
  commitProject
}
