const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const logSchema = new Schema(
	{
		type: {
				type: String,
				enum: ['article', 'lambda', 'ldaModel', 'rssFeed', 'user', 'other'],
				required: true,
		},
		message: {
			type: String
		},
		details: {},
		reviewed: {
			type: Boolean,
			default: false
		},
		comments: {
			type: [String]
		}
	},
	{
		timestamps: true,
	}
);

const Log = mongoose.model('logs', logSchema);

module.exports = Log;
