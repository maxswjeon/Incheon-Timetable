//Logger modules
//const winston = require('winston');
const express = require('express');
const router = express.Router();

router.get('/view/', (req, res) => {
	//const { session } = req;

	/*if (!session.authenticated) {
		res.redirect('/');
	}
	else {
		res.render('view/index');
	}*/
	res.render('view/index', {
		timetable : 
			[
				{
					period : '1',
					time : '8:00 ~ 9:00',
					mon : {
						style : 'red',
						name : 'Test'
					},
					tue : {
						style : 'red',
						name : 'Test'
					},
					wed : {
						style : 'red',
						name : 'Test'
					},
					thr : {
						style : 'red',
						name : 'Test'
					},
					fri : {
						style : 'red',
						name : 'Test'
					}
				},
				{
					period : '2',
					time : '9:00 ~ 10:00',
					mon : {
						style : 'red',
						name : 'Test'
					},
					tue : {
						style : 'red',
						name : 'Test'
					},
					wed : {
						style : 'red',
						name : 'Test'
					},
					thr : {
						style : 'red',
						name : 'Test'
					},
					fri : {
						style : 'red',
						name : 'Test'
					}
				}
			]
		
	});
});

module.exports = router;