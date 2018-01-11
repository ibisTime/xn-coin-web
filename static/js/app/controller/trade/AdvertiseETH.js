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
	    $("#buyBtn").click(function(){
			$("#submitDialog").removeClass("hidden")
    	})
    	
    	//下单确认弹窗-放弃点击
	    $("#submitDialog .closeBtn").click(function(){
			$("#submitDialog").addClass("hidden")
    	})
    	
    	//下单确认弹窗-确认点击
	    $("#submitDialog .subBtn").click(function(){
			$("#submitDialog").addClass("hidden")
    	})
	    
    	//選擇切換-点击
	    $(".trade-type .icon-check").click(function(){
	    	$(this).parent(".item").addClass("on").siblings(".item").removeClass("on")
    	})
	    
	    //受信任-点击
    	$(".advertise-set .set-wrap .icon-only").click(function(){
    		if($(this).hasClass("on")){
	    		$(this).removeClass("on");
    		}else{
	    		$(this).addClass("on");
    		}
    	})
    	
    	//開放時間選擇-点击
	    $(".time-type .icon-check").click(function(){
	    	var _this = $(this)
	    	_this.parent(".item").addClass("on").siblings(".item").removeClass("on")
    		if(_this.parent(".item").hasClass("all")){
    			$("#timeWrap").addClass("hide")
    		}else{
    			$("#timeWrap").removeClass("hide")
    		}
	    })
    	
    	//显示高级设置 - 点击
    	$(".advertise-hidden").click(function(){
	    	var _this = $(this)
    		if(_this.hasClass("hide")){
    			$(".advertise-set .set-wrap").removeClass("hidden")
    			_this.removeClass("hide")
    			_this.text("隱藏高級設置...")
    		}else{
    			$(".advertise-set .set-wrap").addClass("hidden")
    			_this.text("顯示高級設置...")
    			_this.addClass("hide")
    		}
	    })
    	
    }
});
