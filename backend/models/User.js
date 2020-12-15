const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		password: {
			type: String,
			//required: true,
		},
		email: {
			type: String,
			unique: true,
			//required: true,
			trim: true,
		},
		permissionLevel: {
			type: String,
		},
		status: {
			type: String,
			trim: true,
		},
		token: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model('users', userSchema);

module.exports = User;
