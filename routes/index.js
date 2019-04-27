//Contain all API required in system(create repo,push files and it's changes)
/*@author
Aanchal Tandel (aanchalmanharbhai.tandel@student.csulb.edu)
Krishna Desai (krishna.desai@student.csulb.edu)
Nithin Reddy Allala (nithinreddy.allala@student.csulb.edu)
Priya M Joseph (priya.medackeljoseph@student.csulb.edu)
Sujata Patil (sujata.patil@student.csulb.edu
)*/

let helper = require('../helper/commonMD');
let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
var readlines = require('n-readlines');
let manifestFilename = "";


//API
router.get('/', function (req, res) {
  res.render('index', {
    title: ''
  });
});

//--------------------------- for creating the project structure------------------------------
router.get('/create', function (req, res) {
  res.render('create', {
    title: ''
  });
});
//--------------------------- for commit------------------------------
router.get('/commit', function (req, res) {
  res.render('commit', {
    title: ''
  });
});
//-------------------------- for checkin----------------------------------
router.get('/checkin', function (req, res) {
  res.render('checkin', {
    title: ''
  });
});
//-------------------------- for checkout-----------------------------------------
router.get('/checkout', function (req, res) {
  res.render('checkout', {
    title: ''
  });
});
// --------------------------------manifest file listing-------------------------
router.post('/viewprojects', function (req, res) {

  //res.send('{"success" : "Updated Successfully", "status" : 200}');

});
// --------------------------------REpository creation ----------------------------------------
router.post('/createRepo', function (req, res) {
  if (!fs.existsSync(req.body.path + `\\${req.body.name}`))
    fs.mkdir(req.body.path + `\\${req.body.name}`, { recursive: true }, (err) => {
      if (err) throw err;
      res.end('{"success" : "Repository created", "status" : 200}');
    });
  else
    if (req.body.path !== undefined && req.body.name !== undefined) {
      res.end('{"success" : "Repository with same name already exists!", "status" : 200}');
    } else {
      res.end('{"success" : "Please enter the field!", "status" : 200}');
    }

});
// --------------------------------Commit button click ----------------------------------------
router.post('/commit', function (req, res) {

  fs.readdir(req.body.destination, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      if (!files.length) {
        // directory appears to be empty
        console.log("SRC:" + req.body.src)
        fs.readdir(req.body.src, (err, files) => {
          files.forEach(file => {
            fs.mkdir(`${req.body.destination}\\${file}`, { recursive: true }, (err) => {
              if (err) throw err;
              if (file.toString() === files[files.length - 1].toString()) {
                fs.mkdir(`${req.body.destination}\\Manifest`, { recursive: true }, (err) => {
                  if (err) throw err;
                });
                helper.commitProject(req.body.src, req.body.destination, 'CreateRepoManifest.txt').then(() => {
                  //version is to specify manifest file name for project version
                  res.end('{"success" : "Updated Successfully", "status" : 200}');

                });
              }
            });
          });
        });
      } else {
        helper.commitProject(req.body.src, req.body.destination, 'Version2.txt').then(() => {
          //version is to specify manifest file name for project version
          res.end('{"success" : "Updated Successfully", "status" : 200}');
        });
      }
    }
  });
});

// --------------------------------Chekin button click---------------------------------------
router.post('/checkin', function (req, res) {

  let label1 = req.body.l1;
  let label2 = req.body.l2;
  let label3 = req.body.l3;
  let label4 = req.body.l4;
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

  // manifestFile(spath,"checkin","","",label1,label2,label3,label4);
  fs.readdir(req.body.trgt, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      if (!files.length) {
        // directory appears to be empty
        console.log("SRC:" + req.body.srcpath)
        fs.readdir(req.body.srcpath, (err, files) => {
          files.forEach(file => {
            fs.mkdir(`${req.body.trgt}\\${file}`, { recursive: true }, (err) => {
              if (err) throw err;
              if (file.toString() === files[files.length - 1].toString()) {
                fs.mkdir(`${req.body.trgt}\\Manifest`, { recursive: true }, (err) => {
                  if (err) throw err;
                });
                console.log(fileName);
                helper.commitProject(req.body.srcpath, req.body.trgt, fileName + '.txt', label1, label2, label3, label4).then(() => {
                  //version is to specify manifest file name for project version
                  res.end('{"success" : "Updated Successfully", "status" : 200}');

                });
              }
            });
          });
        });
      } else {
        helper.commitProject(req.body.srcpath, req.body.trgt, fileName + ".txt", label1, label2, label3, label4).then(() => {
          //version is to specify manifest file name for project version
          res.end('{"success" : "Updated Successfully", "status" : 200}');
        });
      }
    }
  });
  // console.log(label1);

});

// --------------------------------checkout button click ----------------------------------------
router.post('/checkout', function (req, res) {

  if (req.body.path === "") {
    //console.log(req.body.repo);
    let ph = "";

    let path = req.body.repo;
    var liner = new readlines(`${req.body.repo}\\Manifest\\ManifestIndex.txt`);

    var next;
    let lineNumber = 0;

    ph = ph + "<tr>";
    ph = ph + "<th>FileName</th>";
    ph = ph + "<th>Label</th>";
    ph = ph + "</tr>";
    while (next = liner.next()) {
      console.log(next.toString());
      if (next.toString() != "") {
        if (next.toString('ascii').split(":")[1] != "") {
          ph = ph + "<tr>";
          ph = ph + "<td>" + next.toString('ascii').split(":")[0] + "</td>";
          if (next.toString('ascii').split(":")[1] !== undefined)
            ph = ph + "<td>" + next.toString('ascii').split(":")[1] + "</td>";
          ph = ph + "</tr>";
        }
      }

    }
    //  console.log(ph);
    res.send({ "success": ph });
  } else {
    if (!fs.existsSync(req.body.path + `\\${req.body.name}`)) {
      fs.mkdir(req.body.path + `\\${req.body.name}`, { recursive: true }, (err) => {
        if (err) throw err;

        const file_filter = req.body.version;
        var liner = new readlines(`${req.body.repo}\\Manifest\\ManifestIndex.txt`);
        var repopath = req.body.repo;
        var next;
        const regex = new RegExp(file_filter);
        let version = req.body.name + "_CheckoutManifest" + req.body.version + ".txt";
        let lineNumber = 0;
        while (next = liner.next()) {
          // edges.push(next.toString('ascii').split(' '));


          if (regex.test(next.toString('ascii').split(':')[1])) {
            manifestFilename = `${req.body.repo}\\Manifest\\${next.toString('ascii').split(':')[0]}.txt`;
          }
          //console.log('Line ' + lineNumber + ': ' + next.toString('ascii'));
          lineNumber++;
        }

        let destination = `${req.body.path}\\${req.body.name}`;
        fs.readdir(req.body.path + `\\${req.body.name}`, function (err, files) {
          if (err) {
            console.log(err)
          } else {
            if (!files.length) {

              fs.readdir(repopath, (err, files) => {
                files.forEach(file => {

                  let f = file.split('.')[1];
                  //console.log(f);
                  if (f === undefined && file !== 'Manifest') {
                    // console.log(file);
                    fs.mkdir(`${destination}\\${file}`, { recursive: true }, (err) => {
                      if (err) throw err;
                      fs.readFile(manifestFilename, function (err, data) {
                        if (err) throw err;
                        if (data.indexOf(`${repopath}\\${file}`) >= 0) {
                          makeAndCopyCheckout(file, `${repopath}\\${file}`, destination, repopath, version);
                        } else {
                          manifestFile(`${repopath}\\${file}`, "Checkout empty folder", "", repopath, version, "", "", "", "");
                        }
                      });

                    });
                  } else if (file !== 'Manifest') {

                    fs.readdir(`${repopath}\\${file}`, (err, files) => {
                      files.forEach(file1 => {

                        copyFileCheckout(file1, `${repopath}\\${file}`, destination, repopath, version);
                      })
                    });
                  }
                });
              });
            }
          }
        });


        res.end('{"success" : "Updated Successfully", "status" : 200}');


      });
    }
    else {
      if (req.body.path !== undefined && req.body.name !== undefined) {
        res.end('{"success" : "Folder with same name already exists!", "status" : 200}');
      } else {
        res.end('{"success" : "Please enter the field!", "status" : 200}');
      }
    }
  }

});


//-----------------------------Functions--------------------------------------------------------
/*const commitProject = (src, destination, version, label1, label2, label3, label4) => {

  return new Promise(resolve => {
    if (fs.existsSync(destination))
      fs.readdir(src, (err, files) => {

        files.forEach(file => {
          //console.log(file);
          let temp_subFolderName = file;
          let destDir = `${destination}\\${temp_subFolderName}`;
          if (fs.existsSync(destDir))
            checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4)
          else
            fs.mkdir(destDir, { recursive: true }, (err) => {
              if (err) throw err;
              //  console.log(temp_subFolderName + "Created")
              checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4)
            });
        });
        resolve("Files Copied");
      });
    else
      console.log("Sorry! Repository with same name already exists");
  })

};*/

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
  // console.log(`${src}\\${file}`);

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
    // console.log(`artifcact id: ${artid}`);
    copyFile(filepath, destDir, targetRepo, version, label1, label2, label3, label4);
  } else {
    // console.log(filepath+"---sdnjs")
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
    // console.log(`artifactID: ${artifactID}`);

    if (!fs.existsSync(`${dir2}\\${filename}`)) {
      console.log(`${dir2}\\${filename}`);
      let source = fs.createReadStream(file);
      let dest = fs.createWriteStream(path.resolve(dir2, filename));

      source.pipe(dest); +
        source.on('end', function () { console.log('Succesfully copied'); });
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

  let buffer = "\r\ncommand : " + command + "\r\nfile particulars :" + FileDetails_artifactID +

    "\r\nTimeStamp:" + formattedDate + "\r\nFilePath: " + manifestPath + "\r\n/////////////////////////////////////////////////////////////////////";


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
};


module.exports = router;
