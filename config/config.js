module.exports = {
	express: {
		port: 3000,
	},
	salt: {
		bits: 512,
	},
	hash: {
		iteritation: 100000,
		bits: 512,
		digest: 'sha512',
	},
	data : {
		grade2 : 'data/grade2.xlsx',
		grade3 : 'data/grade3.xlsx',
	}
};
