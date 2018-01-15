define([
    'app/controller/base',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/TradeCtr',
    'pagination',
], function(base, AccountCtr,GeneralCtr,TradeCtr, pagination) {
	var type = base.getUrlParam("type");// buy: 购买，sell:出售
	var adsStatusValueList = {}; // 廣告狀態
	var adsStatusList = {        // 廣告類型
	    "0": '購買',
        "1": '出售'
    }
	var config={
	    start:1,
        limit:10,
        tradeType: 1,
        statusList: [0],
        userId:base.getUserId()
    }
    var publishConfig = {
        publishType:'2',
        adsCode:null,
        leaveMessage:null,
        maxTrade:null,
        minTrade:null,
        onlyTrust:null,
        payLimit:null,
        payType:null,
        premiumRate:null,
        protectPrice:null,
        totalCount:null,
        tradeCoin:null,
        tradeCurrency:null,
        tradeType:null
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

        GeneralCtr.getDictList({"parentKey":"ads_status"}).then((data)=>{
            data.forEach(function(item){
                adsStatusValueList[item.dkey] = item.dvalue;
            });
            getPageAdvertise();
    	},base.hideLoadingSpin);
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


// 获取广告列表
    function getPageAdvertise(refresh) {
        return TradeCtr.getPageAdvertiseUser(config,refresh).then((data)=>{
            $('#content').empty();
            $('.no-data').css('display','block');
            var lists = data.list;
            if(data.list.length) {
                var html = '';
                lists.forEach((item, i) => {
                    item.status = +item.status
                    html+= buildHtmlFlow(item);
                });
                $('.no-data').css('display','none');
                $('#content').append(html);
            }
            config.start == 1 && initPagination(data);
        });
    }


    function buildHtmlFlow(item){
        if(config.statusList == null || config.statusList.length == 1) {
            return `<tr>
					<td class="type">${adsStatusList[item.tradeType]}</td>
					<td class="price">${item.truePrice}</td>
					<td class="price">${(item.premiumRate * 100).toFixed(2) + "%"}</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status">${adsStatusValueList[item.status]}</td>
					<td class="operation">
						<div class="am-button am-button-ghost publish" data-adsCode="${item.code}" data-leaveMessage="${item.leaveMessage}"
						data-maxTrade="${item.maxTrade}"
						data-minTrade="${item.minTrade}"
						data-onlyTrust="${item.onlyTrust}"
						data-payLimit="${item.payLimit}"
						data-payType="${item.payType}"
						data-premiumRate="${item.premiumRate}"
						data-protectPrice="${item.protectPrice}"
						data-totalCount="${item.totalCountString}"
						data-tradeCoin="${item.tradeCoin}"
						data-tradeCurrency="${item.tradeCurrency}"
						data-tradeType="${item.tradeType}"">發佈</div>
					</td>
				</tr>`
        }else {
            return `<tr>
					<td class="type">${adsStatusList[item.tradeType]}</td>
					<td class="price">${item.truePrice}</td>
					<td class="price">${(item.premiumRate * 100).toFixed(2) + "%"}</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status">${adsStatusValueList[item.status]}</td>
				</tr>`
        }

    }

    function addListener() {
        
        $(".titleStatus li").click(function(){
        	var _this = $(this)
        	_this.addClass("on").siblings('li').removeClass("on");
        	if(_this.hasClass("wait")){
        		config.statusList = ['0'];
        	}else if(_this.hasClass('already')){
        		config.statusList = ['1','2','3'];
        	}
        	config.start = 1;
        	getPageAdvertise(true);
        })
        //
        $('#content').on("click",".am-button.am-button-ghost.publish", function(){
        	base.confirm("確認發佈嗎").then(()=>{
                publishConfig.adsCode = $(this).attr("data-adsCode")
                publishConfig.leaveMessage = $(this).attr("data-leaveMessage");
                publishConfig.maxTrade = $(this).attr("data-maxTrade");
                publishConfig.minTrade = $(this).attr("data-minTrade");
                publishConfig.onlyTrust = $(this).attr("data-onlyTrust");
                publishConfig.payLimit = $(this).attr("data-payLimit");
                publishConfig.payType = $(this).attr("data-payType");
                publishConfig.premiumRate = $(this).attr("data-premiumRate");
                publishConfig.protectPrice = $(this).attr("data-protectPrice");
                publishConfig.totalCount = $(this).attr("data-totalCount");
                publishConfig.tradeCoin = $(this).attr("data-tradeCoin");
                publishConfig.tradeCurrency = $(this).attr("data-tradeCurrency");
                publishConfig.tradeType = $(this).attr("data-tradeType");
        		console.log(publishConfig);
        		TradeCtr.reportAdvertise(publishConfig).then((data)=> {
        		    console.log(data);
                })
        	},()=>{})
        })
    }
});
