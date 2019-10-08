module.exports = function () {
	const unirest = require('unirest');
	const API_KEY = process.env.FACEDETECT_API_KEY_BY_LAMBDA;
	const ALBUM_NAME = 'popularityContest5';
    const ALBUM_KEY = process.env.FACEDETECT_ALBUM_KEY;
	//important ones:
	//create, train, rebuild recognize
	//post
	this.createAlbum = ()=>{
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/album";
		let req = unirest("POST",requestString);
		
		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY,
			"content-type": "application/x-www-form-urlencoded"
		});
		
		req.form({
			"album": ALBUM_NAME
		});
		
		
		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			}
			else {
				console.log(res.status, res.headers, res.body);	
			}
		});

	}
	//post
	this.trainAlbum = (url, id)=>{
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/album_train";
		let req = unirest("POST", requestString);
		let imgURL = url;
		let entryId = id

		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY,
			"content-type": "multipart/form-data"
		});

		req.multipart([
			{
				"urls": imgURL
			},
			{
				"files": {},
				"content-type": "application/octet-stream"
			},
			{
				"album": ALBUM_NAME
			},
			{
				"albumkey": ALBUM_KEY
			},
			{
				"entryid": entryId
			}
		]);

		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			}else {
				console.log(res.body);	
			}	
		});		
	}
	
	//get
	this.rebuildAlbum = ()=>{
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/album_rebuild";
		let req = unirest("GET", requestString);

		req.query({
			"album": ALBUM_NAME,
			"albumkey": ALBUM_KEY
		});

		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY
		});

		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			}else {
				console.log(res.body);	
			}	
		});
	}
	//post
	this.recognizeImg = (url)=>{
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/recognize";
		let req = unirest("POST", requestString);
		let imgURL = url;
		
		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": ALBUM_KEY,
			"content-type": "multipart/form-data"
		});

		req.multipart([
			{
				"urls": imgURL
			},
			{
				"albumkey": ALBUM_KEY
			},
			{
				"album": ALBUM_NAME
			}
		]);

		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			}else {
				console.log(res.body);	
			}	
		});
		
		
	}
	//not important
	//post
	this.detectFeaturesImg = (url)=>{	
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/detect";
		var req = unirest("POST", requestString);
		let imgURL = url;
		
		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY,
			"content-type": "multipart/form-data"
		});

		req.multipart([
			{
				"urls": imgURL
			}
		]);

		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			}else {
				console.log(res.body);	
			}	
		});		
	}
	
	//get
	this.viewAlbum = () => {
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/album";
		let req = unirest("GET", requestString);

		req.query({
			"album": ALBUM_NAME,
			"albumkey": ALBUM_KEY
		});

		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY
		});


		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			} else {
				console.log(res.body);	
			}
		});
	}
	
	this.viewEntry = (id) => {
		let requestString = "https://lambda-face-recognition.p.rapidapi.com/album_train";
		let req = unirest("GET", requestString);
		let entryId = id;
		
		req.query({
			"album": ALBUM_NAME,
			"albumkey": ALBUM_KEY,
			"entryid": entryId
		});

		req.headers({
			"x-rapidapi-host": "lambda-face-recognition.p.rapidapi.com",
			"x-rapidapi-key": API_KEY
		});

		req.end(function (res) {
			if (res.error) {
				console.log(res.body.error);
			} else {
				console.log(res.body);	
			}
		});		
	}
}

