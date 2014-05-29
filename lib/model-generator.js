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