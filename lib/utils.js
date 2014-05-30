var fs = require('fs');

// finds or generates a "models" directory or returns error if it's a file.
function generateDirectory(name, cb) {
    fs.stat(name, function(err, info) {
        if(err && err.code === 'ENOENT') {
            return fs.mkdir(name, 0755, cb);
        }
        if(info.isDirectory()) {
            return cb();
        } else {
            return cb('"' + name + '" is not a directory');
        }
    });
}

// opens and clears the model file for writing (or error).
function createOrClearFile(name, cb) {
    fs.open(name, 'w+', 0644, function(err, fd) {
        if(err && err.code === 'EISDIR') {
            return cb('"' + name + '" is a directory. We need it for the model file.');
        }
        cb(null, fd);
    });
}

function capitalize (str) {
    return str.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

module.exports = {
    generateDirectory: generateDirectory,
    createOrClearFile: createOrClearFile,
    capitalize: capitalize
}