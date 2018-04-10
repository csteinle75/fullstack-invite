var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mustacheExpress = require('mustache-express')

var app = express()


app.use(bodyParser.json())

module.exports = app