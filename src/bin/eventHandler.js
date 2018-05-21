const path = require('path');
const fs = require('fs');

function onExit() {
	fs.readdirSync(path.join(global.rootPath, 'src/data/grade2/'))
		.forEach(file => {
			if (/.+.json/.match(file)) {
				fs.unlinkSync(file);
			}
		});
	fs.readdirSync(path.join(global.rootPath, 'src/data/grade3/'))
		.forEach(file => {
			if (/.+.json/.match(file)) {
				fs.unlinkSync(file);
			}
		});
}

const EventHander = {
	onExit : onExit,
};

process.on('exit', onExit);
process.on('SIGKILL', onExit);
process.on('SIGTERM', onExit);
process.on('SIGQUIT', onExit);



module.exports = EventHander;