require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const URL = require("url").URL;
const bodyParser = require("body-parser");
const dns = require("dns");

var originalUrl = "";
var shortUrl = "";

// Basic Configuration
const port = process.env.PORT || 3000;

const isValidUrl = urlString=> {
		let url;
		try { 
	      	url =new URL(urlString); 
	    }
	    catch(e){ 
	      return false; 
	    }
	    return url.protocol === "http:" || url.protocol === "https:";
	}

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:shortUrl', function(req, res){
  let shortUrl = req.params.shortUrl;
  if (shortUrl == 1){
    res.redirect(originalUrl);  
  }
});

app.post('/api/shorturl', function(req, res) {
  // Handle the data in the request
  originalUrl = req.body.url; 
  shortUrl = 1;
  if (isValidUrl(originalUrl)){
    let hostname = new URL(originalUrl);
    dns.lookup(hostname.hostname, (error, address, family) => {
  
  // if an error occurs, eg. the hostname is incorrect!
  if (error) {
    console.error(error);
    res.json({error: 'invalid url' });
  } else {
    // if no error exists
    console.log(
      `The ip address is ${address} and the ip version is ${family}`
    );
    res.json({ original_url: originalUrl, short_url: 1});
  }
});  
  } else {
    res.json({error: 'invalid url' });
  }  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
