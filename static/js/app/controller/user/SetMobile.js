define([
    'app/controller/base',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/UserCtr'
], function(base, Validate,smsCaptcha, UserCtr) {
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .security").addClass("on")
    	init();
	}
    
    function init() {
        base.hideLoadingSpin();
        addListener();
    }
    
    //修改/綁定郵箱
    function setMobile(newMobile, smsCaptcha){
    	return UserCtr.setMobile(newMobile, smsCaptcha).then(()=>{
			base.hideLoadingSpin()
			sessionStorage.setItem("mobile", newMobile);
			base.showMsg("设置成功")
			setTimeout(function(){
				base.gohrefReplace("../user/security.html")
			},800)
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    	var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': {
	        	"newMobile": {
	        		required: true,
	        		mobile: true
	        	},
	        	"smsCaptcha": {
	        		required: true,
	        		sms: true
	        	},
	    	},
	    	onkeyup: false
	    });
    	smsCaptcha.init({
			checkInfo: function() {
				return $("#newMobile").valid();
			},
			bizType: "805061",
			id: "getVerification",
			mobile: "newMobile",
			errorFn: function(){
			}
		});
		$("#subBtn").click(function(){
    		if(_formWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params=_formWrapper.serializeObject()
    			setMobile(params.newMobile,params.smsCaptcha)
	    	}
	    })
    }
});
