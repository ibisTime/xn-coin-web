define([
    'app/controller/base',
    'app/interface/GeneralCtr'
], function(base,GeneralCtr) {
	var inviteCode = sessionStorage.getItem("inviteCode")
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
    	init();
	}
    
    function init() {
    	base.showLoadingSpin();
    	$(".head-nav-wrap .invitation").addClass("active");
    	$("#invitationDialog .hrefWrap p").html(DOMAIN_NAME+"/user/register.html?inviteCode="+inviteCode)
    	var qrcode = new QRCode('qrcode',INVITATION_HREF+"/user/register.html?inviteCode="+inviteCode);
	 	qrcode.makeCode(INVITATION_HREF+"/user/register.html?inviteCode="+inviteCode);
    	getSysConfig();
        addListener();
    }
    
    function getSysConfig(){
    	return GeneralCtr.getSysConfig("activity_rule").then((data)=>{
    		$(".activity-content").html(data.cvalue.replace(/\n/g,'<br>'));
    		base.hideLoadingSpin();
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    	$("#qrcodeBtn").click(function(){
    		$("#qrcodeDialog").removeClass("hidden")
    	})
    	$("#invitationBtn").click(function(){
    		$("#invitationDialog").removeClass("hidden")
    	})
    	
    	
    }
});
