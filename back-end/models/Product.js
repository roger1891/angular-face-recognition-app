//Product.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//define collection & schema fro Product
let Product = new Schema({
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