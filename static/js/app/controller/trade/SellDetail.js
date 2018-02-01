define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, Validate, GeneralCtr, UserCtr, TradeCtr) {
	var code = base.getUrlParam("code");
	var isDetail = !!base.getUrlParam("isD");//是否我的广告查看详情
	var bizTypeList = {
            "0": "支付宝",
            "1": "微信",
            "2": "银行卡转账"
    	};
    
    var config = {
    	adsCode:code,
    	tradePrice: 0
    }
    	
	init();
    
    function init() {
    	base.showLoadingSpin();
    	$(".head-nav-wrap .buy").addClass("active");
    	
    	if(!isDetail){
    		$(".buy-wrap").removeClass("hidden")
    		$("#chatBtn").removeClass("hidden");
    	}
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
    		
    		config.tradePrice = data.truePrice.toFixed(2);
    		$("#nickname").html(data.user.nickname)
    		if(data.status=="1"&&isDetail){
    			$("#doDownBtn").removeClass("hidden");
    		}
    		$("#jiaoYiCount").html(data.user.userStatistics.jiaoYiCount)
    		$("#beiXinRenCount").html(data.user.userStatistics.beiXinRenCount)
    		$("#beiHaoPingCount").html(base.getPercentum(data.user.userStatistics.beiHaoPingCount,data.user.userStatistics.beiPingJiaCount))
    		$("#totalTradeCount").html(base.formatMoney(data.user.userStatistics.totalTradeCount,'0')+"+ETH")
    		$("#leaveMessage").html(data.leaveMessage.replace(/\n/g,'<br>'))
    		$("#truePrice").html(data.truePrice.toFixed(2))
    		$("#submitDialog .tradePrice").html(data.truePrice.toFixed(2)+"CNY")
    		$("#limit").html(data.minTrade+'-'+data.maxTrade)
    		$("#payType").html(bizTypeList[data.payType])
    		$("#payLimit").html(data.payLimit)
    		
			base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    //出售
    function sellETH(){
    	return TradeCtr.sellETH(config).then((data)=>{
    		base.showMsg("出售成功");
    		setTimeout(function(){
    			base.gohref("../order/order-list.html")
    		},2000)
			base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    	
    }
    
    function addListener() {
    	
    	var _formWrapper = $("#form-wrapper");
    	_formWrapper.validate({
    		'rules': {
    			'buyAmount':{
    				min: '0',
    				amountCny: true
    			},
    			'buyEth':{
    				min: '0',
    				amount: true
    			},
    		}
    	})
    	
    	//立即下单点击
	    $("#buyBtn").click(function(){
	    	if(_formWrapper.valid()){
			    		if($("#buyAmount").val()!=''&&$("#buyAmount").val()){
							$("#submitDialog").removeClass("hidden")
				    	}else{
				    		base.showMsg("請輸入您購買的金額")
				    	}
			    	}
//	    	UserCtr.getUser().then((data)=>{
//  			if(data.tradepwdFlag&&data.realname){
//			    	
//  			}else if(!data.tradepwdFlag){
//  				base.showMsg("請先設置資金密碼")
//  				setTimeout(function(){
//  					base.gohref("../user/setTradePwd.html?type=1")
//  				},1800)
//  			}else if(!data.realname){
//  				base.showMsg("請先进行身份验证")
//  				setTimeout(function(){
//  					base.gohref("../user/identity.html")
//  				},1800)
//  			}
//  		},base.hideLoadingSpin)
    	})
    	
    	//下单确认弹窗-放弃点击
	    $("#submitDialog .closeBtn").click(function(){
			$("#submitDialog").addClass("hidden")
    	})
    	
    	//下单确认弹窗-确认点击
	    $("#submitDialog .subBtn").click(function(){
	    	sellETH()
			$("#submitDialog").addClass("hidden")
    	})
	    
    	$("#buyEth").keyup(function(){
    		$("#buyAmount").val(($("#buyEth").val()*config.tradePrice).toFixed(2));
    		$("#submitDialog .tradeAmount").html($("#buyAmount").val()+"CNY")
    		$("#submitDialog .count").html($("#buyEth").val()+"ETH")
    		config.tradeAmount = $("#buyAmount").val()
    		config.count=base.formatMoneyParse($("#buyEth").val())
    	})
    	$("#buyAmount").keyup(function(){
    		$("#buyEth").val(($("#buyAmount").val()/config.tradePrice).toFixed(8));
    		$("#submitDialog .tradeAmount").html($("#buyAmount").val()+"CNY")
    		$("#submitDialog .count").html($("#buyEth").val()+"ETH")
			config.tradeAmount = $("#buyAmount").val()
    		config.count=base.formatMoneyParse($("#buyEth").val())
    	})
    	//下架-点击
    	$("#doDownBtn").click(function(){
        	base.confirm("確認下架此廣告？").then(()=>{
        		base.showLoadingSpin()
        		TradeCtr.downAdvertise(code).then(()=>{
        			base.hideLoadingSpin();
        			
        			base.showMsg("操作成功");
        			$("#doDownBtn").addClass("hidden")
        		},base.hideLoadingSpin)
        	},base.emptyFun)
		})
    }
});
