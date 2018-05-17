var submitFlag = false;
var xmlHttp;

function Login() {
	if (!submitFlag) {
		submitFlag = true;

		document.getElementById('submit').enabled = false;

		var userid = document.getElementsByName('id')[0].value;
		var pass = document.getElementsByName('pw')[0].value;
		var uuid1 = document.getElementsByName('uuid1')[0].value;
		var uuid2 = document.getElementsByName('uuid2')[0].value;
		
		if (!userid || !pass) {
			alert('아이디와 패스워드를 확인하세요');
			submitFlag = false;
			return;
		}

		var url = '/user/login';

		var queryJSON = {
			userid : userid,
			pass : pass,
			uuid1 : uuid1,
			uuid2 : uuid2
		};

		xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = onQueryFinish;
		xmlHttp.open('POST', url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/json');
		xmlHttp.send(JSON.stringify(queryJSON));
	}
}

function onQueryFinish() {
	console.log(xmlHttp.readyState);
	if (xmlHttp.readyState == 4) {
		window.location.reload();
	}
}