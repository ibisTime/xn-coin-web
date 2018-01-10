define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base, pagination, Validate, smsCaptcha, AccountCtr, GeneralCtr, UserCtr) {
	
	init();
    
    function init() {
    	$(".head-nav-wrap .buy").addClass("active")
        addListener();
        
    }
    
    // 初始化交易记录分页器
    function initPaginationFlow(data){
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
                    getPageFlow(config);
                }
            }
        });
    }
    
    //分页查询我的账户流水
    function getPageFlow(params){
    	return AccountCtr.getPageFlow(params, true).then((data)=>{
    		var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtmlFlow(item);
                });
    			$(".tradeRecord-list-wrap .list-wrap").html(html)
    			$(".tradeRecord-list-wrap .no-data").addClass("hidden");
            }else{
            	config.start == 1 && $(".tradeRecord-list-wrap .list-wrap").empty()
    			config.start == 1 && $(".tradeRecord-list-wrap .no-data").removeClass("hidden");
            }
            
            config.start == 1 && initPaginationFlow(data);
            base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function buildHtmlFlow(item){
    	return `<div class="list-item">
					<div>${base.formateDatetime(item.createDatetime)}</div>
					<div>${bizTypeValueList[item.bizType]}</div>
					<div>${base.formatMoney(item.transAmountString)}</div>
					<div>${item.bizNote}</div>
				</div>`
    }
    
    function addListener() {
    	
    }
});
