define([
    'app/controller/base',
    'swiper',
	'app/module/validate',
    'app/interface/UserCtr',
    'app/interface/GeneralCtr',
	'app/module/smsCaptcha',
], function(base, Swiper, Validate, UserCtr, GeneralCtr,smsCaptcha) {
    var userReferee = base.getUrlParam("mobile") || "";
	
    init();
    
    function init() {
    	$(".head-button-wrap .button-login").removeClass("hidden")
        addListener();
        
    }
	
	function register(params){
		return UserCtr.register(params).then((data)=>{
			base.setSessionUser(data)
			base.hideLoadingSpin()
			base.showMsg("注册成功")
			setTimeout(function(){
				base.gohref("../user/login.html")
			},800)
		},base.hideLoadingSpin)
	}
	
    function addListener() {
        var _registerForm = $("#register-form");
	    _registerForm.validate({
	    	'rules': {
	        	"nickname": {
	        		required: true,
	        	},
	        	"mobile": {
	        		required: true,
	        		mobile: true
	        	},
	        	"smsCaptcha": {
	        		required: true,
	        		sms: true
	        	},
	        	"loginPwd": {
	        		required: true,
	        		minlength: 6,
	        	},
	    	},
	    	onkeyup: false
	    });
	    
	    $("#subBtn").click(function(){
	    	if(!$(this).hasClass("am-button-disabled")){
	    		if(_registerForm.valid()){
		    		base.showLoadingSpin()
		    		var params=_registerForm.serializeObject()
		    		userReferee!=""&&userReferee?params.userReferee = userReferee:'';
		    		
		    		register(params);
		    	}
	    	}
	    })
	    
	    $("#subFlag").click(function(){
	    	if($(this).hasClass("active")){
	    		$(this).removeClass("active")
	    		$("#subBtn").addClass("am-button-disabled")
	    	}else{
	    		$(this).addClass("active")
	    		$("#subBtn").removeClass("am-button-disabled")
	    	}
	    })
	    smsCaptcha.init({
			checkInfo: function() {
				return $("#mobile").valid();
			},
			bizType: "805041",
			id: "getVerification",
			mobile: "mobile",
			errorFn: function(){
			}
		});
	    
    }
});
