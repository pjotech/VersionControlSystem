//Methods for command line argument
/*@author
Aanchal Tandel (aanchalmanharbhai.tandel@student.csulb.edu)
Krishna Desai (krishna.desai@student.csulb.edu)
Nithin Reddy Allala (nithinreddy.allala@student.csulb.edu)
Priya M Joseph (priya.medackeljoseph@student.csulb.edu)
Sujata Patil (sujata.patil@student.csulb.edu
)*/

let express = require('express');
let router = express.Router();
let fs = require('fs');
let path = require('path');
let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

rl.on('line', function(targetPath){
    let array = targetPath.split(" ");
    switch(array[0]){
        case 'create':
            createRepo(array[2],array[1]);
            break;
        case 'commit':
            commitFiles(array[1],array[2]);
            break;
        default:
            console.log("Command not found")
    }
});


const createRepo = (targetPath,targetFolderName) => {
    if (!fs.existsSync(targetPath + `\\${targetFolderName}`))
        fs.mkdir(targetPath + `\\${targetFolderName}`, { recursive: true }, (err) => {
            if (err) throw err;
            console.log("Repository Created at specified path")
           // res.send('Folder Created at specified path');
        });
    else
        console.log("Sorry! Repository with same name already exists")

};

const commitFiles = (src,destination) => {

    fs.readdir(destination, function(err, files) {
        if (err) {
            console.log(err)
        } else {
            if (!files.length) {
                // directory appears to be empty
                fs.readdir(src, (err, files) => {
                    files.forEach(file => {
                        fs.mkdir(`${destination}\\${file}`, { recursive: true }, (err) => {
                            if (err) throw err;
                            if(file.toString() === files[files.length-1].toString()){
                                fs.mkdir(`${destination}\\Manifest`, { recursive: true }, (err) => {
                                    if (err) throw err;
                                });
                                commitProject(src,destination).then(()=>{
                                    console.log("Updated Successfully")
                                });
                            }
                        });
                    });
                });
            }else{
                commitProject(src,destination).then(()=>{
                    Console.log("Updated Successfully")
                });
            }
        }
    });
};

const commitProject = (src,destination) => {
    return new Promise(resolve => {
        if (fs.existsSync(destination))
            fs.readdir(src, (err, files) => {

                files.forEach(file => {
                    //console.log(file);
                    let temp_subFolderName = file;
                    let destDir = `${destination}\\${temp_subFolderName}`;
                    if (fs.existsSync(destDir))
                        checkDirectory(`${src}\\${file}`, file, destination)
                    else
                        fs.mkdir(destDir, {recursive: true}, (err) => {
                            if (err) throw err;
                            checkDirectory(`${src}\\${file}`, file, destination)
                        });
                });
                resolve("Copied");
            });
        else
            console.log("Sorry! Repository with same name already exists");
    })

};



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/createRepo', function(req, res, next) {

    if (!fs.existsSync('C:\\Users\\aanch\\Documents\\ASE-543\\TargetFolder'))
        fs.mkdir("C:\\Users\\aanch\\Documents\\ASE-543\\TargetFolder", { recursive: true }, (err) => {
            if (err) throw err;
            fs.readdir("C:\\Users\\aanch\\Documents\\ASE-543", (err, files) => {
                files.forEach(file => {
                    let temp_subFolderName = file.split('.')[0];
                    fs.mkdir("C:\\Users\\aanch\\Documents\\ASE-543\\TargetFolder\\" + temp_subFolderName, { recursive: true }, (err) => {
                        if (err) throw err;

                    });
                });
            });
            res.send('Repository Created at specified path');
        });
    else
        res.send("Sorry! Repository with same name already exists");
});

//Functions
const artifactID = (filePath) => {

    let  artifactID;
    let stream = fs.createReadStream(filePath, {encoding: 'utf8'});
    let arr =[]; arr.push(1,7,3,7,11);
    let sum = 0;
    let stats = fs.statSync(filePath);
    let fileSizeInBytes = stats["size"];


    return new Promise((resolve, reject) => {

        stream.on('data', data => {
            for(let i=0; i< fileSizeInBytes; i++)
            {
                sum= sum+ data[i].charCodeAt(0)*arr[0];
                arr.push(arr[0]);
                arr.shift();
                artifactID = sum + '-'+'L'+fileSizeInBytes;
                stream.destroy();
            }
            resolve(artifactID)
        },() => {
            resolve(artifactID)
        })
            .on('error', err => {
                reject(err)
            });
    });
};

const makeandcopy = (filepath, temp_subFolderName,destDir,targetRepo) => {

    console.log("FilePath:" + filepath);
    if (!fs.lstatSync(filepath).isDirectory()) {
        copyFile(filepath, destDir,targetRepo);
    }
    else {

        fs.readdir(filepath, (err, files) => {
            files.forEach(file => {

                let temp_subFolderName1 = file;
                if(!fs.existsSync(destDir + "\\" + temp_subFolderName1)){
                    fs.mkdir(destDir + "\\" + temp_subFolderName1, { recursive: false }, (err) => {
                        if (err) throw err;
                        console.log(err)
                        if (!fs.lstatSync(filepath+"\\"+file).isDirectory()) {
                            copyFile(filepath+"\\"+file, destDir+ "\\" + temp_subFolderName1,targetRepo);
                        }
                        else{
                            makeandcopy(filepath + "\\" + file, temp_subFolderName1,destDir + "\\" + temp_subFolderName1,targetRepo)
                        }
                    });
                }else{
                    if (!fs.lstatSync(filepath+"\\"+file).isDirectory()) {
                        copyFile(filepath+"\\"+file, destDir+ "\\" + temp_subFolderName1,targetRepo);
                    }
                    else{
                        makeandcopy(filepath + "\\" + file, temp_subFolderName1,destDir + "\\" + temp_subFolderName1,targetRepo)
                    }
                }

            });
        });

    }
};

const checkDirectory = (filepath, temp_subFolderName,destination) => {
    let destDir = destination+"\\" + temp_subFolderName;
    let targetRepo = destination;
    if (!fs.lstatSync(filepath).isDirectory()) {
        let artid = artifactID(filepath);
        // console.log(`artifcact id: ${artid}`);
        copyFile(filepath, destDir,targetRepo);
    } else {
        // console.log(filepath+"---sdnjs")
        makeandcopy(filepath, temp_subFolderName,destDir,targetRepo)

    }

}

const copyFile = (file, dir2,targetRepo) => {
    //include the fs, path modules
    let fs = require('fs');
    let path = require('path');

    //gets file name and adds it to dir2
    let f = path.basename(file,path.extname(file));
    artifactID(file).then((artifactID) => {
        let filename = f +"_"+artifactID+path.extname(file);
        console.log(`artifactID: ${artifactID}`);

        if(!fs.existsSync(`${dir2}\\${filename}`)){
           // console.log(`${dir2}\\${filename}`);
            let source = fs.createReadStream(file);
            let dest = fs.createWriteStream(path.resolve(dir2, filename));

            source.pipe(dest);+
                source.on('end', function () { console.log('Succesfully copied'); });
            source.on('error', function (err) { console.log(err); });

            manifestFile(dir2 + "\\" + filename,"commit SOURCEPATH TARGETPATH",artifactID,targetRepo);
        }

    },(err) => {
        console.log(err)
    });

};

const manifestFile = (filePath, commandLine, fileartifactID,targetRepo) => {
    let manifestPath = filePath;
    let command= commandLine;
    let FileDetails_artifactID = fileartifactID;  let formattedDate = Date();
    const fileName = 'manifest-'+FileDetails_artifactID+'.text';
    filePath = path.join("C:\\Users\\aanch\\Documents\\ASE-543\\Testnew\\Manifest", fileName);

    let buffer = "\r\ncommand : " + command +"\r\nfile particulars :" + FileDetails_artifactID+

        "\r\nTimeStamp:"+formattedDate+ "\r\nFilePath: "+manifestPath +"\r\n/////////////////////////////////////////////////////////////////////";

    fs.writeFile(`${targetRepo}\\Manifest\\${fileartifactID}.txt`, buffer, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
};

module.exports = router;
