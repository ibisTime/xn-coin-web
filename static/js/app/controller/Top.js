define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/AccountCtr',
    'app/interface/UserCtr',
], function(base, GeneralCtr, AccountCtr, UserCtr) {

    init();
    
    // 初始化页面
    function init() {
    	base.showLoadingSpin()
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
        	base.hideLoadingSpin()
        }, (msg) => {
            base.showMsg(msg || "加载失败");
        });
    }
    
    //我的账户
    function getAccount(){
    	return AccountCtr.getAccount().then((data)=>{
    		
    		data.accountList.forEach(function(item){
    			if(item.currency=="ETH"){
    				$("#head-user-wrap .wallet .wallet-account-mx .eth .amount").text(base.formatMoneySubtract(item.amountString,item.frozenAmountString));
		    		$("#head-user-wrap .wallet .wallet-account-mx .eth .frozenAmountString").text(base.formatMoney(item.frozenAmountString));
		    		$("#head-user-wrap .wallet .wallet-account-wrap .eth samp").text(base.formatMoney(item.amountString));
    			}
    			
    		})
    	},base.hideLoadingSpin)
    }
    
    function addListener(){
    	
    	$("#headLogout").click(function(){
    		base.logout()
    	})
    	$(".am-modal-mask").click(function(){
    		$(this).parent(".dialog").addClass("hidden")
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
