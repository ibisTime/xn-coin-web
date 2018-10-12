define([
    'app/controller/base',
    'swiper',
	'app/module/validate',
    'app/interface/UserCtr'
], function(base, Swiper, Validate, UserCtr) {
	
	if(base.isLogin()){
		base.gohref("../user/user.html")
	}else{
    	init();
	}
    
    function init() {
    	$(".head-button-wrap .button-register").removeClass("hidden");
        initSwiperBanner();
        addListener();
        setTimeout(function(){
        	base.hideLoadingSpin();
        },100)
    }
    // 初始化swiper
    function initSwiperBanner(){
    	var bannerHtml = "";
        var pics = base.getPicArr(LOGIN_BANNER);
        pics.map((pic) => {
            bannerHtml += `<div class='swiper-slide'><div class="banner" style="background-image:url(${pic});"></div></div>`;
        });
        $("#swiper .swiper-wrapper").html(bannerHtml);
        
        var _swiper = $("#swiper");
        if(_swiper.find('.swiper-slide').length <= 1){
            _swiper.find('.swiper-pagination').hide();
        }
        var mySwiper = new Swiper('#swiper', {
            'autoplay': 5000,
            'pagination': '#swiper',
            'pagination' : '#swiper .swiper-pagination',
            'paginationClickable' :true,
            'preventClicksPropagation': true,
            'loop' : true,
            'speed': 600
        });
    }
	
	function login(params){
		return UserCtr.login(params).then((data)=>{
			base.setSessionUser(data)
			UserCtr.getUser(true).then((item)=>{
				sessionStorage.setItem("nickname",item.nickname);
				sessionStorage.setItem("googleAuthFlag",item.googleAuthFlag);
				sessionStorage.setItem("mobile",item.mobile);
				sessionStorage.setItem("email",item.email);
				sessionStorage.setItem("inviteCode",item.secretUserId);
				base.hideLoadingSpin()
				base.showMsg("登錄成功")
				setTimeout(function(){
					base.goReturn()
				},800)
			})
		},base.hideLoadingSpin)
	}
	
    function addListener() {
        var _loginForm = $("#login-form");
	    _loginForm.validate({
	    	'rules': {
	        	"loginName": {
	        		required: true
	        	},
	        	"loginPwd": {
	        		required: true
	        	},
	    	},
	    	onkeyup: false
	    });
	    
	    $("#subBtn").click(function(){
	    	if(_loginForm.valid()){
	    		base.showLoadingSpin()
	    		var params=_loginForm.serializeObject()
	    		login(params);
	    	}
	    })
	    $(document).keyup(function(event){
			if(event.keyCode==13){
				$("#subBtn").click()
			}
		}); 
	    
	    
    }
});
