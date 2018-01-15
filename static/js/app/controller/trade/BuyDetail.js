define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, pagination, Validate, GeneralCtr, UserCtr, TradeCtr) {
	var code = base.getUrlParam("code");
	
	init();
    
    function init() {
    	base.showLoadingSpin();
    	$(".head-nav-wrap .buy").addClass("active");
    	getAdvertiseDetail();
        addListener();
        
    }
    
    function getAdvertiseDetail(){
    	return TradeCtr.getAdvertiseDetail(code).then((data)=>{
    		if(data.user.photo){
    			$("#photo").css({"background-image":"url('"+base.getAvatar(data.user.photo)+"')"})
    		}else{
    			var tmpl = data.user.nickname.substring(0,1).toUpperCase();
    			var photoHtml = `<div class="noPhoto">${tmpl}</div>`
    			$("#photo").html(photoHtml)
    		}
    		
    		$("#nickname").html(data.user.nickname)
    		$("#jiaoYiCount").html(data.user.userStatistics.jiaoYiCount)
    		$("#beiXinRenCount").html(data.user.userStatistics.beiXinRenCount)
    		$("#beiHaoPingCount").html(base.getPercentum(data.user.userStatistics.beiHaoPingCount,data.user.userStatistics.beiPingJiaCount))
    		$("#totalTradeCount").html(base.formatMoney(data.user.userStatistics.totalTradeCount,'0')+"+ETH")
			
    	},base.hideLoadingSpin)
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
    	
    }
});
