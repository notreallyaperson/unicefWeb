const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rssFeedSchema = new Schema(
	{
		feedUrl: { // this will be the feeds url http
			type: String,
			required: true,
		},
		numberOfArticles: {
			type: Number,
			default: 0,
		},
		numberOfFailedArticles: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
		},
		siteUrl: {
			type: String,
		},
		urlPrefix:{
			type: String,
		},
		bloomFilter: {
			type: {
				type: String
			},
			_size: {
				type: Number
			},
			_nbHashes: {
				type: Number
			},
			_filter: {
				type: []
			},
			_length: {
				type: Number
			},
			_seed: {
				type: Number
			}
		},
		icon: {
			type: String,
		},
		logs: [],
	},
	{
		timestamps: true,
	}
);

const RssFeed = mongoose.model('rssfeeds2', rssFeedSchema);

module.exports = RssFeed;
