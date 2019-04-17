//Main File
/*@author
Aanchal Tandel (aanchalmanharbhai.tandel@student.csulb.edu)
Krishna Desai (krishna.desai@student.csulb.edu)
Nithin Reddy Allala (nithinreddy.allala@student.csulb.edu)
Priya M Joseph (priya.medackeljoseph@student.csulb.edu)
Sujata Patil (sujata.patil@student.csulb.edu
)*/

var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var	upload = require("express-fileupload");

var app = express();

var indexRouter = require('./routes/index');
var vcsRouter = require('./routes/vcs');


// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(upload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//static
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/vcs',vcsRouter);


module.exports = app;
