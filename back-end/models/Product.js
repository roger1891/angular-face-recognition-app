//Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define collection & schema from Product
let Product = new Schema({
	ProductLink: {
		type: String
	},
	ProductName: {
		type: String
	},
	ProductDescription: {
		type: String
	},
	ProductPrice: {
		type: Number
	}
}, {
	collection: 'Product'
});

module.exports = mongoose.model('Product', Product);