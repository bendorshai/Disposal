var express = require('express');
var path = require('path')
var wrapper = require('./api/wrapper.js')

var app = express();

// Serve js files
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/view', function (req, res) {
  res.sendFile(path.join(__dirname + '/view.html'));
});

app.get('/wrap', wrapper.wrap);
app.get('/unwrap', wrapper.unwrap);


var port = process.env.PORT || 3000;
app.listen(port , function () {
  console.log('Example app listening on port 3000!');
});