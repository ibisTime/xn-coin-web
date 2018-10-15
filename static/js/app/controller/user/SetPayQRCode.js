define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/module/qiniu'
], function(base, Validate, GeneralCtr, UserCtr, QiniuUpdata) {
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .security").addClass("on");
    	init();
	}
    
    function init() {
        base.hideLoadingSpin();
        getQiniuToken();
        addListener();
    }

    //加载七牛token
    function getQiniuToken(){
        return GeneralCtr.getQiniuToken().then((data)=>{
            var token = data.uploadToken;

            QiniuUpdata.uploadInit({
                btnId:'photoFile',
                containerId:'photoFile-wrap',
                token: token
            })

            base.hideLoadingSpin();
        },base.hideLoadingSpin)
    }
    
    //修改/綁定支付宝
    function setPayQRCode(config){
    	return UserCtr.setEmail(config).then(()=>{
			base.hideLoadingSpin();
			base.showMsg("设置成功");
			setTimeout(function(){
				base.gohrefReplace("../user/security.html")
			},800)
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    	var _formWrapper = $("#form-wrapper");
	    _formWrapper.validate({
	    	'rules': {
	        	"payAccount": {
	        		required: true
	        	}
	    	},
	    	onkeyup: false
	    });

		$("#subBtn").click(function(){
    		if(_formWrapper.valid()){

                var payAccountQr = $(".payAccountQr-wrap .img-wrap .photoWrapSquare .photo").attr("data-src");
                if(payAccountQr =="" || !payAccountQr){
                    base.showMsg('請上傳支付寶二維碼圖片');
                    return;
                }
	    		base.showLoadingSpin();
	    		var params = _formWrapper.serializeObject();
                params.payAccountQr = payAccountQr;
                setPayQRCode(params);
	    	}
	    })

        //选择图片
        $("#photoFile").bind('change',function(){
            if($(this).attr("data-src")!=""){
                var src= $(this).attr("data-src");
                $(".payAccountQr-wrap .img-wrap").removeClass("hidden")
                $(".payAccountQr-wrap .img-wrap .photo").css({"background-image":"url('"+base.getPic(src)+"')"})
                $(".payAccountQr-wrap .img-wrap .photo").attr("data-src",src)
            }
        })
    }
});
