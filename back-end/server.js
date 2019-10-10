//server.js

const express = require('express');
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('./DB');
const faceDetAPI = require('./apis/FacedetAPI.js');

//initialize vars
dotenv.config()
let myFaceDetAPI = new faceDetAPI();

//console.log(myFaceDetAPI.createAlbum());
//myFaceDetAPI.trainAlbum("http://www.lambdal.com/tiger.jpg", "5d9ca969835e1edb64cf03d5");
//myFaceDetAPI.trainAlbum("http://localhost:4000/uploads/1570544614486-test.jpg", "5d9ca969835e1edb64cf03d5");

const DIR = './uploads';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR);
    },
    filename: (req, file, cb) => {
      //cb(null, file.originalname + '-' + Date.now() + '.' + path.extname(file.originalname));
	  cb(null, file.originalname);
    }
});
let upload = multer({storage: storage});

const productRoute = require('./routes/product.route');
const facedetAPIRoute = require('./routes/facedetapi.route')

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true}). then(
	() => {console.log('Database is connected')},
	err => {console.log('Can not connect to the database' + err)}
);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(cors());
app.use('/products', productRoute);
app.use('/', facedetAPIRoute);
//display images on angular via static path
app.use('/uploads', express.static('uploads'));
  
app.post('/products/upload',upload.single('photo'), function (req, res) {
	if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false
        });
    
      } else {
        console.log('file received');
        return res.send({
          success: true
        })
      }
});

let port = process.env.PORT;

const server = app.listen(port, ()=> {
	console.log('listening on port ' + port);
});
