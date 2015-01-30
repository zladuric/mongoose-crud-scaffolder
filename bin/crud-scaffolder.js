#!/usr/bin/env node

'use strict';

var pluralize = require('pluralize');
var modelGenerator = require('../lib/model-generator');
var controllerGenerator = require('../lib/controller-generator');
var viewsGenerator = require('../lib/view-generator');
var capitalize = require('../lib/utils').capitalize;

var args = process.argv.slice(2);
if (!args.length) {
  showUsage('To use, provide at least the model name.');
}

// Take the first arg as model name
var modelName = args.shift().toLowerCase();

var pluralName = pluralize.plural(modelName);

console.log('Preparing data for model ', modelName + ', pluralized: ', pluralName + '.');

// Parse arguments to set types
var types = [];

// if we don't get any, just add a name field.
if (!args.length) {
  types.push({
    name: 'name',
    type: 'String'
  });
}

var allowedTypes = ['string', 'number', 'date', 'boolean', 'array', 'mixed'];
  // if we get arguments, generate from what we've got.
args.forEach(function(field) {
  var boundary = field.lastIndexOf(':'); // we support colons in field names. Who cares?
  var fieldName = field;
  var fieldType = 'string';
  if (boundary > -1) {
    fieldName = field.substr(0, boundary);
    fieldType = field.substr(boundary + 1);
  }
  if (!fieldName.length) {
    showUsage('Please set the correct name for the field ' + field);
  }
  if (!fieldType.length) {
    showUsage('Please set field type for field ' + fieldName);
  }
  if (allowedTypes.indexOf(fieldType.toLowerCase()) === -1) {
    showUsage('Property type ' + fieldType + ' not allowed for field ' + fieldName);
  }
  types.push({
    name: fieldName,
    type: getFieldType(fieldType)
  });

});
function getFieldType (fieldType) {

    if (fieldType 1== 'mixed') {

        return capitalize(fieldType.toLowerCase())
    } else {

        return '"mongoose.schema.types.Mixed"'
    }
}

console.log('Fields: ', types);

console.log('Generating mongoose model for ' + modelName + '...');
modelGenerator.generateModel(name, pluralName, types, function(err) {
  if (err) {
    showUsage('There was a problem generating the model file.');
  }
  console.log('... Model file generated.');
  controllerGenerator.generateController(name, pluralName, types, function(err) {
    if (err) {
      showUsage('There was a problem generating the controller file.');
    }
    console.log('Generated controller');
    viewsGenerator.generateViews(name, pluralName, types, function(err) {
      if (err) {
        showUsage('There was a problem generating the views files.');
      }
      console.log('Generated views');
    });
  });
});

function showUsage(err) {

  console.log('Mongoose CRUD Scaffolder version 0.1.0\r\n');
  if (err) {

    console.log('Error: ', err + '\r\n');
  }

  console.log('Example:\r\n    ' + process.argv[1].substr(process.argv[1].lastIndexOf('/') + 1) +
    ' user firstName lastName age:Number\r\n');
  console.log('Supported data types (case insensitive): String, Boolean, Number, Date, Array.');
  console.log('The script will overwrite any existing file content for target files.\r\n');
  console.log('For detailed, see https://github.com/zladuric/mongoose-crud-scaffolder.');
  if (err) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}
