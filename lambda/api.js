const express = require('express');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

//MongoDB Options
const db = process.env.MONGO_URI || 'mongodb://localhost:27017/green-test';
const option = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
};

//Connect to Database
mongoose.connect(db, option).then(() => console.log('MongoDb Connected...')).catch((err) => console.log(err));

const Api = require('./model/Api');

const router = express.Router();
router.get('/', (req, res) => {
	Api.find({})
		.then((result) => res.status(200).json({ data: result }))
		.catch((err) => res.status(400).json({ error: err }));
});

router.get('/another', (req, res) => res.json({ route: req.originalUrl }));

router.post('/', (req, res) => {
	// res.json({ postBody: req.body })
	var { type, name } = req.body;
	var newpost = new Api({
		name,
		type,
	});

	newpost
		.save()
		.then((item) => res.json({ success: true, data: item }))
		.catch((err) => res.status(404).json({ msg: `Not post due to ${err}` }));
});

router.delete('/:id', (req, res) => {
	Api.findByIdAndDelete(req.params.id, (err, todo) => {
		if (err) return res.status(500).send({ success: false, err });
		return res.json({ success: true });
	});
});

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use('/.netlify/functions/api', router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
