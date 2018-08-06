/**
* @Author: Mohammed Ismail
* @Date:   2017-10-05T12:08:21+05:30
* @Last modified by:   Mohammed Ismail
* @Last modified time: 2017-10-05T12:08:26+05:30
*/

var express = require('express');
var multer = require('multer');
var upload = multer({dest : 'uploads/'});

var app = express();
app.set('view engine', 'ejs');

var fileInfo = {
  filename : 'freecodecamp_logo_sample.png',
  filetype : 'image/png',
  size : '12705'
}

app.get('/', function(req,res){
  res.render('index',{fileInfo : fileInfo});
})

app.post('/uploadfiles', upload.single('file'), function(req, res){
  try{
    fileInfo.filename = req.file.originalname,
    fileInfo.filetype = req.file.mimetype,
    fileInfo.size = req.file.size
    res.redirect('/');
    res.render('index', {fileInfo : fileInfo});

  }catch(err){
    console.log(err)
    res.send({'Error': 'No image selected please select some image and try...'});
  }

})

app.get('*',function(req,res){
  res.send({
  "error": "Not a valid endpoint please refer docs here https://ikismail-fileupload-microservice.glitch.me/"
})
})

app.listen(8080, function(){
  console.log('Server Started !!!!!')
})
