var fs = require('fs');
var utils = require('./utils');

// writes down file content.
function createIndexFileContent(fd, name, pluralName, types, cb) {
    var TAB = '    ';
    var NL = '\r\n';

    var text = '<h2>' + utils.capitalize(pluralName.toLowerCase()) + '</h2>'+ NL +
        '<p>View ' + pluralName + ' or <a href="edit.html">add</a> a ' + name + '.</p>'+ NL +
        '<% if (flash) { %>'+ NL +
        TAB + '<p><%= flash %></p>'+ NL +
        '<% } %>'+ NL +
        '<ul>'+ NL +
        TAB + '<li class="header">'+ NL;

    for (var i = 0; i < types.length;i++) {
        var current = types[i];
        var line = TAB + TAB + '<span class="field">';
        line = line + utils.capitalize(current.name.toLowerCase());
        line = line + '</span>' + NL;
        text = text + line;
    }
    text = text +
        TAB + TAB + '<span class="field">Actions</span>'+ NL +
        TAB + '</li>'+ NL +

        TAB + '<% for(var i=0; i<' + pluralName + '.length; i++) {%>'+ NL +
        TAB + TAB + TAB + '<li class="row">'+ NL;

    for (var i = 0; i < types.length;i++) {
        var current = types[i];
        var line = TAB + TAB + TAB + TAB +
            '<span class="field"><%= ' + name + '[\'' + current.name + '\'] %></span>'+ NL;
        text = text + line;
    };

    text = text + TAB + TAB +  TAB + TAB + '<span class="field">'+ NL +
        TAB + TAB + TAB + TAB + TAB + '<%= link_to(\'Edit\', \'' + pluralName + '/\'+' + pluralName + '[i]._id) %>'+ NL +
        TAB + TAB + TAB + TAB + '</span>'+ NL;
    text = text +
        TAB + TAB + TAB + '</li>'+ NL +
        TAB + '<% } %>'+ NL +
        '</ul>' + NL;

    var buf = new Buffer(text);
    fs.write(fd, buf, 0, buf.length, null, cb);
}

function createFormFileContent(fd, name, pluralName, types, cb) {
    var TAB = '    ';
    var NL = '\r\n';

    var text = '<h2>' + utils.capitalize(name) + ' form</h2>' + NL +
        '<p>' + NL +
        TAB + '<% if (' + name + ') { %>' + NL +
        TAB + TAB + 'New ' + name + '' + NL +
        TAB + '<% } else { %>' + NL +
        TAB + TAB + 'Edit ' + name + '' + NL +
        TAB + '<% } %>' + NL +
        '</p>' + NL +
        '<% if (flash) { %>' + NL +
        TAB + '<p>{flash}</p>' + NL +
        '<% } %>' + NL +
        '<div class="content">' + NL +
        TAB + '<div>' + NL +
        TAB + TAB + '<form name="' + name + '" method="<% if (' + name + ') { %>put<% } else { %>post<% } %>"' + NL +
        TAB + TAB + TAB +  'action="/' + pluralName + 's<% if (' + name + ') { %>/<%= ' + name + '._id %><% } %>">' + NL;

    for (var i = 0; i < types.length;i++) {
        var current = types[i];
        var line = '';
        line = line + TAB + TAB + TAB + '<div class="row">' + NL +
            TAB + TAB + TAB + TAB + '<label>' + utils.capitalize(current.name) +
            '</label>' + NL +
            TAB + TAB + TAB + TAB + '<input type="text" name="' + current.name +
            '" value="<%= ' + name + '.' + current.name + ' %>">' + NL +
            TAB + TAB + TAB + '</div>' + NL;
        text = text + line;
    };


    text = text + TAB + TAB + TAB + '<div class="row controls">' + NL +
        TAB + TAB + TAB + TAB + '<input type="submit" value="Save">' + NL +
        TAB + TAB + TAB + '</div>' + NL +
        TAB + TAB + '</form>' + NL +
        TAB + TAB + '<% if (' + name + ') {%>' + NL +
        TAB + TAB + TAB + '<form method="delete" action="/' + pluralName + 's<%= ' + name + '._id %>">' + NL +
        TAB + TAB + TAB + TAB + '<input type="submit" value="Delete"/>' + NL +
        TAB + TAB + TAB + '</form>' + NL +
        TAB + TAB + '<% } %>' + NL +
        TAB + '</div>' + NL +
        '</div>' + NL;

    var buf = new Buffer(text);
    fs.write(fd, buf, 0, buf.length, null, cb);
}

function generateViews(name, pluralName, types, cb) {
    utils.generateDirectory('views', function(err) {
        if(err) {
            return cb(err);
        }
        utils.generateDirectory('views/' + pluralName, function(er){
            if(err){
                return cb(err);
            }
            var indexName = 'views/' + pluralName + '/index.ejs';
            utils.createOrClearFile(indexName, function (err, fd) {
                if(err) {
                    return cb(err);
                }
                createIndexFileContent(fd, name, pluralName, types, function(err, data){
                    if(err) {
                        return (cb(err));
                    }
                    fs.close(fd, function(err){
                        if(err) {
                            return cb(err);
                        }
                        var formName = 'views/' + pluralName + '/edit.ejs';
                        utils.createOrClearFile(formName, function (err, fd) {
                            createFormFileContent(fd, name, pluralName, types, function(err, data){
                                if(err){
                                    return cb(err);
                                }
                                fs.close(fd, cb);
                            });
                        });
                    });
                });
            });
        });
    });
}

module.exports = {
    generateViews: generateViews
};