const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rssFeedSchema = new Schema(
	{
		_id: { // this will be the feeds url http
			type: String,
			required: true,
		},
		numberOfArticles: {
			type: Number,
			default: 0,
		},
		title: {
			type: String,
		},
		// feedUrl: {
		// 	type: String,
		// },
		siteUrl: {
			type: String,
		},
		urlPrefix:{
			type: String,
		},
		bloomFilter: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const RssFeed = mongoose.model('rssfeeds', rssFeedSchema);

module.exports = RssFeed;
