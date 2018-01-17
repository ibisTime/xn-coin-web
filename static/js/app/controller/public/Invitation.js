define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base,GeneralCtr,UserCtr) {

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
        getInvitation();
        addListener();
    }
    
    function getInvitation() {
        return UserCtr.getInvitation().then((data)=>{
        	$('.inviteCount').append(data.inviteCount);
        	$('.inviteProfit').append(data.inviteProfit);
		},base.hideLoadingSpin)
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
