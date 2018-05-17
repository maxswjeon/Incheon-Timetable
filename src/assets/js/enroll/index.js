var selectList = [];

function GetTimeSum() {
	var sum_time = 0;

	selectList.forEach(function(index) {
		sum_time += lecture[index].time;
	});

	return sum_time;
}

function GetPointSum() {
	var sum_point = 0;

	selectList.forEach(function(index) {
		sum_point += lecture[index].point;
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
		selectList.splice(index, 1);
	}
	else {
		node.classList.add('highlight');
		selectList.push(index);
	}
	UpdateSum();
}

function Save() {

}