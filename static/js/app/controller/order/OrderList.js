define([
    'app/controller/base',
    'pagination',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, pagination, GeneralCtr, UserCtr, TradeCtr) {
	var config={
	    start:1,
        limit:10,
        statusList: ["0","1","5"]
    };
    var statusList={
    	"inProgress":["0","1","5"],
    	"end":["2","3"]
    },
    	typeList={
    	"buy":"購買ETH",
    	"sell":"出售ETH",
    },
    	statusValueList={};
	init();
    
    function init() {
    	base.showLoadingSpin();
    	GeneralCtr.getDictList({"parentKey":"trade_order_status"}).then((data)=>{
    		
    		data.forEach(function(item){
    			statusValueList[item.dkey] = item.dvalue
    		})
    		getPageOrder();
    	},base.hideLoadingSpin)
		
        addListener();
    }
    // 初始化分页器
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
                    getPageOrder(config);
                }
            }
        });
    }
    
    function getPageOrder(){
    	return TradeCtr.getPageOrder(config).then((data)=>{
            var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtml(item);
                });
    			$("#content").html(html)
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
    	var photoHtml = "";
    	if(item.buyUser==base.getUserId()){
    		var user = item.sellUserInfo;
    	}else{
    		var user = item.buyUserInfo;
    	}
    	if(item.photo){
    		photoHtml = `<div class="photo" stype="background-image:url('base.getAvatar(${user.photo})')"></div>`
		}else{
			var tmpl = user.nickname.substring(0,1).toUpperCase();
			photoHtml = `<div class="photo"><div class="noPhoto">${tmpl}</div></div>`
		}
    	
    	return `<tr>
					<td class="nickname">
						<div class="photoWrap fl goHref" data-href="../user/user-detail.html" >
							${photoHtml}
						</div>
						<samp class="name">${user.nickname}</samp>
					</td>
					<!--訂單編號截取后8位展示-->
					<td class="code">${item.code.substring(item.code.length-8)}</td>
					<td class="type">${typeList[item.type]}</td>
					<td class="amount">${item.tradePrice}CNY</td>
					<td class="quantity">${base.formatMoney(item.countString)}ETH</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status">${statusValueList[item.status]}</td>
					<td class="operation">
						<div class="am-button am-button-red">標記付款</div>
						<div class="am-button am-button-gray ml5">取消交易</div>
					</td>
					<td class="goDetail"><i class="icon icon-detail goHref" data-href="../order/order-detail.html?code=${item.code}"></i></td>
				</tr>`;
    }
    

    function addListener() {
        // 切换在线购买和在线出售
        $('.titleStatus.over-hide li').click(function () {
            var _this = $(this)
            _this.addClass("on").siblings('li').removeClass("on");
            config.statusList = statusList[_this.attr("data-status")];
            config.start = 1;
            base.showLoadingSpin();
            getPageOrder(true)
        })
        
    }
});
