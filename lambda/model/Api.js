const mongoose = require('mongoose');

const ApiSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

const Api = mongoose.model('service', ApiSchema);

module.exports = Api;
