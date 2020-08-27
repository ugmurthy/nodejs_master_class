// Dependencies
var fs = require('fs');
var path = require('path');

// container for the module to be exported
var lib = {};

// base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

// write date to file
lib.create = function(dir, file, data, callback){
    // open the file for writing
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
        if (!err && fileDescriptor){
            // convert data to string
            var stringData = JSON.stringify(data);

            // write to file and close it
            fs.writeFile(fileDescriptor,stringData,function(err){
                if (!err) {
                    fs.close(fileDescriptor,function(err){
                        if (!err) {
                            callback(false); // success
                        } else { // close
                            callback('error closing file')
                        }
                    });
                } else { // write
                    callback('error writing file')
                }
            });
        } else { // open
            callback("error could not open file")
        }
    });
};

// READ data from a file
lib.read = function(dir,file,callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
        callback(err,data);
    });
};

lib.update = function(dir,file,data,callback) {
    // open the file
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',function(err,fileDescriptor){
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data)

            // truncate the file
            fs.ftruncate(fileDescriptor,function(err){
                if (!err) {
                    fs.writeFile(fileDescriptor,stringData,function(err){
                        if (!err) {
                            fs.close(fileDescriptor,function(err){
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback('error closing file')
                                }
                            })
                        } else {
                            callback('error writing to file')
                        }
                    })
                } else {
                    callback('error truncating file')
                }
            })
        } else { // open
            callback('error file does not exist for update')
        }
    });
}


// delete a file (collection)
lib.delete = function(dir,file,callback) {
    // unlink the file
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
        if (!err) {
            callback(false);
        } else {
            callback('error could not find file to delete');
        }
    });
};

module.exports = lib;
