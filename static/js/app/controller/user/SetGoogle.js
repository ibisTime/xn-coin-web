define([
    'app/controller/base',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/UserCtr',
    'app/controller/Top',
], function(base, Validate, smsCaptcha, UserCtr, Top) {
	var type = base.getUrlParam("type");//设置类型： 0,開啟  1，關閉
	var secretRules = {}
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .security").addClass("on")
    	init();
	}
    
    function init() {
    	if(base.getUserMobile()) {
    		$("#mobile").val(base.getUserMobile())
    	} else {
    		$("#mobile").val(base.getUserEmail())
    	}
    	base.showLoadingSpin();
    	if(type == '0') {
    		secretRules = {
    			required: true
    		}
    		$(".secretFlag").removeClass("hidden");
    		getGooglePwd();
    	} else {
    		base.hideLoadingSpin()
    	}
        addListener();
    }
    
    //開啟
    function openGoogle(params){
    	return UserCtr.openGoogle(params).then(()=>{
			base.hideLoadingSpin()
			sessionStorage.setItem("googleAuthFlag", 'true');
			base.showMsg("開啟成功");
			setTimeout(function(){
				base.gohrefReplace("../user/security.html")
			},800)
		},base.hideLoadingSpin)
    }
    
    //關閉
    function closeGoogle(params){
    	return UserCtr.closeGoogle(params).then(()=>{
			base.hideLoadingSpin()
			sessionStorage.setItem("googleAuthFlag",'false');
			base.showMsg("關閉成功")
			setTimeout(function(){
				base.gohrefReplace("../user/security.html")
			},800)
		},base.hideLoadingSpin)
    }
    
    function getGooglePwd(){
    	return UserCtr.getGooglePwd().then((data)=>{
    		$("#secret").val(data.secret)
    		base.hideLoadingSpin();
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    	var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': {
	        	"secret": secretRules,
	        	"googleCaptcha": {
	        		required: true,
	        	},
	        	"mobile": {
	        		required: true,
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
				return $("#mobile").valid();
			},
			bizType: type=='1'?"805072":"805071",
			id: "getVerification",
			mobile: "mobile",
			errorFn: function(){
			}
		});
		$("#subBtn").click(function(){
    		if(_formWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params = _formWrapper.serializeObject();
	    			params.type = base.getIdentType($("#mobile").val())
	    		if(type=='0'){
		    		params.secret = $("#secret").val();
	    			openGoogle(params)
	    		}else if(type=='1'){
	    			closeGoogle(params)
	    		}
	    	}
	    })
    }
});
