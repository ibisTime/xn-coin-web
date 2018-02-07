define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/AccountCtr',
    'app/interface/UserCtr',
    'app/module/tencentCloudLogin'
], function(base, GeneralCtr, AccountCtr, UserCtr, TencentCloudLogin) {

    init();
    
    // 初始化页面
    function init() {
    	base.showLoadingSpin()
    	getCoinList();
    	$("#footTeTui").html(FOOT_TETUI)
		$("#footEmail").html(FOOT_EMAIL)
    	if(base.isLogin()){
    		$("#head-user-wrap .nickname").text(sessionStorage.getItem("nickname"))
    		$("#head-user-wrap").removeClass("hidden");
    		$.when(
    			getAccount(),
    			getBanner()
    		)
    	}else{
    		$("#head-button-wrap").removeClass("hidden");
    		$.when(
    			getBanner()
    		)
    	}
    	addListener();
    }
    
    //根据config配置设置 头部币种下拉
    function getCoinList(){
    	var coinList = COIN_LIST;
    	var buyListHtml = '';
    	var sellListHtml = '';
    	var advListHtml = '';
    	
    	for(var key in coinList){
    		buyListHtml+=`<li class="goHref" data-href="../trade/buy-list.html?coin=${key}">${coinList[key]}</li>`;
    		sellListHtml += `<li class="goHref" data-href="../trade/sell-list.html?coin=${key}">${coinList[key]}</li>`;
    		advListHtml += `<li class="goHref" data-href="../trade/advertise.html?coin=${key}">${coinList[key]}</li>`;
    	}
    	
    	//购买
    	$(".head-nav-wrap .buy .down-wrap ul").html(buyListHtml);
    	//购买
    	$(".head-nav-wrap .sell .down-wrap ul").html(sellListHtml);
    	//购买
    	$(".head-nav-wrap .advertise .down-wrap ul").html(advListHtml);
    }
    
    // 获取banner
    function getBanner(){
        return GeneralCtr.getBanner({}).then((data) => {
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
        }, (msg) => {
            base.showMsg(msg || "加载失败");
        });
    }
    
    //我的账户
    function getAccount(){
    	return AccountCtr.getAccount().then((data)=>{
    		var html = '';
    		data.accountList.forEach(function(item){
    			
    			var className = '', coin='', amount='', frozenAmountString= '';
    			if(item.currency=="ETH"){
    				className = 'eth';
    				coin = 'ETH';
    				amount = base.formatMoneySubtract(item.amountString,item.frozenAmountString);
    				frozenAmountString = base.formatMoney(item.frozenAmountString);
		    		$("#head-user-wrap .wallet .wallet-account-wrap .eth samp").text(base.formatMoney(item.amountString));
    			}else if(item.currency=="SC"){
    				className = 'sc';
    				coin = 'SC';
    				amount = base.formatMoneySubtract(item.amountString,item.frozenAmountString,'SC');
    				frozenAmountString = base.formatMoney(item.frozenAmountString,8,'SC');
		    		$("#head-user-wrap .wallet .wallet-account-wrap .sc samp").text(base.formatMoney(item.amountString,'','SC'));
    			}
    			html += `<div class="list ${className}">
					<p>${coin}</p>
					<p class="amount">${amount}</p>
					<p class="frozenAmountString">${frozenAmountString}</p>
				</div>`;
    		})
    		$("#head-user-wrap .wallet .wallet-account-mx .listWrap").html(html)
    	},base.hideLoadingSpin)
    }
    
    function addListener(){
    	
    	$("#headLogout").click(function(){
    		base.logout()
    	})
    	$(".am-modal-mask").click(function(){
    		$(this).parent(".dialog").addClass("hidden")
    	})
    	
    	$("#head .head-nav-wrap .advertise .goHref").off("click").click(function(){
    		if(!base.isLogin()){
	    		base.goLogin();
	    		return false;
	    	}else{
	    		var thishref = $(this).attr("data-href");
				base.gohref(thishref)
	    	}
    	})
    	
    	$("#head .head-nav-wrap .invitation").off("click").click(function(){
    		if(!base.isLogin()){
	    		base.goLogin();
	    		return false;
	    	}else{
	    		var thishref = $(this).attr("data-href");
				base.gohref(thishref)
	    	}
    	})
    	
    	$("#head-user-wrap .isTradePwdFlag").click(function(){
    		UserCtr.getUser().then((data)=>{
    			if(data.tradepwdFlag&&data.realName){
    				base.gohref("../wallet/wallet-eth.html?isWithdraw=1")
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
    }
});
