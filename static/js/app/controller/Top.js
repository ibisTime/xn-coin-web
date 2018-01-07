define([
    'app/controller/base',
    'app/interface/GeneralCtr',
], function(base, GeneralCtr) {

    init();
    
    // 初始化页面
    function init() {
    	base.showLoadingSpin()
    	if(base.isLogin()){
    		$("#head-user-wrap .nickname").text(sessionStorage.getItem("nickname"))
    		$("#head-user-wrap").removeClass("hidden")
    	}else{
    		$("#head-button-wrap").removeClass("hidden")
    	}
    	getBanner();
    	addListener();
    }
    // 获取banner
    function getBanner(refresh){
        return GeneralCtr.getBanner({},refresh).then((data) => {
        	data.forEach((item) => {
        		if (item.location === 'web_download') {
	            	$('#downImg').attr("src",base.getPic(item.pic));
	        	} else if (item.location === 'web_qq') {
	            	$('#qqImg').attr("src",base.getPic(item.pic));
	        	} else if (item.location === 'web_weibo') {
	            	$('#wbImg').attr("src",base.getPic(item.pic));
	        	} else if (item.location === 'web_wechat') {
	            	$('#wxImg').attr("src",base.getPic(item.pic));
	        	}
        	})
        	base.hideLoadingSpin()
        }, (msg) => {
            base.showMsg(msg || "加载失败");
        });
    }
    function addListener(){
    	
    	$("#headLogout").click(function(){
    		base.logout()
    	})
    	$(".am-modal-mask").click(function(){
    		$(this).parent(".dialog").addClass("hidden")
    	})
    }
});
