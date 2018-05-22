const fs = require('fs');

const config = require('./src/bin/config');
const mongodb = require('./src/bin/mongodb');

//Parse Config Files And Save it to Global Variables
config.parse();

const User = require('./src/schemas/user');

const studentInfo = [
	//Grade 1 Student Count
	[25, 25, 25],

	//Grade 2 Student Count
	[25, 25, 25],

	//Grade 3 Student Count
	[25, 25, 25],
];
const randomLength = 15;

function makeid() {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=';
  
	for (var i = 0; i < randomLength; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

const file = fs.createWriteStream('./UserSecret.csv', { flags : 'a' });
const date = new Date();

file.write('Date,' + date + '\n');

async function Init() {
	try {
		await mongodb.connect();		
		const collectionCount = await new Promise((resolve, reject) => {
			User.collection.count((err, count) => {
				if (err) {
					reject(err);
					return;
				}

				resolve(count);
			});
		});

		if (collectionCount !== 0) {
			await User.collection.drop();
		}

		for (let _grade = 0; _grade < studentInfo.length; ++_grade) {
			for (let _class = 0; _class < studentInfo[_grade].length; ++_class) {
				for (let _number = 0; _number < studentInfo[_grade][_class]; ++_number) {
					const id = makeid();
					const schoolnum = ((_grade + 1) * 10000) + ((_class + 1) * 100) + (_number + 1);
					file.write(schoolnum + ',' + id + '\n');
					await User.initSecret(schoolnum, id);
				}
			}
		}
	}
	catch (ex) {
		console.log(ex); // eslint-disable-line no-console
	}
	finally {
		mongodb.mongoose.disconnect();
	}
}

Init();