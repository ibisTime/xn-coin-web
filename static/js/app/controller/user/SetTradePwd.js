define([
    'app/controller/base',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/UserCtr'
], function(base, Validate,smsCaptcha, UserCtr) {
	var type = base.getUrlParam("type");//设置类型： 0,设置  1，修改 
	var isWallet = !!base.getUrlParam("isWallet");//钱包点击跳转过来
	var _formRules = {
        	"mobile": {
        		required: true
        	},
        	"smsCaptcha": {
        		required: true,
        		sms: true
        	},
        	"tradePwd": {
        		required: true,
        		tradePwdLength: true,
        	},
    	}

	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .security").addClass("on")
    	init();
	}
    
    function init() {
    	if(base.getUserEmail()) {
    		$("#mobile").val(base.getUserEmail())
    	} else {
    		$("#mobile").val(base.getUserMobile())
    	}
    	
    	if(base.getGoogleAuthFlag()=="true" && base.getGoogleAuthFlag()){
			$(".googleAuthFlag").removeClass("hidden");
			_formRules["googleCaptcha"] = {
				required: true,
			}
		}
        base.hideLoadingSpin();
        addListener();
    }
    
    //设置资金密码
    function setTradePwd(params){
    	return UserCtr.setTradePwd(params).then(()=>{
			base.hideLoadingSpin()
			base.showMsg("设置成功")
			setTimeout(function(){
				base.gohrefReplace("../user/security.html")
			},800)
		},base.hideLoadingSpin)
    }
    
    //重设资金密码
    function changeTradePwd(params){
    	return UserCtr.changeTradePwd(params).then(()=>{
			base.hideLoadingSpin()
			base.showMsg("修改成功")
			setTimeout(function(){
				if(isWallet){
					base.gohrefReplace("../wallet/wallet-eth.html?isWithdraw=1")
				}else{
					base.gohrefReplace("../user/security.html")
				}
			},800)
		},base.hideLoadingSpin)
    }
    
    
    function addListener() {
    	var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': _formRules,
	    	onkeyup: false
	    });
    	smsCaptcha.init({
			checkInfo: function() {
				return $("#mobile").valid();
			},
			bizType: type=='1'?"805067":"805066",
			id: "getVerification",
			mobile: "mobile",
			errorFn: function(){
			}
		});
		$("#subBtn").click(function(){
    		if(_formWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params = _formWrapper.serializeObject();
	    		var config = {
	    				smsCaptcha: params.smsCaptcha,
    					googleCaptcha: params.googleCaptcha,
    					type: base.getIdentType($("#mobile").val())
	    			}
	    		
	    		if(type=='0'){
	    			config.tradePwd = params.tradePwd;
	    			setTradePwd(config)
	    		}else if(type=='1'){
	    			config.newTradePwd = params.tradePwd;
	    			changeTradePwd(config)
	    		}
	    		
	    	}
	    })
    }
});
