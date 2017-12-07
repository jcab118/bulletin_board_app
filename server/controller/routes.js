
var pg = require('pg');

var dbUrl = {
	user: process.argv.POSTGRES_USER,
	password: process.argv.POSTGRES_PASSWORD,
	database: 'Bulletin_Express',
	host: 'localhost',
	port: 5432,
};

var pgClient = new pg.Client(dbUrl);

pgClient.connect();

var express = require('express');
var path = require('path');

var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

// POST Route
router.post('/feedBack', (req, res) => {
	if (req.body.name !== '' && req.body.feedBack !== '') {
		var query = 'INSERT into bulletin_express (name, feedBack) VALUES ($1, $2)';
		pgClient.query(query, [req.body.name, req.body.feedBack], (error, enterFeedBack) => {

			if (error) {
				res.json(error); 
			} else {
				res.json(enterFeedBack); 
			}
		});
	} else if (req.body.name === ''  & req.body.feedBack !== '') {
		var queryTwo = "INSERT INTO bulletin_express(name, quote) VALUES ($1, $2)";
		pgClient.query(queryTwo, ["blank", req.body.feedBack], (error, enterFeedBackButNoName) => {
			if (error) {
				res.json(error);
			} else {
				res.json(enterFeedBackButNoName);
			}
		});
	} else if ((req.body.name !== '' && req.body.feedBack === '') || (req.body.name === '' && req.body.feedBack === '')) {
		res.json("null_message");
	}
});


router.get('/feedBack', (req, res) => {
	var queryThree = 'SELECT * FROM bulletin_express';
	pgClient.query(queryThree, (error, getFeedBack) => {
		if (error) {
			res.json(error);
		} else {
			res.json(getFeedBack);
		}
 	});
});

router.delete('/delete-feedBack/:id', (req, res) => {
	pgClient.query('DELETE FROM bulletin_express WHERE id=' + req.params.id, (err, res) => {
		
		if (err) {
			console.log(err);
		}
	});
});


router.put('/update-feedBack/:id', (req, res) => {

	pgClient.query('UPDATE bulletinboard SET quote=$1 WHERE id=' + req.params.id, [req.body.feedBack], (err, results) => {
		if (err) {
			res.json(err);
		}
		res.json({ message: "Message Updated" });
	});
});

// Export this function this for the server connection to take hold.
module.exports = router;