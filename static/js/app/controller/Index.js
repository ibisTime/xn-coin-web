define([
    'app/controller/base',
    'app/util/handlebarsHelpers',
    'swiper',
], function(base, Handlebars, Swiper,) {
	var _loadingSpin = $("#loadingSpin");
    init();
    // 初始化页面
    function init() {
    	_loadingSpin.removeClass("hidden");
    	
        _loadingSpin.addClass("hidden");
        addListener();
    }
    // 初始化swiper
    function initSwiperBanner(){
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        new Swiper('#swiper', {
            'autoplay': 4000,
            'pagination': '#swiper',
            'pagination' : '#swiper .swiper-pagination',
            'paginationClickable' :true,
            'preventClicksPropagation': true,
            'loop' : true,
        });
    }
    
    // 获取banner
    function getBanner(refresh){
//      return menuCtr.getIndexBanner(refresh)
//          .then((data) => {
//              var bannerHtml = "";
//              data.forEach((d) => {
//                  var pics = base.getPicArr(d.pic);
//                  pics.forEach((pic) => {
//                      bannerHtml += `<div class='swiper-slide'><a href="${d.url || ""}" style="background-image:url(${pic});"></div>`;
//                  });
//              });
//              $("#swiper .swiper-wrapper").html(bannerHtml);
//              initSwiperBanner();
//          }, (msg) => {
//              base.showMsg(msg || "加载失败");
//          });
    }
	
    function addListener() {
		
    }
});
