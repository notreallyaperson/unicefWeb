const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
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
	},
	{
		timestamps: true,
	}
);

const Article = mongoose.model('articles', articleSchema);

module.exports = Article;
