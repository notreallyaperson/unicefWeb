const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
		// _id: {
		// 	type: Int32Array
		// },
		title: {
			type: String,
		},
		url: {
			type: String,
		},
		date: {
			type: Date,
		},
		content: {
			type: String,
		},
		// k=50 we will have an array of 50 parameter values
		gamma: [{
			value: [],
			ldaModelId: {
				type: String
			},
			lamdaId: {
				type: String
			},
		}],
	},
	{
		timestamps: true,
	}
);

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
