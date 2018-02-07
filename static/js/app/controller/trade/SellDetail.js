define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr',
    'app/module/tencentChat'
], function(base, Validate, GeneralCtr, UserCtr, TradeCtr, TencentChat) {
	var code = base.getUrlParam("code");
	var coin = base.getUrlParam("coin") || '0'; // 币种
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
    
	var tradePhoto = '';
	var tradePhotoMy = '';
	var userName = '', myName='';
	var limit = '';
    
    if(!base.isLogin()){
		base.goLogin();
		return;
	}
    
	init();
    
    function init() {
    	base.showLoadingSpin();
    	$(".head-nav-wrap .sell").addClass("active");
    	
    	if(!isDetail){
    		$(".buy-wrap").removeClass("hidden")
    	}
    	GeneralCtr.getSysConfig("trade_remind").then((data)=>{
    		$("#tradeWarn").html(data.cvalue.replace(/\n/g,'<br>'))
			getAdvertiseDetail()
    	}, base.hideLoadingSpin)
    	
        addListener();
        
    }
    
    function getAdvertiseDetail(){
    	return TradeCtr.getAdvertiseDetail(code).then((data)=>{
    		var user = data.user;
    		userName = user.nickname;
			
			if(user.photo) {
				tradePhoto = '<div class="photo goHref" data-href="../user/user-detail.html?userId='+user.userId+'"  style="background-image:url(\''+base.getAvatar(user.photo)+'\')"></div>'
			} else {
				var tmpl = user.nickname.substring(0, 1).toUpperCase();
				tradePhoto = '<div class="photo goHref" data-href="../user/user-detail.html?userId='+user.userId+'" ><div class="noPhoto">'+tmpl+'</div></div>'
			}
    		
    		if(data.user.photo){
    			$("#photo").css({"background-image":"url('"+base.getAvatar(data.user.photo)+"')"})
    		}else{
    			var tmpl = data.user.nickname.substring(0,1).toUpperCase();
    			var photoHtml = `<div class="noPhoto">${tmpl}</div>`
    			$("#photo").html(photoHtml)
    		}
    		
    		config.tradePrice = Math.floor(data.truePrice*100)/100;
    		limit = data.minTrade+'-'+data.maxTrade
    		$("#nickname").html(data.user.nickname)
    		if(data.status=="1"&&isDetail){
    			$("#doDownBtn").removeClass("hidden");
    		}
    		
    		var totalTradeCountETH = data.user.userStatistics.totalTradeCountEth=='0'?'0':base.formatMoney(data.user.userStatistics.totalTradeCountEth,'0')+'+';
    		var totalTradeCountSC = data.user.userStatistics.totalTradeCountSc=='0'?'0':base.formatMoney(data.user.userStatistics.totalTradeCountSc,'0','SC')+'+';
    		
    		$("#jiaoYiCount").html(data.user.userStatistics.jiaoYiCount)
    		$("#beiXinRenCount").html(data.user.userStatistics.beiXinRenCount)
    		$("#beiHaoPingCount").html(base.getPercentum(data.user.userStatistics.beiHaoPingCount,data.user.userStatistics.beiPingJiaCount))
    		$("#totalTradeCount").html(totalTradeCountETH+"ETH/"+totalTradeCountSC+"SC")
    		$("#leaveMessage").html(data.leaveMessage.replace(/\n/g,'<br>'))
    		$("#limit").html(limit)
    		$("#payType").html(bizTypeList[data.payType])
    		$("#payLimit").html(data.payLimit)
    		
    		if(data.tradeCoin=="ETH"){
    			$("#truePrice").html(config.tradePrice+'&nbsp;CNY/ETH')
    			$("#submitDialog .tradePrice").html(config.tradePrice+'&nbsp;CNY/ETH')
    			$("#leftCountString").html(base.formatMoney(data.leftCountString));
    			$("#coin").text('ETH')
    		}else if(data.tradeCoin=="SC"){
    			$("#truePrice").html(config.tradePrice+'&nbsp;CNY/SC')
    			$("#submitDialog .tradePrice").html(config.tradePrice+'&nbsp;CNY/SC')
    			$("#leftCountString").html(base.formatMoney(data.leftCountString,8,'SC'))
    			$("#coin").text('SC')
    		}
    		
    		getUser();
			base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    //获取用户详情
    function getUser(){
    	return UserCtr.getUser().then((data)=>{
    		var myInfo=data;
    		myName = myInfo.nickname;
    		if(myInfo.photo) {
				tradePhotoMy = '<div class="photo" style="background-image:url(\''+base.getAvatar(myInfo.photo)+'\')"></div>'
			} else {
				var tmpl = myInfo.nickname.substring(0, 1).toUpperCase();
				tradePhotoMy = '<div class="photo"><div class="noPhoto">'+tmpl+'</div></div>'
			}
			
			//聊天框加载
	    	TencentChat.addCont({
	    		tradePhoto: tradePhoto,
				tradePhotoMy : tradePhotoMy,
				userName : userName,
				myName : myName,
				truePrice: config.tradePrice+' CNY/ETH',
				limit: limit+' CNY',
	    		success: function(){
	    			$("#chatBtn").removeClass("hidden")
	    		}
	    	});
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
    				amountEth: true
    			},
    		}
    	})
    	
    	//立即下单点击
	    $("#buyBtn").click(function(){
//	    	if(_formWrapper.valid()){
//	    		if($("#buyAmount").val()!=''&&$("#buyAmount").val()){
//					$("#submitDialog").removeClass("hidden")
//		    	}else{
//		    		base.showMsg("請輸入您購買的金額")
//		    	}
//	    	}
	    	UserCtr.getUser().then((data)=>{
    			if(data.tradepwdFlag&&data.realName){
			    	if(_formWrapper.valid()){
			    		if($("#buyAmount").val()!=''&&$("#buyAmount").val()){
							$("#submitDialog").removeClass("hidden")
				    	}else{
				    		base.showMsg("請輸入您購買的金額")
				    	}
			    	}
    			}else if(!data.tradepwdFlag){
    				base.showMsg("請先設置資金密碼")
    				setTimeout(function(){
    					base.gohref("../user/setTradePwd.html?type=1")
    				},1800)
    			}else if(!data.realName){
    				base.showMsg("請先进行身份验证")
    				setTimeout(function(){
    					base.gohref("../user/identity.html")
    				},1800)
    			}
    		},base.hideLoadingSpin)
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
    		$("#submitDialog .count").html($("#buyEth").val()+ COIN_LIST[coin])
    		config.tradeAmount = $("#buyAmount").val()
    		config.count=base.formatMoneyParse($("#buyEth").val())
    	})
    	$("#buyAmount").keyup(function(){
    		$("#buyEth").val(($("#buyAmount").val()/config.tradePrice).toFixed(8));
    		$("#submitDialog .tradeAmount").html($("#buyAmount").val()+"CNY")
    		$("#submitDialog .count").html($("#buyEth").val()+ COIN_LIST[coin])
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
        			$("#doDownBtn").addClass("hidden");
        			
        			setTimeout(function(){
        				base.gohref("./sell-list.html")
        			},1000)
        		},base.hideLoadingSpin)
        	},base.emptyFun)
		})
    	
    	//聊天按钮点击
    	$("#chatBtn").click(function(){
    		base.showLoadingSpin();
    		// 购买开始聊天，提交交易订单
    		TradeCtr.chatOrderSell(code).then((data)=>{
    			TencentChat.showCont({
    				code: data.code,
    			})
	    	},base.hideLoadingSpin)
    		
    	})
    }
});
