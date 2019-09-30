//Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define collection & schema from Product
let Product = new Schema({
	ProductName: {
		type: String
	},
	ProductDescription: {
		type: String
	},
	ProductPrice: {
		type: Number
	},
	ProductLink: {
		type: String
	}
	
}, {
	collection: 'Product'
});

module.exports = mongoose.model('Product', Product);