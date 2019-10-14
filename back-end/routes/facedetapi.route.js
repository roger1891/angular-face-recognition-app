// product.route.js

const express = require('express');
const app = express();
const facedetAPIRoutes = express.Router();
const fs = require('fs');
const faceDetAPI = require('../apis/FacedetAPI.js');
const base64ToImage = require('base64-to-image');

// Require Product model in our routes module
let Product = require('../models/Product');
let myFaceDetAPI = new faceDetAPI();
const DIR = 'uploads/';




function createImage(imageUrl){
	let base64Str = imageUrl;
	let path ='temp/';
	let date = Date.now();
	let imageFileName = "webcam_" + date;
	let optionalObj = {'fileName': imageFileName, 'type':'jpg'};	
	//creates image
	let imageInfo = base64ToImage(base64Str,path,optionalObj); 

	//base64ToImage(base64Str,path,optionalObj);
	return imageInfo;
}


async function customAsyncFunc(imageName, res){
   console.log(1);
   await delay(1000);
    //call promise
   	myFaceDetAPI.recognizeImg(imageName).then(function(result) { 
	 // here is your response back
	 console.log("my result: " + result);
	 res.json(result);
	});
   console.log(2);
   console.log(3);
   console.log(4);
}

function delay(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

//view album from apis/FacedetAPI
facedetAPIRoutes.route("/albums").get(function (req, res){
	myFaceDetAPI.viewAlbum();
});

facedetAPIRoutes.route("/").post(function (req, res){
	let imageUrl = req.body.url;
	let imageName = createImage(imageUrl).fileName;
	//call async function
	customAsyncFunc(imageName, res);

});

module.exports = facedetAPIRoutes;