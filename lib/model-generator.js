var fs = require('fs');

function generateDirectory(name, cb) {
    fs.stat(name, function(err, info) {
        if(err && err.code === 'ENOENT') {
            return fs.mkdir(name, 0755, cb);
        }
        if(info.isDirectory()) {
            return cb(null);
        } else {
            return cb('"' + name + '" is not a directory');
        }
    });
}

function createOrClearFile(name, cb) {
    fs.open(name, 'w+', 0644, function(err, fd) {
        if(err && err.code === 'EISDIR') {
            return cb('"' + name + '" is a directory. We need it for the model file.');
        }
        cb(null, fd);
    });
}