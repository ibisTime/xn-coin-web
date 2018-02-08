define([
    'app/controller/base',
    'pagination',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base, pagination, GeneralCtr, UserCtr) {

	var inviteCode = sessionStorage.getItem("inviteCode")
	var config={
        start: 1,
        limit: 3,
	};
	
	init();
    
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
    
    //獲取我推荐的人数和收益统计
    function getInvitation() {
        return UserCtr.getInvitation().then((data)=>{
        	$('.inviteCount').html(data.inviteCount);
        	$('.inviteProfit').html(base.formatMoney(data.inviteProfitEth)+'<i>ETH&nbsp;&nbsp;/&nbsp;&nbsp;</i>'+base.formatMoney(data.inviteProfitSc,'','SC')+'<i>SC</i>');
		},base.hideLoadingSpin)
    }
    
    //活动说明
    function getSysConfig(){
    	return GeneralCtr.getSysConfig("activity_rule").then((data)=>{
    		$(".activity-content").html(data.cvalue.replace(/\n/g,'<br>'));
    		base.hideLoadingSpin();
		},base.hideLoadingSpin)
    }
    
    // 初始化交易记录分页器
    function initPagination(data){
    	$("#pagination .pagination").pagination({
            pageCount: data.totalPage,
            showData: config.limit,
            jump: true,
            coping: true,
            prevContent: '<img src="/static/images/arrow---left.png" />',
            nextContent: '<img src="/static/images/arrow---right.png" />',
            keepShowPN: true,
            totalData: data.totalCount,
            jumpIptCls: 'pagination-ipt',
            jumpBtnCls: 'pagination-btn',
            jumpBtn: '确定',
            isHide: true,
            callback: function(_this){
                if(_this.getCurrent() != config.start){
    				base.showLoadingSpin();
                    config.start = _this.getCurrent();
                    getInvitationHistory(config);
                }
            }
        });
    }
    
    //获取推荐人历史
    function getInvitationHistory(refresh){
    	return UserCtr.getInvitationHistory(config,refresh).then((data)=>{
		var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtml(item);
                });
                $("#userRefereeList").html(html)
    			$("#userRefereeDialog .no-data").addClass("hidden");
            }else{
            	config.start == 1 && $("#userRefereeList").empty()
    			config.start == 1 && $("#userRefereeDialog .no-data").removeClass("hidden");
            }
        	config.start == 1 && initPagination(data);
            base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function buildHtml(item){
    	var photoHtml = ""
    	if(item.photo){
    		photoHtml = `<div class="photo goHref" style="background-image:url('${base.getAvatar(item.photo)}')" data-href="../user/user-detail.html?userId=${item.userId}"></div>`
		}else{
			var tmpl = item.nickname.substring(0,1).toUpperCase();
			photoHtml = `<div class="photo"><div class="noPhoto goHref" data-href="../user/user-detail.html?userId=${item.userId}">${tmpl}</div></div>`
		}
    	
    	return `<tr>
					<td>
						<div class="photoWrap">${photoHtml}</div>
					</td>
					<td><div class="txt1">${item.nickname}</div></td>
					<td class="credit">
						<p>交易${item.userStatistics.jiaoYiCount}&nbsp;·&nbsp;
						好評率${base.getPercentum(item.userStatistics.beiHaoPingCount,item.userStatistics.beiPingJiaCount)}&nbsp;·&nbsp;
						信任${item.userStatistics.beiXinRenCount}</p>
					</td>
					<td>
						<div class="datetime">${base.formatDate(item.createDatetime)}</div>
					</td>
				</tr>`;
    }
    
    function addListener() {
    	$("#qrcodeBtn").click(function(){
    		$("#qrcodeDialog").removeClass("hidden")
    	})
    	$("#invitationBtn").click(function(){
    		$("#invitationDialog").removeClass("hidden")
    	})
    	
    	$("#myInvitationList").click(function(){
    		base.showLoadingSpin();
    		config.start = 1;
    		getInvitationHistory(true).then(()=>{
    			$("#userRefereeDialog").removeClass("hidden")
    		})
    		
    	})
    	
    }
});
