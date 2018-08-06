var express = require('express');
var mongoose = require('mongoose');
var shortid = require('shortid');
var uri = 'mongodb://<dbuser>:<dbpass>@ds133670.mlab.com:33670/url-shortener-microservice';
var app = express();

mongoose.connect(uri);

// SCHEMA SETUP
var siteUrlSchema =  new mongoose.Schema({
  original_url : '',
  short_url : ''
})

var SiteUrl = mongoose.model("SiteUrl", siteUrlSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


function validateURL(url) {
  // Checks to see if it is an actual url
  // Regex from https://gist.github.com/dperini/729294
  var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return regex.test(url);
}


app.get('/',function(req,res){
  res.render('index.ejs')
})

var original_url = '';
app.get('/create/:url*', function(req,res){
  original_url = req.url.slice(8);
  console.log('url',req.url.slice(8));
  //Verifying validateURL or not
  if(validateURL(original_url)){

    var obj ={
      original_url : req.url.slice(8),
      short_url : req.headers.host+'/' + shortid.generate()
    };

    SiteUrl.create(obj,function(err,siteUrl){
      if(err){
        console.log('ERROR: ', err)
      }else{
        console.log('**********NEWLY CREATED SITEURL***********');
        console.log(siteUrl);
      }
    })
    res.send(obj)
  }else{
    res.send({
      "error": "Wrong url format, make sure you have a valid protocol and real site."
    });
  }
})

app.get('/:url', function(req,res){
  var url  = req.headers.host+'/'+req.params.url;
  findSite(url,res);
})

function findSite(url, res) {
  SiteUrl.findOne({"short_url" : url}, function(err,result){
    if(err){
      console.log('ERROR', err)
    }if(result){
      console.log('*************Found Data***********');
      console.log(result);
      res.redirect(result.original_url);
    }else{
        // we don't
        res.send({
        "error": "This url is not on the database."
      });
    }
  })
}

app.get('*',function(req,res){
  res.send({
  "error": "Not a valid endpoint please refer docs"
})
})

app.listen(8080, function(){
  console.log('Server Started !!!!!!')
})
