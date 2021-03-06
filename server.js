const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();

// This is currently set up to work on heroku.
const knex = require('knex')({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	},
});

// Middle Ware
app.use(bodyParser.json());
app.use(cors());

// HASHING FUNCTIONS
let hashPassword = password => {
	const saltRounds = 10;
	let hash = bcrypt.hashSync(password, saltRounds);
	return hash;
};

// START-------------------------------------

app.get('/', (req, res) => {
	res.send('Server Running Successfully');
});

// Sign In Requests
app.post('/signin', (req, res) => {
	knex
		.select('email', 'hash')
		.from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

			if (isValid) {
				return knex
					.select('*')
					.from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('unable to get user'));
			} else {
				res.status(400).json('Wrong Credentials');
			}
		})
		.catch(err => res.status(400).json('wrong credentials'));
});

// Register Requests
app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	let hash = hashPassword(password);

	knex
		// this transaction block basically makes sure
		// that both inserts will pass before executing
		// after you start the transaction block, you can use
		// trx instead of knex
		.transaction(trx => {
			trx
				.insert({
					hash: hash,
					email: email,
				})
				.into('login')
				.returning('email')
				.then(loginEmail => {
					return trx('users')
						.returning('*')
						.insert({
							email: loginEmail[0],
							name: name,
							joined: new Date(),
						})
						.then(user => {
							res.json(user[0]);
						});
				})
				.then(trx.commit)
				.catch(trx.rollback);
		})
		.catch(err => res.status(400).json('Error Registering'));
});

app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
});
