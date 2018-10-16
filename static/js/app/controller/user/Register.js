define([
    'app/controller/base',
    'swiper',
	'app/module/validate',
    'app/interface/UserCtr',
    'app/interface/GeneralCtr',
	'app/module/smsCaptcha',
], function(base, Swiper, Validate, UserCtr, GeneralCtr,smsCaptcha) {
    var inviteCode = base.getUrlParam("inviteCode") || "";
	
	if(inviteCode!=""){
		$("#userReferee-Wrap").addClass("hidden")
	}
    if(base.isLogin()){
		base.gohref("../user/user.html")
	}else{
    	init();
	}
    
    function init() {
    	$(".head-button-wrap .button-login").removeClass("hidden");
    	base.showLoadingSpin();
    	getSysConfig();
        addListener();
        
    }
    
    function getSysConfig(){
    	return GeneralCtr.getSysConfig("reg_protocol").then((data)=>{
    		$("#content").html(data.cvalue);
    		base.hideLoadingSpin();
		},base.hideLoadingSpin)
    }
	
	function register(params){
		return UserCtr.register(params).then((data)=>{
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
	        	"userReferee": {
	        		mobile: true
	        	},
	    	},
	    	onkeyup: false
	    });
	    
	    // var _registerFormEmail = $("#register-form-email");
	    // _registerFormEmail.validate({
	    // 	'rules': {
	    //     	"nickname": {
	    //     		required: true,
	    //     	},
	    //     	"email": {
	    //     		required: true,
	    //     		mail: true
	    //     	},
	    //     	"captcha": {
	    //     		required: true,
	    //     		sms: true
	    //     	},
	    //     	"loginPwd": {
	    //     		required: true,
	    //     		minlength: 6,
	    //     	},
	    //     	"userReferee": {
	    //     		mobile: true
	    //     	},
	    // 	},
	    // 	onkeyup: false
	    // });
	    
	    $("#subBtn").click(function(){
	    	if(!$(this).hasClass("am-button-disabled")){
	    		// 手機
	    		// if($("#titleWrap .tit.on").index() == 0) {
	    			if(_registerForm.valid()){
			    		base.showLoadingSpin()
			    		var params=_registerForm.serializeObject()
			    		inviteCode!=""&&inviteCode?params.inviteCode = inviteCode:'';
			    		
			    		register(params);
			    	}
    			// 郵箱
	    		// } else {
	    		// 	if(_registerFormEmail.valid()){
		    	// 		base.showLoadingSpin()
			    // 		var params=_registerFormEmail.serializeObject()
			    // 		inviteCode!=""&&inviteCode?params.inviteCode = inviteCode:'';
			    //
			    // 		register(params);
			    // 	}
	    		// }
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
		smsCaptcha.init({
			checkInfo: function() {
				return $("#mobile").valid();
			},
			bizType: "805041",
			id: "getVerification-email",
			mobile: "email",
			errorFn: function(){
			}
		});
	    
	    $('.protocol').click(function () {
	    	$("#registerDialog").removeClass("hidden")
        })
	    
	    $("#titleWrap .tit").click(function() {
	    	var index = $(this).index();
	    	$(this).addClass('on').siblings().removeClass("on");
	    	$("#formWrap form").eq(index).siblings().validate().resetForm();
	    	$("#formWrap form").eq(index).siblings().find('.error').removeClass("error");
	    	$("#formWrap form").eq(index).removeClass('hidden').siblings().addClass("hidden");
	    });
    }
});
