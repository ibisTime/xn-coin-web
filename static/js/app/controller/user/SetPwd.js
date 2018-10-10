define([
    'app/controller/base',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/UserCtr'
], function(base, Validate,smsCaptcha, UserCtr) {
	var _formRules = {
        	"oldLoginPwd": {
        		required: true,
        		minlength: 6,
        	},
        	"newLoginPwd": {
        		required: true,
        		minlength: 6,
        	},
        	"renewLoginPwd": {
        		required: true,
        		equalTo: "#newLoginPwd",
        	},
    };

	if(!base.isLogin()){
		base.goLogin(1)
	}else{
		$("#left-wrap .security").addClass("on")
    	init();
	}
    
    function init() {
    	if(base.getGoogleAuthFlag()=="true" && base.getGoogleAuthFlag()){
			$(".googleAuthFlag").removeClass("hidden");
			_formRules["googleCaptcha"] = {
				required: true,
			}
		}
        base.hideLoadingSpin();
        addListener();
    }
    
    //重置密码
    function changePwd(params){
    	return UserCtr.changePwd(params).then(()=>{
			base.hideLoadingSpin()
			base.showMsg("设置成功")
			setTimeout(function(){
				base.logout()
			},800)
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    	console.log(_formRules);
    	var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': _formRules,
	    	onkeyup: false
	    });
		$("#subBtn").click(function(){
    		if(_formWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params=_formWrapper.serializeObject()
	    		
    			changePwd({
    				oldLoginPwd: params.oldLoginPwd,
    				newLoginPwd: params.newLoginPwd,
    				googleCaptcha: params.googleCaptcha
    			})
	    	}
	    })
    }
});
