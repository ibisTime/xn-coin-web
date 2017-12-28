$(function () {
	fetch(625917, {
		key: 'privacy'
	}).then((data) => {
		$('#content').html(data.cvalue);
	});
});