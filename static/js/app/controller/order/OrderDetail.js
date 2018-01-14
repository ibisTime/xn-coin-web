define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base, pagination, Validate, smsCaptcha, AccountCtr, GeneralCtr, UserCtr) {
	
	init();
    
    function init() {
        addListener();
        
    }
    
    function addListener() {
    	
    	//立即下单点击
	    $(".orderDetail-middle .title .item").click(function(){
	    	var _this = $(this)
	    	if(!_this.hasClass("on")){
	    		_this.addClass("on").siblings(".item").removeClass("on");
	    		$(".orderDetail-middle .content-wrap .wrap").eq(_this.index())
	    				.removeClass("hidden").siblings(".wrap").addClass("hidden");
	    	}
    	})
    	
    }
});
