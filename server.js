'use strict';

var express = require('express');
var cors = require('cors');
var app = express();

// require and use "multer"...
var multer = require('multer');
var storage = multer.memoryStorage();

function fileFilter(req, file, cb) { 
  file.mimetype.match(/image|text|json$/) ? 
    cb(null, true) : cb('Unexpected mimetype: only image, text and json files are allowed.', false);
/*if(file.mimetype.match(/image|text|json$/)) { 
cb(null, true);
} else {
//cb(new Error('Unexpected mimetype: only images are allowed.'));
  cb('Unexpected mimetype: only image, text and json files are allowed.', false);
}*/
}
var upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: 1024*500} });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});
 
app.post("/api/fileanalyse", function(req, res, next) {
  upload.single('upfile')(req, res, function(err) {
  if(err) { 
    if(err.code) {
      if(err.code==='LIMIT_FILE_SIZE') { return res.json({error: 'File too large'}); }
    } 
    return res.json({error: err});
  } 
    if(req.file) {
 res.json({name: req.file.originalname, mimetype: req.file.mimetype, encoding: req.file.encoding, size: req.file.size});
    } else {
   res.json({error: 'Path `file` is required'}); 
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...'); 
});
