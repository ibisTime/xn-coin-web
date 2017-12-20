$(function () {
	fetch(625917, {
		key: 'questions'
	}).then((data) => {
		$('#content').html(data.cvalue);
	});
});