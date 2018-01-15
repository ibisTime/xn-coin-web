define([
    'app/controller/base',
    'pagination',
    'app/interface/TradeCtr'
], function(base, pagination, TradeCtr) {
	var config={
        start: 1,
        limit:20,
        tradeType: 1
	};
	var bizTypeList = {
            "0": "支付宝",
            "1": "微信",
            "2": "银行卡转账"
    	};
	
	
	init();
    
    function init() {
    	$(".head-nav-wrap .buy").addClass("active")
    	getPageAdvertise();
        addListener();
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
                    getPageAdvertise(config);
                }
            }
        });
    }
    
    //分页查询广告
    function getPageAdvertise(){
    	return TradeCtr.getPageAdvertise(config, true).then((data)=>{
    		var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtml(item);
                });
    			$("#content").html(html);
    			$(".trade-list-wrap .no-data").addClass("hidden")
            }else{
            	config.start == 1 && $("#content").empty()
    			config.start == 1 && $(".trade-list-wrap .no-data").removeClass("hidden")
            }
            config.start == 1 && initPagination(data);
            base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function buildHtml(item){
    	var photoHtml = ""
    	if(item.photo){
    		photoHtml = `<div class="photo" stype="background-image:url('base.getAvatar(${item.user.photo})')"></div>`
		}else{
			var tmpl = item.user.nickname.substring(0,1).toUpperCase();
			photoHtml = `<div class="photo"><div class="noPhoto">${tmpl}</div></div>`
		}
		
    	return `<tr>
					<td class="nickname">
						<div class="photoWrap fl goHref" data-href="../user/user-detail.html?userId=${item.userId}">
							${photoHtml}
							<div class="dot gray"></div>
						</div>
						<samp class="name">${item.user.nickname}</samp>
					</td>
					<td class="credit">
						<samp>交易<i>${item.user.userStatistics.jiaoYiCount}</i></samp> · <samp>好評率<i>${base.getPercentum(item.user.userStatistics.beiHaoPingCount,item.user.userStatistics.beiPingJiaCount)}</i></samp> · <samp>信任<i>${item.user.userStatistics.beiXinRenCount}</i></samp>
					</td>
					<td class="payType">${bizTypeList[item.payType]}</td>
					<td class="limit">${item.minTrade}-${item.maxTrade}CNY</td>
					<td class="price">${item.protectPrice}CNY</td>
					<td class="operation"><div class="am-button am-button-ghost goHref" data-href="../trade/buy-detail.html?code=${item.code}">購買ETH</div></td>
				</tr>`
    }
    
    function addListener() {
    	$("#searchTypeWrap .select-ul li").click(function(){
    		var _this = $(this);
    		var _thisType= $(this).attr("data-type")
    		
    		if($("#searchTypeWrap .show-wrap").attr("data-type")!=_thisType){
    			$("#searchTypeWrap .show-wrap").attr("data-type",_thisType);
    			$("#searchTypeWrap .show-wrap samp").text(_this.text());
    			$("#searchConWrap ."+_thisType).removeClass("hidden").siblings().addClass("hidden")
    		}
    	})
    }
});
