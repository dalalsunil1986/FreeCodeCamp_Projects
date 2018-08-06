var express = require('express');


var app = express();

app.get('/',function(req,res){
  res.render('index.ejs')
})

app.get('/getInfo', function(req,res){
var obj = {
  ipaddress : '',
  languages : '',
  software : ''
}
  obj.ipaddress = req.connection.remoteAddress.split(':').reverse()[0];
  obj.languages = req.headers['accept-language'].split(',')[0].trim();
  obj.software = req.headers['user-agent'].split(/[\(\)]/)[1].trim();

  res.send(obj)
})
app.listen(8080, function(){
  console.log('Server Started !!!!!!')
})
