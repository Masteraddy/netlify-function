const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/green-test';
const option = {
	useNewUrlParser: true,
	useFindAndModify: false,
	useCreateIndex: true,
	useUnifiedTopology: true,
};

let conn = null;

const connectDb = (handler) => async (event, context, callback) => {
	// Using new database connection
	if (conn == null) {
		conn = await mongoose.createConnection(uri, option);
		conn.model('service', UserSchema);
	}

	const User = conn.model('service');
	const db = { User };
	return handler(event, context, callback, db);
};

const handler = function(event, context, callback, db){
	const User = db.User;
	console.log(context);
	User.find({})
		.then((result) =>
			callback(null, {
				statusCode: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(result),
			}),
		)
		.catch((err) =>
			callback(null, {
				statusCode: 400,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(err),
			}),
		);
};

exports.handler = connectDb(handler);
