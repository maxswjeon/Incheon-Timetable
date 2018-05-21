var submitFlag = false;
var xmlHttp;

function GetTimeSum() {
	var sum_time = 0;

	lecture.forEach(function(element) {
		if (element.selected) {
			sum_time += element.time;
		}
	});

	return sum_time;
}

function GetPointSum() {
	var sum_point = 0;

	lecture.forEach(function(element) {
		if (element.selected) {
			sum_point += element.point;
		}
	});

	return sum_point;
}

function UpdateSum() {
	var time_items = document.getElementsByName('total_time');
	var point_items = document.getElementsByName('total_point');

	var sum_time = GetTimeSum();
	var sum_point = GetPointSum();

	time_items.forEach(function(item) {
		item.innerText = sum_time;
	});

	point_items.forEach(function(item) {
		item.innerText = sum_point;
	})
}

function ToggleItem(node) {
	var item = node.getElementsByClassName('lecture_code')[0];
	var index = item.innerText.charCodeAt(0) - 'A'.charCodeAt(0);

	if (node.classList.contains('highlight')) {
		node.classList.remove('highlight');
		lecture[index].selected = false;
	}
	else {
		node.classList.add('highlight');
		lecture[index].selected = true;
	}
	UpdateSum();
}

function Save() {
	if (!submitFlag) {
		submitFlag = true;

		document.getElementById('submit').enabled = false;

		var uuid1 = document.getElementsByName('uuid1')[0].value;
		var uuid2 = document.getElementsByName('uuid2')[0].value;

		var selectedLecture = [];

		lecture.forEach(element => {
			if (element.selected) {
				json.push(selectedLecture)
			}
		});

		var url = '/enroll';

		var json = {
			lecture : selectedLecture,
			uuid1 : uuid1,
			uuid2 : uuid2
		}

		xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = onQueryFinish;
		xmlHttp.open('POST', url, true);
		xmlHttp.setRequestHeader('Content-Type', 'application/json');
		xmlHttp.send(JSON.stringify(json));
	}
}

function onQueryFinish() {
	console.log(xmlHttp.readyState);
	if (xmlHttp.readyState == 4) {
		window.location.reload();
	}
}

UpdateSum();