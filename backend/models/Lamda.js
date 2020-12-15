const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const lamdaSchema = new Schema(
    // Array of Arrays for each word in our vocabulary
	{
		lamda: [],
		LdaModelId: {
			type: String,
		}
	},
	{
		timestamps: true,
	}
);

const Lamda = mongoose.model('articles', lamdaSchema);

module.exports = Lamda;
