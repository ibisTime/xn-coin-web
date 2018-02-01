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
        userId:base.getUserId(),
        coin:'ETH'
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
        },base.hideLoadingSpin);

    }


    function buildHtml(item){
    	var operationHtml = ''
    	
    	//待发布
        if(config.statusList == null || config.statusList.length == 1) {
        	operationHtml = `<div class="am-button am-button-red publish mr20">發佈</div>`
        
        //已发布 
        }else{
        	//已上架
	        if(item.status=="1"){
	        	operationHtml = `<div class="am-button am-button-red mr20 doDownBtn" data-code="${item.code}">下架</div>`
	    	}
	        if(type=='buy'){
				operationHtml+=`<div class="am-button goHref" data-href="../trade/buy-detail.html?code=${item.code}&isD=1">查看详情</div>`
	    	}else if(type=='sell'){
				operationHtml+=`<div class="am-button goHref" data-href="../trade/sell-detail.html?code=${item.code}&isD=1">查看详情</div>`
	    	}
        }
    	
        //<td class="type">${adsStatusList[item.tradeType]}</td>
            return `<tr class="goHref" data-href="../trade/advertise-eth.html?code=${item.code}">
					<td class="price">${item.truePrice}</td>
					<td class="price">${(item.premiumRate * 100).toFixed(2) + "%"}</td>
					<td class="createDatetime">${base.formateDatetime(item.createDatetime)}</td>
					<td class="status tc">${adsStatusValueList[item.status]}</td>
					<td class="operation">
						${operationHtml}
					</td>
				</tr>`

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
        	base.showLoadingSpin();
        	getPageAdvertise(true);
        })
		
		$("#content").on("click", ".doDownBtn", function(){
			var adsCode = $(this).attr("data-code");
        	base.confirm("確認下架此廣告？").then(()=>{
        		base.showLoadingSpin()
        		TradeCtr.downAdvertise(adsCode).then(()=>{
        			base.hideLoadingSpin();
        			
        			base.showMsg("操作成功");
        			setTimeout(function(){
			            base.showLoadingSpin();
			            config.start = 1;
			            getPageAdvertise(true)
        			},1500)
        		},base.hideLoadingSpin)
        	},base.emptyFun)
		})
    }
});
