define([
    'app/controller/base'
], function(base) {
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#wallet-top .eth").addClass("on")
    	init();
	}
    
    function init() {
        addListener();
    }
    
    function addListener() {
    	$("#address-nav ul li").click(function(){
    		if(!$(this).hasClass("on")){
    			var index = $(this).index()
    			$(this).addClass("on").siblings("li").removeClass("on");
    			$(".wallet-address .address-Wrap").eq(index).removeClass("hidden").siblings(".address-Wrap").addClass("hidden")
    		}
    	})
    	
    	$(".tradeRecord-top ul li").click(function(){
    		if(!$(this).hasClass("on")){
    			$(this).addClass("on").siblings("li").removeClass("on");
    		}
    	})
    	
    	$("#wAddressDialog .am-modal-body ul li").click(function(){
    		if(!$(this).hasClass("on")){
    			$(this).addClass("on").siblings("li").removeClass("on");
    		}
    	})
    	
    	$("#addWAddressDialog .setSecurityAccount .icon-switch").click(function(){
    		if($(this).hasClass("on")){
    			$(this).removeClass("on");
    		}else{
    			$(this).addClass("on");
    		}
    	})
    	
    	$(".dialog .closeBtn").click(function(){
    		$(this).parents(".dialog").addClass("hidden")
    	})
    	
    	//管理地址點擊
    	$("#sendOut-form .addressBtn").click(function(){
    		$("#wAddressDialog").removeClass("hidden")
    	})
    	
    	//管理地址彈窗-新增地址點擊
    	$("#wAddressDialog .addBtn").click(function(){
    		$("#addWAddressDialog").removeClass("hidden")
    	})
    	
    }
});
