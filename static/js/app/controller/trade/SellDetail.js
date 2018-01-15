define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, Validate, GeneralCtr, UserCtr, TradeCtr) {
	var code = base.getUrlParam("code");
	var bizTypeList = {
            "0": "支付宝",
            "1": "微信",
            "2": "银行卡转账"
    	};
    	
	init();
    
    function init() {
    	base.showLoadingSpin();
    	$(".head-nav-wrap .buy").addClass("active");
    	
    	GeneralCtr.getSysConfig("trade_remind").then((data)=>{
    		$("#tradeWarn").html(data.cvalue.replace(/\n/g,'<br>'))
    		getAdvertiseDetail();
    	},base.hideLoadingSpin)
    	
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
    		$("#leaveMessage").html(data.leaveMessage.replace(/\n/g,'<br>'))
    		$("#truePrice").html(data.truePrice)
    		$("#limit").html(data.minTrade+'-'+data.maxTrade)
    		$("#payType").html(bizTypeList[data.payType])
    		$("#payLimit").html(data.payLimit)
    		
			base.hideLoadingSpin();
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
