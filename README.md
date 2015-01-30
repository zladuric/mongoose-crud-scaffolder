mongoose-scaffold-crud
======================

Simple Mongoose model, REST controller and EJS view code generator. Built
because the authors' google-foo is weakening (even though he knew he can't be
the only one needing this, there was nothing on the interwebs to help him out)
and he needed to kick-off another Express/Mongoose project.

The REST controller is built for Express 4, but support may be added for 3 in
the future.

# Usage

    npm install -g mongoose-scaffold-crud

    mongoose-scaffold-crud user name email age:number

It generates a Mongoose model, a REST controller and a simple EJS view.

# Details

## Model generator

The scaffolder takes at least one argument - model name.
By default, we add name the parameter to mongoose model.

Model example:

    'use strict';
    var mongoose = require('mongoose')
        , Schema = mongoose.Schema
        ;

    var usersSchema = new Schema({
        name: String,
        email: String,
        age: Number
    });

    module.exports = mongoose.model('users', usersSchema);`

## Controllers generator

The controller generated will export an express4 Router setup for the rest route. It will look like this:

    'use strict';
    var users = express.Router();
    var Model = require('../models/model-users.js')

    users.get('/', function(req, res) {
        Model.find(function(err, list){
            if(req.accepts('json')) {
                if(err) {
                    return res.json(500, {
                        message: 'Error getting users.'
                    });
                }
                return res.json(list);
            } else {
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                return res.render('users/index', {users: users});
            }
        });
    });

    users.post('/', function(req, res) {
        var user = new Model({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        user.save(function(err, user){
            if(req.accepts('json')) {
                if(err) {
                    return res.json(500, {
                        message: 'Error saving user',
                        error: err
                    });
                }
                return res.json({
                    message: 'saved',
                    _id: user._id
                });
            } else {
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                return res.render('users/edit', {user: user});
            }
        });
    });

    users.get('/:id', function(req, res) {
        var id = req.params.id;
        Model.findOne({_id: id}, function(err, user){
            if(req.accepts('json')) {
                if(err) {
                    return res.json(500, {
                        message: 'Error getting user.'
                    });
                }
                if(!user) {
                    return res.json(404, {
                        message: 'No such user'
                    });
                }
                return res.json(user);
            } else {
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                if(!user) {
                    return res.end('No such user');
                }
                return res.render('users/edit', {user: user, flash: 'Created.'});
            }
        });
    });

    users.put('/:id', function(req, res) {
        var id = req.params.id;
        Model.findOne({_id: id}, function(err, user){
            if(req.accepts('json')) {
                if(err) {
                    return res.json(500, {
                        message: 'Error saving user',
                        error: err
                    });
                }
                if(!user) {
                    return res.json(404, {
                        message: 'No such user'
                    });
                }
                user.name = req.body.name ? req.body.name : user.name;
                user.email = req.body.email ? req.body.email : user.email;
                user.age = req.body.age ? req.body.age : user.age;
                user.save(function(err, user){
                    if(err) {
                        return res.json(500, {
                            message: 'Error getting user.'
                        });
                    }
                    if(!user) {
                        return res.json(404, {
                            message: 'No such user'
                        });
                    }
                    return res.json(user);
                });
            } else {
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                if(!user) {
                    return res.end('No such user');
                }
                user.name = req.body.name ? req.body.name : user.name;
                user.email = req.body.email ? req.body.email : user.email;
                user.age = req.body.age ? req.body.age : user.age;
                user.save(function(err, user){
                    if(err) {
                        return res.send('500: Internal Server Error', 500);
                    }
                    if(!user) {
                        return res.end('No such user');
                    }
                    return res.render('users/edit', {user: user, flash: 'Saved.'});
                });
            }
        });
    });

    users.delete('/:id', function(req, res) {
        var id = req.params.id;
        Model.findOne({_id: id}, function(err, user){
            if(req.accepts('json')) {
                if(err) {
                    return res.json(500, {
                        message: 'Error getting user.'
                    });
                }
                if(!user) {
                    return res.json(404, {
                        message: 'No such user'
                    });
                }
                return res.json(user);
            } else {
                if(err) {
                    return res.send('500: Internal Server Error', 500);
                }
                if(!user) {
                    return res.end('No such user');
                }
                return res.render('index', {flash: 'Item deleted.'});
            }
        });
    });


## View generator

This will generate two Ejs files: one index.ejs partial (layout file assumed
provided) with list of items, another is edit.js, with a form for viewing,
editing or creating a single item.

Example of index.js:


    <h2>Users</h2>
    <p>View users or <a href="edit.html">add</a> a user.</p>
    <% if (flash) { %>
        <p><%= flash %></p>
    <% } %>
    <ul>
        <li class="header">
            <span class="field">Name</span>
            <span class="field">Email</span>
            <span class="field">Age</span>
            <span class="field">Actions</span>
        </li>
        <% for(var i=0; i<users.length; i++) {%>
                <li class="row">
                    <span class="field"><%= user.name %></span>
                    <span class="field"><%= user.email %></span>
                    <span class="field"><%= user.age %></span>
                    <span class="field">
                        <%= link_to('Edit', 'supplies/'+users[i]._id) %>
                    </span>
                </li>
        <% } %>
    </ul>


Example of edit.js:


    <h2>User form</h2>
    <p>
        <% if (user) { %>
            New user
        <% } else { %>
            Edit user
        <% } %>
    </p>
    <% if (flash) { %>
        <p>{flash}</p>
    <% } %>
    <div class="content">
        <div>
            <form name="user",method="<% if (user) { %>put<% } else { %>post<% } %>"
                 action="/users<% if (user) { %>/<%= user._id %><% } %>">
                <div class="row">
                    <label>Name</label>
                    <input type="text" name="name" value="<%= user.name %>">
                </div>
                <div class="row">
                    <label>Email</label>
                    <input type="text" name="name" value="<%= user.email %>">
                </div>
                <div class="row">
                    <label>Age</label>
                    <input type="text" name="name" value="<%= user.number %>">
                </div>
                <div class="row controls">
                    <input type="submit" value="Save">
                </div>
            </form>
            <% if (user) {%>
                <form method="delete" action="/users/<%= user._id %>">
                    <input type="submit" value="Delete"/>
                </form>
            <% } %>
        </div>
    </div>


# ROADMAP

v0.1.0 - just get a dumb scaffolder working.
- model generator: create a models/model-<name>.js
- model generator: put code in there with all the fields required
- controller generator: create a controllers/ctrl-<name>.js
- controller generator: create an express4 Router in there for REST on the model
- views generator: create a views/<model>/index.js and views/<model>/edit.ejs
- views generator: generate HTML in there that will show a list of models

v0.2.0 Get it right
- fix the project name bug (mongoose-scaffold-crud is a dumb name)
- gather feedback on all the stupid things in code
- maybe take more arguments (ie generate controller only, accept
  unique/required params for fields etc)

