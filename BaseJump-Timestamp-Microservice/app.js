var express = require('express');
var moment  = require('moment');
var app = express();


app.get('/', function(req, res){
  res.render('home.ejs')
});

app.get('/favicon.ico', function(req, res) {
  res.status(204);
});

app.get('/:dateFormat', function(req, res){

  var  input = req.params.dateFormat;
  var inp = '';
  var obj = {
    "unix"  : '',
    "natural" : ''
  }

  if(isNaN(input)){
    inp=moment(input,'MMMM D, YYYY');
  }
  else{
    inp = moment.unix(input);
  }

  if(inp.isValid()){
    obj.unix=inp.format('X');
    obj.natural=inp.format('MMMM D, YYYY');
  }


  res.send(obj)

});

app.get('*', function(req, res){
  res.send("Sorry the page u ")
});

app.listen(8080, process.env.IP, function(){
  console.log('Server Started !!!!');
});
