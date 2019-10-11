// product.route.js

const express = require('express');
const app = express();
const facedetAPIRoutes = express.Router();
const fs = require('fs');
const faceDetAPI = require('../apis/FacedetAPI.js');

// Require Product model in our routes module
let Product = require('../models/Product');
let myFaceDetAPI = new faceDetAPI();


//view album from apis/FacedetAPI
facedetAPIRoutes.route("/albums").get(function (req, res){
	myFaceDetAPI.viewAlbum();
});

facedetAPIRoutes.route("/").post(function (req, res){
	let imageUrl = req.body.url;
	console.log("test: " + JSON.stringify(imageUrl));
	//myFaceDetAPI.recognizeImg(imageUrl);
	//res.status(200).json(myFaceDetAPI.recognizeImg(imageUrl));
	//call promise
	myFaceDetAPI.recognizeImg(imageUrl).then(function(result) { 
	 // here is your response back
	 console.log(result);
	 res.json(result);
	});
});

module.exports = facedetAPIRoutes;