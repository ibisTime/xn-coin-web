define([
    'app/controller/base',
    'app/interface/GeneralCtr',
], function(base, GeneralCtr) {

    init();
    
    // 初始化页面
    function init() {
    	if(base.isLogin()){
    		$("#goUser").removeClass("hidden")
    	}else{
    		$("#goLogin").removeClass("hidden")
    	}
    	
    	$("#returnBtn").click(function(){
    		base.showLoading();
    		base.clearSessionUser();
    		base.hideLoading();
    		location.href = "./login.html"
    	})
    	
    	var topSearchVal = base.getUrlParam("search")||"";
    	$("#topSearchTxt").val(topSearchVal)
    	
    	$("#topSearchTxt").focus(function(){
    		var _topSearchTxt = $(this)
    		 $(document).keyup(function(event){
				if(event.keyCode==13){
					if($("#topSearchTxt").val()&&$("#topSearchTxt").val()!=""){
						
						location.href = "../travel/search.html?search="+$("#topSearchTxt").val();
					}
				}
			}); 
    	})
    	$("#topSearchTxt").blur(function(){
				if (window.event.keyCode==13) window.event.keyCode=0 ;
    	})
    	
    	$("#topSearchBtn").click(function(){
			if($("#topSearchTxt").val()&&$("#topSearchTxt").val()!=""){
				
				location.href = "../travel/search.html?search="+$("#topSearchTxt").val();
			}
    	})
    	
    	$("#goLogin").click(function(){
    		base.goLogin()
    	})
    }
    
});