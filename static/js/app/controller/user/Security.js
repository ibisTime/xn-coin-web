define([
    'app/controller/base',
    'app/interface/UserCtr'
], function(base, UserCtr) {
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
		$("#left-wrap .security").addClass("on")
    	init();
	}
    
    function init() {
    	base.showLoadingSpin();
    	getUser();
        addListener();
    }
    
    //获取用户详情
    function getUser(){
    	return UserCtr.getUser().then((data)=>{
    		
    		if(data.photo){
    			$("#photo").css({"background-image":base.getAvatar(data.photo)})
    		}else{
    			var tmpl = data.nickname.substring(0,1).toUpperCase();
    			var photoHtml = `<div class="noPhoto">${tmpl}</div>`
    			$("#photo").html(photoHtml)
    		}
    		
    		$("#nickname").text(data.nickname)
    		$("#createDatetime").html(base.formateDateTime(data.createDatetime))
    		$("#mobile").html(base.hideMobile(data.mobile))
    		$("#beiXinRenCount").text(data.userStatistics.beiXinRenCount)
    		$("#jiaoYiCount").text(data.userStatistics.jiaoYiCount)
    		$("#totalTradeCount").text(data.userStatistics.totalTradeCount)
    		
    		if(data.email){
    			$("#email").text("已驗證")
    		}else{
    			$("#email").text("未驗證").addClass("no")
    		}
    		if(data.idNo){
    			$("#idNo").text("已驗證")
    		}else{
    			$("#idNo").text("未驗證").addClass("no")
    		}
    		
    	},base.hideLoadingSpin)
    }
    
    function addListener() {
    }
});
