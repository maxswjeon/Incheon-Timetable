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
						style : 'salmon',
						name : 'Test'
					},
					wed : {
						style : 'pink',
						name : 'Test'
					},
					thr : {
						style : 'orange',
						name : 'Test'
					},
					fri : {
						style : 'yellow',
						name : 'Test'
					}
				},
				{
					period : '2',
					time : '9:00 ~ 10:00',
					mon : {
						style : 'yellowgreen',
						name : 'Test'
					},
					tue : {
						style : 'green',
						name : 'Test'
					},
					wed : {
						style : 'skyblue',
						name : 'Test'
					},
					thr : {
						style : 'blue',
						name : 'Test'
					},
					fri : {
						style : 'purple',
						name : 'Test'
					}
				},
				{
					period : '3',
					time : '10:00 ~ 11:00',
					mon : {
						style : 'blue',
						name : 'Test'
					},
					tue : {
						style : 'purple',
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