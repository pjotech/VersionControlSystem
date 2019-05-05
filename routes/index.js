//Contain all API required in system(create repo,push files and it's changes)
/*@author
Aanchal Tandel (aanchalmanharbhai.tandel@student.csulb.edu)
Krishna Desai (krishna.desai@student.csulb.edu)
Heena Pallan(HeenaJafarali.Pallan@student.csulb.edu)
Priya M Joseph (priya.medackeljoseph@student.csulb.edu)
Sujata Patil (sujata.patil@student.csulb.edu
)*/

let helper = require('../helper/commonMD');
let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
let readlines = require('n-readlines');
let manifestFilename = "";
let checkOutTemp = "";
let _ = require('lodash');
let arr1 = [];
let arr2 = [];

//API
router.get('/', function (req, res) {
  res.render('create', {
    title: ''
  });
  //commonAncestor('a121','a1221','C:\\Users\\aanch\\Documents\\ASE-543\\TestRepo');
  commonAncestor('a111','a12','C:\\Users\\aanch\\Documents\\ASE-543\\TestRepo');
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
//-------------------------- for mergeout-----------------------------------------
router.get('/mergeout', function (req, res) {
  res.render('mergeout', {
    title: ''
  });
});
//-------------------------- for mergein-----------------------------------------
router.get('/mergein', function (req, res) {
  res.render('mergein', {
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
        // console.log("SRC:" + req.body.src)
        fs.readdir(req.body.src, (err, files) => {
          files.forEach(file => {
            fs.mkdir(`${req.body.destination}\\${file}`, { recursive: true }, (err) => {
              if (err) throw err;
              if (file.toString() === files[files.length - 1].toString()) {
                fs.mkdir(`${req.body.destination}\\Manifest`, { recursive: true }, (err) => {
                  if (err) throw err;
                });
                commitProject(req.body.src, req.body.destination, 'CreateRepoManifest.txt',isCheckIn).then(() => {
                  //version is to specify manifest file name for project version
                  res.end('{"success" : "Updated Successfully", "status" : 200}');

                });
              }
            });
          });
        });
      } else {
        commitProject(req.body.src, req.body.destination, 'Version2.txt',isCheckIn).then(() => {
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
  let isCheckIn =true;
  checkOutTemp = path.basename(req.body.srcpath); //To identify checkout file

  if (label1 !== "") {
    fileName = `manifest_${checkOutTemp}_${label1}name`;
  } else if (label2 !== "") {
    fileName = `manifest_${checkOutTemp}_${label2}name`;
  } else if (label3 !== "") {
    fileName = `manifest_${checkOutTemp}_${label3}name`;
  } else if (label4 !== "") {
    fileName = `manifest_${checkOutTemp}_${label4}name`;
  }

  // manifestFile(spath,"checkin","","",label1,label2,label3,label4);
  fs.readdir(req.body.trgt, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      if (!files.length) {
        // directory appears to be empty
        //console.log("SRC:" + req.body.srcpath)
        fs.readdir(req.body.srcpath, (err, files) => {
          files.forEach(file => {
            fs.mkdir(`${req.body.trgt}\\${file}`, { recursive: true }, (err) => {
              if (err) throw err;
              if (file.toString() === files[files.length - 1].toString()) {
                fs.mkdir(`${req.body.trgt}\\Manifest`, { recursive: true }, (err) => {
                  if (err) throw err;
                });
                console.log(fileName);
                commitProject(req.body.srcpath, req.body.trgt, fileName + '.txt', label1, label2, label3, label4,isCheckIn).then(() => {
                  //version is to specify manifest file name for project version
                  res.end('{"success" : "Updated Successfully", "status" : 200}');

                });
              }
            });
          });
        });
      } else {
        commitProject(req.body.srcpath, req.body.trgt, fileName + ".txt", label1, label2, label3, label4,isCheckIn).then(() => {
          //version is to specify manifest file name for project version
          res.end('{"success" : "Updated Successfully", "status" : 200}');
        });
      }
    }
  });


});

// --------------------------------checkout button click ----------------------------------------
router.post('/checkout', function (req, res) {

  if (req.body.path === "") {

    let ph = "";

    let path = req.body.repo;
    var liner = new readlines(`${req.body.repo}\\Manifest\\ManifestIndex.txt`);

    var next;
    let lineNumber = 0;

    ph = ph + "<tr>";
    ph = ph + "<th>FileName</th>";
    ph = ph + "<th>Version(Manifest Label)</th>";
    ph = ph + "</tr>";
    while (next = liner.next()) {
    var line = next.toString('ascii').replace(/(\r\n|\n|\r)/gm,"");
      if (line.split(":")[0] != "") {
        if (line.split(":")[1] != "") {
          ph = ph + "<tr>";
          ph = ph + "<td>" + line.split(":")[0] + "</td>";
          if (line.split(":")[1] !== undefined)
            ph = ph + "<td>" + line.split(":")[1] + "</td>";
          ph = ph + "</tr>";
        }
      }else{
        ph =ph;
      }

    }

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
        let version = req.body.name + "_CheckoutManifest_" + req.body.version + ".txt";
        let lineNumber = 0;
        while (next = liner.next()) {
          
          if (regex.test(next.toString('ascii').split(':')[1])) {
            manifestFilename = `${req.body.repo}\\Manifest\\${next.toString('ascii').split(':')[0]}.txt`;
          }

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

                  if (f === undefined && file !== 'Manifest') {

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
        res.end('{"success" : "Snapshot created", "status" : 200}');


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

// Merge-In functionality
router.post('/mergein', function (req, res) {
  console.log("In mergein");
  let label1 = req.body.l1;
  let label2 = req.body.l2;
  let label3 = req.body.l3;
  let label4 = req.body.l4;
  let checkOutTemp = "MergeIn"
  let fileName = "";
  let isCheckIn =false;
  if (label1 !== "") {
     fileName = `manifest_${checkOutTemp}_${label1}name`;
   } else if (label2 !== "") {
     fileName = `manifest_${checkOutTemp}_${label2}name`;
   } else if (label3 !== "") {
     fileName = `manifest_${checkOutTemp}_${label3}name`;
   } else if (label4 !== "") {
     fileName = `manifest_${checkOutTemp}_${label4}name`;
   }

  fs.readdir(req.body.trgt, function (err, files) {
    if (err) {
      console.log(err)
    } else {
      if (!files.length) {
        // directory appears to be empty
        console.log(files);
        console.log("SRC:" + req.body.srcpath);
        fs.readdir(req.body.srcpath, (err, files) => {
          files.forEach(file => {
            fs.mkdir(`${req.body.trgt}\\${file}`, { recursive: true }, (err) => {
              if (err) throw err;
              if (file.toString() === files[files.length - 1].toString()) {
                fs.mkdir(`${req.body.trgt}\\Manifest`, { recursive: true }, (err) => {
                  if (err) throw err;
                });
                                  console.log(fileName);
                commitProject(req.body.srcpath, req.body.trgt, fileName + '.txt', label1, label2, label3, label4,isCheckIn).then(() => {
                  //version is to specify manifest file name for project version
                  res.end('{"success" : "Updated Successfully", "status" : 200}');

                });
              }
            });
          });
        });
      } else {
        commitProject(req.body.srcpath, req.body.trgt, fileName + ".txt", label1, label2, label3, label4,isCheckIn).then(() => {
          //version is to specify manifest file name for project version
          res.end('{"success" : "Updated Successfully", "status" : 200}');
        });
      }
    }
  });
  // console.log(label1);

});
// --------------------------------merge out click--------------------------------------
// router.post('/mergeout', function (req, res) {
//   console.log("merge out------------------------------")
//   console.log(req.body.srcpath)
//   console.log(req.body.lbl1)
//   console.log(req.body.repopath)
//   console.log(req.body.trgt)
//   fs.readdir(req.body.srcpath, function (err, files) {
//     let searchlabel = req.body.lbl1;
//     let repo = req.body.repopath;
//     let target = req.body.trgt;
//     let sourcepath = req.body.srcpath;
//     let manifestIndexpath = `${repo}\\Manifest\\ManifestIndex.txt`;
//     let manifestpath = `${repo}\\Manifest`;
//     let targetmanifestName = "";
//     fs.readFile(manifestIndexpath, function (err, data) {
//       if (err) {console.log(err)}
//       if (data.indexOf(`${searchlabel}`) >= 0) {
//           let dataArray = data.toString().split(/[ :\n\s+]+/) // convert file data in an array
//           const searchKeyword = `${searchlabel}`; // we are looking for a line, contains, key word 'user1' in the file
//           let lastIndex = -1; // let say, we have not found the keyword
//           console.log("dataArray"+"   " +dataArray)
//           for (let index=0; index<dataArray.length; index++) {
//               if (dataArray[index]== searchKeyword){
//                   // check if a line contains the  keyword
//               targetmanifestName = dataArray[index - 1];
//               lastIndex = index; // found a line includes a  keyword
//               break;
//               }
//           }
//       console.log("----------------------inside manifets index file-----------------------")
//       console.log(targetmanifestName);
//       }  else{}
// //    console.log("----------------------inside readfile-----------------------");console.log(manifestName);
//       targetmanifestName = `${manifestpath}\\`+targetmanifestName+`.txt`;
//       console.log(targetmanifestName);
//       fs.readFile(targetmanifestName, function (err, data) {
//         if (err) {console.log(err)}
//         let dataArray2 = data.toString().split(/[ =\n\s+]+/);
//         console.log("----------------------inside manifets  file-----------------------")
// //                     console.log("dataArray2---"+dataArray2)
//         let ManifestArtifactArray = "";let filePathManifestArray = "";let fileArray = "";
//         for (let index=0; index<dataArray2.length; index++){
//            if (dataArray2[index]== "particulars"){
//               ManifestArtifactArray = ManifestArtifactArray +" "+dataArray2[index + 1];}
//            else if (dataArray2[index]== "FilePath"){
//               filePathManifestArray = filePathManifestArray +" "+dataArray2[index + 1];
//               console.log("filePathManifestArray ----"+filePathManifestArray)
//               let choosedFileName = dataArray2[index + 1].substring(dataArray2[index + 1].lastIndexOf("\\") + 1, dataArray2[index + 1].length)
//               let temp = choosedFileName.substring(0,choosedFileName.lastIndexOf("_"))+"."+choosedFileName.substring(choosedFileName.lastIndexOf(".")+1,choosedFileName.length)
//               console.log("temp--"+temp)
//               fileArray = fileArray + " " + temp}
//         }
//         console.log("fileArray--"+fileArray)
// //                   let repo_sourcePath = `${repo}`;
// //                   console.log("To read repo")
// //                   console.log(repo_sourcePath)
// //                      fs.readdir(repo_sourcePath, function (err, data) { if (err) {console.log(err)}
//         files.forEach(file => {
//               let path = require('path');

//   //gets file name and adds it to dir2
//               console.log("file"+file)
//               console.log(`${sourcepath}`+"\\"+file)
//                               // console.log(__dirname  + file)
// //                               if(fileArray.indexOf(file)){
// //                                  if (err) {console.log(err)}
// //                                   console.log("file matched");
// //                                   console.log(`${repo_sourcePath}\\`+file);
// //                                   console.log(dataManifestArray)
//                                      // console.log(artifactID(`${sourcepath}`+"\\"+file));
//               artifactID(`${sourcepath}`+"\\"+file).then((artifactID) => {
//               console.log("ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt")
//               if(ManifestArtifactArray.indexOf(artifactID) >= 0){
//                  console.log(file+"skip as source and target is same")}
//               else{
//                  let source_fileName = file;
//                  console.log(file+"is the source for Create MR and MT and grandma files")
//                  fs.readdir(req.body.trgt, function (err, files) {
//                    let target_fileName = file;
//                    console.log(target_fileName+"Read target directory")
//                    if(source_fileName == target_fileName){
//                      console.log("To copy--------------------")
//                      let f = path.basename(source_fileName, path.extname(source_fileName))+"_MR";console.log(f)
//                      let fT = path.basename(target_fileName, path.extname(target_fileName))+"_MT";
//                      let MR_file = f + path.extname(source_fileName);
//                      let MT_file = fT + path.extname(target_fileName);

//                      fs.access(`${target}`, (err) => {
//                         if(err){  // console.log(err)
//                             fs.mkdirSync(`${target}`);
//                          }
//                          copyFilewe(`${target}\\`+target_fileName, path.join(`${target}`, `${MT_file}`));
//                          copyFilewe(`${sourcepath}\\`+source_fileName, path.join(`${target}`, `${MR_file}`));
//                      });
//                    }
//                  });
//                }
//          }, (err) => {console.log(err)});
//        });
//       });
//     });
// //         }}
//   });

//   res.end('{"success" : "Merge out is done Successfully.Please proceed with merge in", "status" : 200}');
//   });

function copyFilewe(src, dest) {
  let readStream = fs.createReadStream(src);
  readStream.once('error', (err) => { console.log(err);});
  readStream.once('end', () => {console.log('done copying');});
  readStream.pipe(fs.createWriteStream(dest));
  }

//-----------------------------Functions--------------------------------------------------------
const commitProject = (src, destination, version, label1, label2, label3, label4,isCheckIn) => {

  return new Promise(resolve => {
    if (fs.existsSync(destination))
      fs.readdir(src, (err, files) => {

        files.forEach(file => {
          //console.log(file);
          let temp_subFolderName = file;
          let destDir = `${destination}\\${temp_subFolderName}`;
          if (fs.existsSync(destDir))
            checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4,isCheckIn)
          else
            fs.mkdir(destDir, { recursive: true }, (err) => {
              if (err) throw err;
              //  console.log(temp_subFolderName + "Created")
              checkDirectory(`${src}\\${file}`, file, destination, version, label1, label2, label3, label4,isCheckIn)
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

//-------------------- checkout functions ------------

const makeAndCopyCheckout = (file1, src, destDir, repopath, version) => {
  let f = file1.split('.')[1];

  if (!fs.lstatSync(destDir + "\\" + file1).isDirectory()) {

    if (f !== undefined)

      copyFileCheckout(file1, src, destDir, repopath, version);
  }
  else {

    fs.readdir(src, (err, files) => {
      console.log("files length" + files.length);

      if (files.length > 0) {
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
      } else {

        manifestFile(`${src}`, "Checkout empty folder", "", repopath, version, "", "", "", "");
      }

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

//---------------- checkin functions ----------------------
const makeandcopy = (filepath, temp_subFolderName, destDir, targetRepo, version, label1, label2, label3, label4,isCheckIn) => {
checkOutTemp = (isCheckIn) ? "" : "MergeIn"
  fs.readdir(filepath, function (err, files) {   //If empty directory add path in manifest file
    if (!err) {
      if (!files.length) {
        manifestFile(destDir, (isCheckIn) ? "commit empty folder" : "Mergin empty folder", "", targetRepo, version, label1, label2, label3, label4);
        //console.log(`Empty Folder:${filepath}`)
      }
    }
  });

  if (!fs.lstatSync(filepath).isDirectory()) {
    copyFile(filepath, destDir, targetRepo, version, label1, label2, label3, label4,isCheckIn);
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
              copyFile(filepath + "\\" + file, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4,isCheckIn);
            }
            else {
              makeandcopy(filepath + "\\" + file, temp_subFolderName1, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4,isCheckIn)
            }
          });
        } else {
          if (!fs.lstatSync(filepath + "\\" + file).isDirectory()) {
            copyFile(filepath + "\\" + file, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4,isCheckIn);
          }
          else {
            makeandcopy(filepath + "\\" + file, temp_subFolderName1, destDir + "\\" + temp_subFolderName1, targetRepo, version, label1, label2, label3, label4,isCheckIn)
          }
        }

      });
      
    });

  }
};

const checkDirectory = (filepath, temp_subFolderName, destination, version, label1, label2, label3, label4,isCheckIn) => {
  let destDir = destination + "\\" + temp_subFolderName;
  let targetRepo = destination;
  if (!fs.lstatSync(filepath).isDirectory()) {
    let artid = artifactID(filepath);

    copyFile(filepath, destDir, targetRepo, version, label1, label2, label3, label4,isCheckIn);
  } else {

    makeandcopy(filepath, temp_subFolderName, destDir, targetRepo, version, label1, label2, label3, label4,isCheckIn)

  }

}

const copyFile = (file, dir2, targetRepo, version, label1, label2, label3, label4,isCheckIn) => {
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
    console.log("isCheckIn");
    console.log(isCheckIn);
    manifestFile(dir2 + "\\" + filename,(isCheckIn) ? "commit SOURCEPATH TARGETPATH" :"Mergein SOURCEPATH TARGETPATH", artifactID, targetRepo, version, label1, label2, label3, label4);
    //Because we want to all files to be copied in manifest file.Whether content of file is changed or not.
  }, (err) => {
    console.log(err)
  });

};

//--------------------------- manifest file creation------------------------------------------------------
const manifestFile = (filePath, commandLine, fileartifactID, targetRepo, version, label1, label2, label3, label4, grandma) => {
  grandma = typeof grandma !== 'undefined' ? grandma :"";
  let manifestPath = filePath;

  let command = commandLine;
  let teName = label1 + label2 + label3 + label4;
  let FileDetails_artifactID = fileartifactID; let formattedDate = Date();
  let fileName = "";

  if (label1 !== "") {
    fileName = `manifest_${checkOutTemp}_${label1}name`;
  } else if (label2 !== "") {
    fileName = `manifest_${checkOutTemp}_${label2}name`;
  } else if (label3 !== "") {
    fileName = `manifest_${checkOutTemp}_${label3}name`;
  } else if (label4 !== "") {
    fileName = `manifest_${checkOutTemp}_${label4}name`;
  }
  let buffer = "";

  if(grandma != ""){
    fileName = `Mergeout_manifest_${grandma.toString().replace(".txt","")}`;
     buffer = "\r\ncommand = " + command + "\r\nfile particulars =" + FileDetails_artifactID +
      "\r\nTimeStamp =" + formattedDate + "\r\nFilePath= " + manifestPath +  "\r\ngrandmaSnapshot = " + grandma + "\r\n/////////////////////////////////////////////////////////////////////";
  }
  else {
     buffer = "\r\ncommand = " + command + "\r\nfile particulars =" + FileDetails_artifactID +
      "\r\nTimeStamp =" + formattedDate + "\r\nFilePath= " + manifestPath + "\r\n/////////////////////////////////////////////////////////////////////";
  }

    if (label1 !== "" || label2 !== "" || label3 !== "" || label4 !== "") {
      if (!fs.existsSync(`${targetRepo}\\Manifest\\${fileName}.txt`)) {
  
        if(fileName !== "" ){
          fs.writeFile(`${targetRepo}\\Manifest\\${fileName}.txt`, buffer, function (err) {
            if (err) {
              return console.log(err);
            }
            
          });
        }
        
        
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
    }else {
      
    fs.appendFile(`${targetRepo}\\Manifest\\${version}`, buffer, function (err) {
      if (err) throw err;
    })
  }
};
//---------------------------------Grandmaa-----------------------------------------------------------------------------------------------------

router.post('/mergeout', function (req, res) {

  if (req.body.srcpath === "") {

    let ph = "";

    let path = req.body.repopath;
    var liner = new readlines(`${req.body.repopath}\\Manifest\\ManifestIndex.txt`);

    var next;
    let lineNumber = 0;

    ph = ph + "<tr>";
    ph = ph + "<th>FileName</th>";
    ph = ph + "<th>Version(Manifest Label)</th>";
    ph = ph + "</tr>";
    while (next = liner.next()) {
    var line = next.toString('ascii').replace(/(\r\n|\n|\r)/gm,"");
      if (line.split(":")[0] != "") {
        if (line.split(":")[1] != "") {
          ph = ph + "<tr>";
          ph = ph + "<td>" + line.split(":")[0] + "</td>";
          if (line.split(":")[1] !== undefined)
            ph = ph + "<td>" + line.split(":")[1] + "</td>";
          ph = ph + "</tr>";
        }
      }else{
        ph =ph;
      }

    }

    res.send({ "success": ph });
  } else {

  fs.readdir(req.body.srcpath, function (err, files) {
       console.log(`-----------srclable:${req.body.lbl2}`)

              let searchlabel = req.body.lbl1;
              let sourcelabel = req.body.lbl2;
              let repo = req.body.repopath;
              let target = req.body.trgt;
              let sourcepath = req.body.srcpath;
              console.log(repo);console.log(target);console.log(sourcepath);

              let manifestIndexpath = `${repo}\\Manifest\\ManifestIndex.txt`;
              let manifestpath = `${repo}\\Manifest`;
              let targetmanifestName = "";
                    fs.readFile(manifestIndexpath, function (err, data) {   if (err) {console.log(err)}
                     if (data.indexOf(`${searchlabel}`) >= 0) {
                         let dataArray = data.toString().split(/[ :\n\s+]+/) // convert file data in an array
                             const searchKeyword = `${searchlabel}`; // we are looking for a line, contains, key word 'user1' in the file
                             let lastIndex = -1; // let say, we have not found the keyword
                              for (let index=0; index<dataArray.length; index++) {
                                   if (dataArray[index]== searchKeyword){
                                       // check if a line contains the  keyword
                                       targetmanifestName = dataArray[index - 1];
                                       lastIndex = index; // found a line includes a  keyword
                                       break;
                                     }
                               }
                         }  else{console.log("label can not be found")}
                     targetmanifestName = `${manifestpath}\\`+targetmanifestName+`.txt`;//gives the manifest path
                  console.log(targetmanifestName);
               fs.readFile(targetmanifestName, function (err, data) {   if (err) {console.log(err)}//read manifest file
                   let dataArray2 = data.toString().split(/[ =\n\s+]+/);
                   let ManifestArtifactArray = "";let filePathManifestArray = "";let fileArray = "";
                   for (let index=0; index<dataArray2.length; index++){ //read manifest to get the artifact
                       if (dataArray2[index]== "particulars"){
                           ManifestArtifactArray = ManifestArtifactArray +" "+dataArray2[index + 1];
                       }
                        else if (dataArray2[index]== "FilePath"){//get the file name , filepath
                           filePathManifestArray = filePathManifestArray +" "+dataArray2[index + 1];
                           // console.log("filePathManifestArray ----"+filePathManifestArray)
                           let choosedFileName = dataArray2[index + 1].substring(dataArray2[index + 1].lastIndexOf("\\") + 1, dataArray2[index + 1].length)
                           let temp = choosedFileName.substring(0,choosedFileName.lastIndexOf("_"))+"."+choosedFileName.substring(choosedFileName.lastIndexOf(".")+1,choosedFileName.length)
                           // console.log("temp--"+temp)
                           fileArray = fileArray + " " + temp
                           console.log("temp--"+fileArray)
                       }
                   }
                   console.log("-----------------------------------------")

                   //----------read source files-----------------

                     console.log(`Files in side the read direct-------------------${sourcepath}`);
        files.forEach(file => {
          console.log(`Files -------------------${sourcepath}\\${file}`);
           if (fs.lstatSync(`${sourcepath}\\${file}`).isDirectory()) {//checking if a directory---------------
          //  sourcepath = `${sourcepath}`+"\\"+file; 
          //  target = `${target}`+"\\"+file;
             fs.readdir(`${sourcepath}`+"\\"+file, function (err, files) {
               let localsrc = `${sourcepath}`+"\\"+file;
               let localtarget =  `${target}`+"\\"+file;
                files.forEach(file => {
                 createMRandMT(`${localsrc}`,`${localtarget}`, file, ManifestArtifactArray, fileArray, req.body.trgt,sourcelabel,searchlabel, repo);
                });
             });
           }
         else {///not a directory but a file
                createMRandMT(`${sourcepath}`,`${target}`,file, ManifestArtifactArray, fileArray, req.body.trgt, sourcelabel,searchlabel, repo)
              }
                          });
                    });
               });
     });
       res.send('{"success" : "Merge out is done Successfully.Please proceed with merge in", "status" : 200}');
       res.end('{"success" : "Snapshot created", "status" : 200}');
    }
      });

 //-------------------   Create MR ,  MT , MG files on taret while merge out------------------------------
 function createMRandMT(source_path, tar_get, file,ManifestArtifactArray, fileArray,targetroot, sourcelabel,searchlabel,repo) {
    let path = require('path');  //gets file name and adds it to dir2
    console.log("after directory cheking-------------------"+`${source_path}`)
   console.log(ManifestArtifactArray);
   // console.log(target);
   //   console.log(file);console.log(ManifestArtifactArray);

   console.log("destination:"+`${tar_get}`+"\\"+file)
   console.log("------------------"+`${tar_get}`)
    artifactID(`${source_path}`+"\\"+file).then((artifactID) => {
      console.log("--------------In Artifact IDDDDDDDDDDIn -------------------")
      console.log(artifactID);console.log(fileArray);console.log(file)
     if(ManifestArtifactArray.indexOf(artifactID) >= 0 && fileArray.indexOf(file) >=0){
        console.log(file+"skip as source and target is same")
      }
     else if(ManifestArtifactArray.indexOf(artifactID) < 0 && fileArray.indexOf(file) >=0){
        let source_fileName = file;
                                // fs.readdir(targetroot, function (err, files) {
        let target_fileName = file;
        console.log(target_fileName+"Read target directory")
        let f = path.basename(source_fileName, path.extname(source_fileName))+"_MR";console.log(f)
        let fT = path.basename(target_fileName, path.extname(target_fileName))+"_MT";
        let MR_file = f + path.extname(source_fileName);let MT_file = fT + path.extname(target_fileName);

         console.log("traget of MR ----"+`${tar_get}`, `${MR_file}`);
         console.log("source of MR ----"+`${source_path}\\`+source_fileName);
         //----------Get Grandma here--------------------

         console.log(`sourcelbl:${sourcelabel},searchlabel:${searchlabel}`);
         let ggLOop = "";
         commonAncestor(sourcelabel,searchlabel,repo).then((commonAncestor)=>{
       //  commonAncestor('s2','p3','C:\\Users\\aanch\\Documents\\ASE-543\\TestRepo').then((res)=>{
           let grandma = commonAncestor;
             return findnextManifest(grandma,repo).then((file1)=>{
               console.log(`grandma:${file1}`);
               let grand_manifestpath = `${repo}\\Manifest\\${file1}`;
               fs.readFile(grand_manifestpath, function (err, data) {   if (err) {console.log(err)}//read manifest file
                   let dataArray2 = data.toString().split(/[ =\n\s+]+/);
                   let filePathManifestArray = "";let fileArray = "";
                   console.log(`grandmani:${dataArray2}`);
                   for (let index=0; index<dataArray2.length; index++){ //read manifest to get the artifact
                       if (dataArray2[index].indexOf(file) >= 0){
                           ggLOop = dataArray2[index];
                           console.log(ggLOop);
                       }
                    }
             let fGrandmaMG = path.basename(file, path.extname(file))+"_MG";console.log(f)
             let MG_file = fGrandmaMG + path.extname(file);
             fs.access(`${tar_get}`, (err) => {
               if(err){  // console.log(err)
                   fs.mkdirSync(`${target}`);
                       }
                       copyFilewe(`${tar_get}\\`+target_fileName, path.join(`${tar_get}`, `${MT_file}`));
                       copyFilewe(`${source_path}\\`+source_fileName, path.join(`${tar_get}`, `${MR_file}`));
                       copyFilewe(`${ggLOop}`, path.join(`${tar_get}`, `${MG_file}`));
                    manifestFile(`${source_path}`, "Merge Out", "", `${repo}`, `Mergeout_manifest_${grandma}`, "", "", "", "", grandma.toString().replace(".txt","")) 
              });
             });
             });

         });

        //  console.log("aegfskjffgbbbbbbbbbbbbn"+`${ggLOop}`)
        //  console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"+path.join(`${tar_get}`, `${MG_file}`))
         ///---------------end of grandma-------------------------------------------
              }
    }, (err) => {
      console.log(err)
      });
  }
//  ------------------------------------------aanchal
const findAllAncestor1 = (version1,repoPath) => {
console.log(`In findAllAncestor1:${version1} + ${repoPath}`);
maifest = findManifest(version1,repoPath);
console.log(`manifest:${findManifest(version1,repoPath)}`)
return findAncester(maifest,repoPath).then((file)=>{
console.log(`file1:${file}`)
if(file != "noAncestorFile"){
 return findnextManifest(file,repoPath).then((file1)=>{
   manifestFile1 = file1;
   let namelist = file.split("_");
   let ancestor = namelist[2];
   arr1.push(ancestor);
   //console.log(`arr1:${arr1}`);

   let name = path.basename(manifestFile1.toString(),'.txt');
   let namelist1 = name.split("_");
   let verLabel1 = namelist1[2];
   verLabel1 = verLabel1.replace('name','');
   return findAllAncestor1(verLabel1,repoPath);
 },(error) => {
   console.log(error);
 });
}else{
return ;
}
//resolve(arr1);
});
/*  return new Promise(resolve => {
 return resolve(findAncester(maifest,repoPath).then((file)=>{
   console.log(`file1:${file}`)
   if(file != "nofile"){
     return findnextManifest(file,repoPath).then((file1)=>{
       manifestFile1 = file1;
       let namelist = file.split("_");
       let ancestor = namelist[2];
       arr1.push(ancestor);
       console.log(`arr1:${arr1}`);
       let name = path.basename(manifestFile1.toString(),'.txt');
       let namelist1 = name.split("_");
       let verLabel1 = namelist1[2];
       verLabel1 = verLabel1.replace('name','');
       return resolve(findAllAncestor1(verLabel1,repoPath));
     },(error) => {
       console.log(error);
     });
   }else{
   return resolve(arr1);
   }
   //resolve(arr1);
 }));
})*/
}

const findAllAncestor2 = (version2,repoPath) => {

maifest = findManifest(version2,repoPath);
return findAncester(maifest,repoPath).then((file)=>{
 console.log(`file2:${file}`)
 if(file != "noAncestorFile"){
   return findnextManifest(file,repoPath).then((file2)=>{
     manifestFile2 = file2;
     let namelist = file.split("_");
     let ancestor = namelist[2];
     arr2.push(ancestor);
     //console.log(`arr2:${arr2}`);

     let name = path.basename(manifestFile2.toString(),'.txt');
     let namelist2 = name.split("_");
     let verLabel2 = namelist2[2];
     verLabel2 = verLabel2.replace('name','');
     return findAllAncestor2(verLabel2,repoPath);
   },(error) => {
     console.log(error);
   });
 }else{
 return;
 }
});
/*return new Promise (resolve => {
 findAncester(maifest).then((file)=>{
   console.log(`file2:${file}`);
  if(file != "nofile"){
    findnextManifest(file).then((file1)=>{
      manifestFile2 = file1;
      let namelist = file.split("_");
      let ancestor = namelist[2];
      arr2.push(ancestor);
      console.log(`arr2:${arr2}`);
      let name = path.basename(manifestFile2.toString(),'.txt');
      let namelist2 = name.split("_");
      let verLabel2 = namelist2[2];
      verLabel2 = verLabel2.replace('name','');
      findAllAncestor2(verLabel2);
    },(error) => {
      console.log(error);
    });
  }else{
    resolve(arr2);
  }
 //  resolve(arr2);
});
})*/
}



const commonAncestor = (version1,version2,repoPath) => {

console.log(`Version:${version1}`);
return findAllAncestor1(version1,repoPath).then(()=>{

console.log('Ancestor 1 is resolved: ');
 let headers1 = arr1;

   return findAllAncestor2(version2,repoPath).then(()=>{
     let headers2 = arr2;
     //console.log(`arr2:${arr2}`);
     console.log(`array here 1:${headers1},2:${headers2}`);
     let final_ancestor = _.intersectionWith(arr1, arr2, _.isEqual);
     return final_ancestor[0];
     console.log(`final_ancestor:${final_ancestor[0]}`)
   });
});
}

const findManifest = (version,repoPath) => {
const file_filter = version;
var liner = new readlines(`${repoPath}\\Manifest\\ManifestIndex.txt`);
var next;
const regex = new RegExp(file_filter);
//  let version = req.body.name + "_CheckoutManifest" + req.body.version + ".txt";
let lineNumber = 0;
while (next = liner.next()) {
 if (regex.test(next.toString('ascii').split(':')[1])) {
   manifestFilename = `${repoPath}\\Manifest\\${next.toString('ascii').split(':')[0]}.txt`;
   return manifestFilename
 }
 lineNumber++;
}
}

const findAncester = (manifestfile,repoPath) => {
let name = path.basename(manifestfile,'.txt');
let namelist = name.split("_");
let ancestorlabel = namelist[1];
let files = fs.readdirSync(`${repoPath}\\Manifest`);

return new Promise(resolve => {
files.forEach(file=>{
 if(file.includes(`${ancestorlabel}_CheckoutManifest`)){
   resolve(file);
 }
})
 resolve("noAncestorFile");
})
}

const findnextManifest = (file,repoPath) => {

let name = path.basename(file,'.txt');
let namelist = name.split("_");
let verLabel = (namelist[2] != undefined)? namelist[2] : namelist[0];
let files = fs.readdirSync(`${repoPath}\\Manifest`);
let m_path = (`${repoPath}\\Manifest\\ManifestIndex.txt`)

return new Promise((resolve,reject) => {

fs.readFile(m_path, function (err, data) {
                     if (err) {console.log(err)}
                     let ancestor_manifestName="";
                     if (data.indexOf(`${verLabel}`) >= 0) {
                     let dataArray = data.toString().split(/[ :\n\s+]+/) // convert file data in an array
                     const searchKeyword = `${verLabel}`; // we are looking for a line, contains, key word 'user1' in the file
                     let lastIndex = -1; // let say, we have not found the keyword
                     for (let index=0; index<dataArray.length; index++) {
                                             if (dataArray[index]== searchKeyword){
                                                // check if a line contains the  keyword
                                                ancestor_manifestName = dataArray[index - 1];
                                                //console.log(`Aminfestfile:${ancestor_manifestName}`);
                                                lastIndex = index; // found a line includes a  keyword
                                                resolve(`${ancestor_manifestName}.txt`);
                                             break;
                                             }
                                         }

                     }  else{
                     reject('no manifest file with name');
                     }
 });


/*  files.forEach(file=>{
 if(file.includes(`_${verLabel}name`)){
   console.log(`manifestfromPrevious:${file}`);
   resolve(file);
 }
},()=>{
 reject('no manifest file with name');
})*/
})
}


module.exports = router;
