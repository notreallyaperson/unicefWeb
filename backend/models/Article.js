const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema(
	{
		_id: {
			type: Number,
			required: true
		},
		feedId: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		date: {
			type: Date,
		},
		dateParsed: {
			type: Date,
			required: true,
		},
		content: {
			type: String,
		},
		noContentFlag: {
			type: Boolean,
		},
		logs: [],
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
