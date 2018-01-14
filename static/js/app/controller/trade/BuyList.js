define([
    'app/controller/base',
    'pagination',
    'app/interface/TradeCtr'
], function(base, pagination, TradeCtr) {
	var config={
        start: 1,
        limit: 1,
        tradeType: 1
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
    
    //分页查询我的账户流水
    function getPageAdvertise(){
    	return TradeCtr.getPageAdvertise(config, true).then((data)=>{
    		var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtml(item);
                });
    			$("#content").html(html)
            }else{
            	config.start == 1 && $("#content").empty()
            }
            config.start == 1 && initPagination(data);
            base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function buildHtml(item){
    	return `<tr>
					<td class="nickname">
						<div class="photoWrap fl goHref" data-href="../user/user-detail.html">
							<div class="photo"><div class="noPhoto">J</div></div>
							<div class="dot gray"></div>
						</div>
						<samp class="name">junxi</samp>
					</td>
					<td class="credit">
						<samp>交易<i>134</i></samp> · <samp>好評度<i>100%</i></samp> · <samp>信任<i>284</i></samp>
					</td>
					<td class="payType">現金存款</td>
					<td class="limit">100000-10000000CNY</td>
					<td class="price">100541.15CNY</td>
					<td class="operation"><div class="am-button am-button-ghost goHref" data-href="../trade/buy-detail.html">購買ETH</div></td>
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
