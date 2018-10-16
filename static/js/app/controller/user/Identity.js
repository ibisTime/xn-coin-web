define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/UserCtr'
], function(base, Validate, UserCtr) {
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .identity").addClass("on")
    	init();
	}
    
    function init() {
    	base.showLoadingSpin();
    	getUser();
        addListener();
    }
    
    //获取用户详情
    function getUser(refresh){
    	return UserCtr.getUser(refresh).then((data)=>{
    		
//  		if(data.realName){
//  			$("#form-wrapper").setForm(data);
//  			$("#alreadyIdentity").removeClass("hidden")
//  		}else{
//  			$("#goAppIdentity").removeClass("hidden")
//  		}
			if(data.realName){
				$(".authentication-btn").removeClass('hidden');
    			$("#form-wrapper").setForm(data);
    			$("#realName").attr('disabled', true);
    			$("#idNo").attr('disabled', true);
		    	$("#form-wrapper .form-btn-item").addClass('hidden');
	    	} else {
		    	$("#form-wrapper .form-btn-item").removeClass('hidden');
	    	}
    		
        	base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function setIdNo(params){
    	return UserCtr.setIdNo(params).then(() => {
    		base.hideLoadingSpin();
    		base.showMsg('認證成功！');
    		
    		setTimeout(function(){
				if (sessionStorage.getItem("l-return")) {
                    base.goReturn();
				} else {
                    getUser(true);
				}
    		}, 1200);
    	}, base.hideLoadingSpin)
    }
    
    function addListener() {
        var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': {
	        	"realName": {
	        		required: true
	        	},
	        	"idNo": {
	        		required: true,
	        		isIdCardNo: true
	        	},
	    	},
	    	onkeyup: false
	    });
	    
	    $("#subBtn").click(function(){
	    	var params = _formWrapper.serializeObject();
	    	if(_formWrapper.valid()){
	    		base.showLoadingSpin();
	    		setIdNo(params);
	    	}
	    })
    }
});
