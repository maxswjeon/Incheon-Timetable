var xmlHttp;

function Login() {
	console.log('hey!');
	var userid = login.id.value;
	var pass = login.pass.value;
	var uuid1 = login.uuid1.value;
	var uuid2 = login.uuid2.value;

	if (!userid || !pass) {
		alert('아이디와 패스워드를 확인하세요');
		return false;
	}

	var url = '/user/login';

	var queryJSON = {
		userid: userid,
		pass: pass,
		uuid1: uuid1,
		uuid2: uuid2
	};

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open('POST', url, false);
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.send(JSON.stringify(queryJSON));

	window.location.reload();
	return false;
}

function SignUp() {
	var schoolnum = signup.schoolnum.value;
	var userid = signup.id.value;
	var pass = signup.pass.value;
	var secret = signup.secret.value;
	var uuid1 = signup.uuid1.value;
	var uuid2 = signup.uuid2.value;

	if (!userid || !pass || !secret || !schoolnum) {
		alert('아이디와 패스워드, 학번, 비밀코드를 확인하세요');
		return false;
	}

	var url = '/user/signup';

	var queryJSON = {
		schoolnum: schoolnum,
		userid: userid,
		pass: pass,
		secret: secret,
		uuid1: uuid1,
		uuid2: uuid2
	};

	xmlHttp = new XMLHttpRequest();
	xmlHttp.open('POST', url, false);
	xmlHttp.setRequestHeader('Content-Type', 'application/json');
	xmlHttp.send(JSON.stringify(queryJSON));

	window.location.reload();
	return false;
}

function hashChanged(hash) {
	if (hash === 'signup') {
		signup.id.value = login.id.value;
		login.pass.value = '';
		login.classList.add('hidden');
		signup.classList.remove('hidden');
	}
	else {
		login.id.value = signup.id.value;
		signup.pass.value = '';
		login.classList.remove('hidden');
		signup.classList.add('hidden');
	}
}

//Check if onHashChange Event is Available
if ("onhashchange" in window) {
	window.onhashchange = function () {
		hashChanged(window.location.hash.substr(1));
	}
}
else {
	var storedHash = window.location.hash;
	window.setInterval(function () {
		if (window.location.hash != storedHash) {
			storedHash = window.location.hash;
			hashChanged(storedHash.substr(1));
		}
	}, 100);
}

hashChanged(window.location.hash.substr(1));