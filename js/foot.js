$(function () {
	$('#iosDown,#androidDown').hover(function () {
		$(this).addClass('hover')
			.find('.normal-img').addClass('hide')
			.end().find('.hover-img').removeClass('hide');
	}, function () {
		$(this).removeClass('hover')
			.find('.normal-img').removeClass('hide')
			.end().find('.hover-img').addClass('hide');
	});
	$('#footer').on('mouseover', '.cd-icon', function () {
		$(this).find('.qrcode-tip').show();
	}).on('mouseout', '.cd-icon', function () {
		$(this).find('.qrcode-tip').hide();
	});
});