define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/interface/GeneralCtr',
    'app/module/qiniu'
], function(base, UserCtr, GeneralCtr, QiniuUpdata) {
	
	if(!base.isLogin()){
		base.goLogin();
		return;
	}
	
	init();
    
    function init() {
    	if($("#head-user-wrap").hasClass("hidden")){
    		$("#head-user-wrap").removeClass("hidden")
    	}
    	base.showLoadingSpin();
        addListener();
    	$.when(
        	getUser(),
        	getUserInviteProfit(),
        	getQiniuToken()
        )
    }
    
    //获取用户详情
    function getUser(){
    	return UserCtr.getUser().then((data)=>{
    		
    		if(data.photo){
    			$("#photo").css({"background-image":"url('"+base.getAvatar(data.photo)+"')"})
    		}else{
    			var tmpl = data.nickname.substring(0,1).toUpperCase();
    			var photoHtml = `<div class="noPhoto">${tmpl}</div>`
    			$("#photo").html(photoHtml)
    		}
    		
    		$("#nickname").text(data.nickname)
    		$("#createDatetime").html(base.formateDatetime(data.createDatetime))
    		$("#mobile").html(base.hideMobile(data.mobile))
    		$("#beiXinRenCount").text(data.userStatistics.beiXinRenCount)
    		$("#jiaoYiCount").text(data.userStatistics.jiaoYiCount)
    		
    		if(data.email){
    			$("#email").text(data.email)
    		}else{
    			$("#email").text("未驗證").addClass("no").click(function () {
                    base.gohref("./setEmail.html");
                });
    		}
    		if(data.idNo){
    			$("#idNo").text("已驗證")
    		}else{
    			$("#idNo").text("未驗證").addClass("no").click(function () {
                    base.gohref("./identity.html");
				});
    		}
    		base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    //获取用户收益
    function getUserInviteProfit(){
    	return UserCtr.getUserInviteProfit().then((data)=>{
    		if(data.length>0){
    			var inviteProfit = data[0].inviteProfit=='0'?'0':base.formatMoney(data[0].inviteProfit,'0',data[0].coin.symbol)+'+';
    			$("#totalTradeCount").html(inviteProfit+data[0].coin.symbol+"<i class='more'>MORE+</i>");
    			
    			var html = '';
    			data.forEach((item)=>{
    				html+=`<tr>
							<td><div class="img"><img src="${base.getPic(item.coin.icon,"?imageMogr2/auto-orient/thumbnail/!150x150r")}"/></div></td>
							<td><div>${item.coin.cname}(${item.coin.symbol})</div></td>
							<td>
								<div>${base.formatMoney(item.inviteProfit,'',item.coin.symbol)}&nbsp;${item.coin.symbol}</div>
							</td>
						</tr>`
    			})
    			$("#inviteProfitList").html(html)
    		}
    		
    		$("#totalTradeCount i.more").on("click",function(){
	    		$("#inviteProfitDialog").removeClass("hidden")
	    	})
    	})
    }
    
    //加载七牛token
	function getQiniuToken(){
		return GeneralCtr.getQiniuToken().then((data)=>{
			var token = data.uploadToken;
			
    		base.showLoadingSpin();
			QiniuUpdata.uploadInit({
	        	btnId:'photoFile',
	        	containerId:'photoFile-wrap',
	        	starBtnId: 'subBtn',
	        	token: token
	        })
        	
			base.hideLoadingSpin();
    	},base.hideLoadingSpin)
	}
    
    function changePhoto(){
		return UserCtr.changePhoto($("#editPhotoDialog .img-wrap .photoWrapSquare .photo").attr("data-src")).then((data)=>{
			base.hideLoadingSpin();
        	$("#editPhotoDialog").addClass("hidden")
			base.showMsg("修改成功");
			setTimeout(function(){
				location.reload(true);
			},800)
    	},base.hideLoadingSpin)
	}
    
    function addListener() {
    	
    	$("#editPhoto").click(function(){
        	$("#editPhotoDialog").removeClass("hidden")
    	})
    	$("#editPhotoDialog .cancelBtn").click(function(){
        	$("#editPhotoDialog").addClass("hidden");
        	$("#editPhotoDialog .img-wrap .photoWrapSquare .photo").attr("data-src","")
        	$("#editPhotoDialog .img-wrap").addClass("hidden")
    	})
    	
    	//选择图片
    	$("#photoFile").bind('change',function(){
        	if($(this).attr("data-src")!=""){
        		var src= $(this).attr("data-src");
	        	$("#editPhotoDialog .img-wrap").removeClass("hidden")
	        	$("#editPhotoDialog .img-wrap .photo").css({"background-image":"url('"+base.getPic(src)+"')"})
	        	$("#editPhotoDialog .img-wrap .photo").attr("data-src",src)
        	}
	        	
        })
    	
    	//提交按钮
    	$("#subBtn").click(function(){
    		var src = $("#editPhotoDialog .img-wrap .photoWrapSquare .photo").attr("data-src")
    		if(src==""||!src){
    			base.showMsg("请选择图片");
    			return;
    		}
    		base.showLoadingSpin();
			changePhoto();
        })
    }
});
