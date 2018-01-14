define([
    'app/controller/base',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'pagination',
], function(base, AccountCtr,GeneralCtr, pagination) {
	var type = base.getUrlParam("type");// buy: 购买，sell:出售
	var adsStatusValueList = {};
	var config={
	    start:1,
        limit:10,
        tradeType: 1,
        statusList: [0]
    }
	init();

    function init() {
        base.showLoadingSpin();
    	if(type=='buy'){
			$("#left-wrap .buy-eth").addClass("on");
			config.tradeType = 0;
    	}else if(type=='sell'){
			$("#left-wrap .sell-eth").addClass("on")
    	}
    	$('.wait').click(function () {
            $('.wait').addClass('on');
            $('.already').removeClass('on');
            config.statusList = [0];
        })
        $('.already').click(function () {
            $('.already').addClass('on');
            $('.wait').removeClass('on');
            config.statusList = [1,2,3];
            getPageAdvertise();
        })
        GeneralCtr.getDictList({"parentKey":"ads_status"}).then((data)=>{
            data.forEach(function(item){
            adsStatusValueList[item.dkey] = item.dvalue;
            getPageAdvertise();
        },base.hideLoadingSpin);
        addListener();
    	});
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


// 获取广告列表
    function getPageAdvertise() {
        return AccountCtr.getPageAdvertise(config).then((data)=>{
            var lists = data.list;
            if(data.list.length) {
                var html = '';
                lists.forEach((item, i) => {
                    html+= buildHtmlFlow(item);
                });
                $('.no-data').css('display','none');
                $('#content').append(html);
            }
            config.start == 1 && initPaginationFlow(data);
        });
    }


    function buildHtmlFlow(item){
        if(config.statusList.length = 1) {
            return `<tr>
					<td class="type">${item.tradeType}</td>
					<td class="price">${item.truePrice}</td>
					<td class="price">${(item.premiumRate * 100).toFixed(2) + "%"}</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status">${item.status}</td>
					<td class="operation">
						<div class="am-button am-button-ghost">發佈</div>
					</td>
				</tr>`
        }else {
            return `<tr>
					<td class="type">${item.tradeType}</td>
					<td class="price">${item.truePrice}</td>
					<td class="price">${(item.premiumRate * 100).toFixed(2) + "%"}</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status">${item.status}</td>
				</tr>`
        }

    }

    function addListener() {
    	
    }
});
