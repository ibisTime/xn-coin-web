define([
    'app/controller/base',
    'swiper',
	'app/module/validate',
    'app/interface/UserCtr',
    'app/interface/GeneralCtr',
	'app/module/smsCaptcha',
], function(base, Swiper, Validate, UserCtr, GeneralCtr,smsCaptcha) {
    var inviteCode = base.getUrlParam("inviteCode") || "";
	
    if(base.isLogin()){
		base.gohref("../user/user.html")
	}else{
    	init();
	}
    
    function init() {
    	$(".head-button-wrap .button-login").removeClass("hidden");
    	// $('.register-container.minheight').css('margin-top','68px');
        addListener();
        
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
	
	// 獲取註冊協議的詳情
	function getProtocol() {
        GeneralCtr.getProtocol().then((data)=>{
        	console.log(data);
        	var html = data.cvalue;
		})
    }
    function addListener() {
        $(window).off("scroll").on("load", function() {
            if ($(document).scrollTop()>=0) {
                $("#head").addClass("on").css('position','static');
            }else{
                $("#head").removeClass("on")
            }
        });
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
		    		inviteCode!=""&&inviteCode?params.inviteCode = inviteCode:'';
		    		
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
	    
	    $('.protocol').click(function () {
            getProtocol();
        })
    }
});
