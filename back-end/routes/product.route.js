// product.route.js

const express = require('express');
const app = express();
const productRoutes = express.Router();
const fs = require('fs');
const faceDetAPI = require('../apis/FacedetAPI.js');

// Require Product model in our routes module
let Product = require('../models/Product');
let myFaceDetAPI = new faceDetAPI();


async function customAsyncFunc(productLink, productId){
   console.log(1)
   await delay(5000)
   console.log(2)
   myFaceDetAPI.trainAlbum(productLink, productId)
}

function delay(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// Defined store route
productRoutes.route('/add').post(function (req, res) {
  let product = new Product(req.body);
  //save to database
  product.save()
    .then(product => {
	  let productId = product._id.toString();
	  let productLink = product.ProductLink;
      res.status(200).json({'Product': 'Product has been added successfully'});
	  
	  //insert data into api	
		//delay sending data to api so that image can be stored into filepath first
		customAsyncFunc(productLink, productId);
    })
    .catch(err => {
		res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
productRoutes.route('/').get(function (req, res) {
  Product.find(function (err, products){
    if(err){
      console.log(err);
    }
    else {
      res.json(products);
    }
  });
});

// Defined edit route
productRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Product.findById(id, function (err, product){
      res.json(product);
  });
});

//  Defined update route
productRoutes.route('/update/:id').post(function (req, res) {
  let id = req.params.id;
  Product.findById(id, function(err, product) {
    if (!product)
      res.status(404).send("Record not found");
    else {
	  product.ProductLink = req.body.ProductLink;
      product.ProductName = req.body.ProductName;
      product.ProductDescription = req.body.ProductDescription;
      product.ProductPrice = req.body.ProductPrice;

      product.save().then(product => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
productRoutes.route('/delete/:id').get(function (req, res) {
	//variable
	let id = req.params.id;
	
	//find id in database based on id from route
	Product.findById(id, function (err, product){
		if(err){
			res.json(err);
		}
		else {			
			try {
			  //create path by assigning product file name based on product link
			  let DIR = 'uploads/';
			  let fileName = product.ProductLink;
			  console.log("my file is: " + fileName);
			  let pattern = /(?<=uploads\/).*$/gi;
			  let regexResult = fileName.match(pattern);
			  let imagePath = DIR + regexResult;
			  
			  //remove image file
			  fs.unlinkSync(imagePath)
			} catch(err) {
			  console.error(err)
			}
		}
	});
	
	//find id based on route and remove db data
    Product.findByIdAndRemove(id, function(err, product){
        if(err){
			res.json(err);
		}
        else{		
			res.json('Successfully removed');
		}
    });
});

module.exports = productRoutes;