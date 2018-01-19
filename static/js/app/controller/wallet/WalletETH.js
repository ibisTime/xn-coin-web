define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base, pagination, Validate, smsCaptcha, AccountCtr, GeneralCtr, UserCtr) {
	var isWithdraw = !!base.getUrlParam("isWithdraw");//提币
	
	var config={
        start: 1,
        limit: 5,
	},
		configAddress={
        start: 1,
        limit: 1,
	},accountNumber;
	
	var bizTypeList={
			"0":"",
			"1":"charge",
			"2":"withdraw",
			"3":"buy",
			"4":"sell",
			"5":"tradefee",
			"6":"withdrawfee",
			"7":"invite",
	}, bizTypeValueList={};
	
	var addAddressWrapperRules = {
			"label": {
        		required: true,
        	},
        	"address": {
        		required: true,
        	},
        	"smsCaptcha": {
        		required: true,
        		sms: true
        	},
        	"tradePwd":{
        		required: true,
        	},
        	"googleCaptcha":{}
	},
		sendOutWrapperRules = {
			"accountNumber": {
        		required: true,
        	},
        	"amount": {
        		required: true,
        		amount: true
        	},
        	"tradePwd":{
        		required: true,
        	},
        	"applyNote":{},
        	"googleCaptcha":{}
	};
	
	
	if(!base.isLogin()){
		base.goLogin()
	}else{
    	init();
	}
    
    function init() {
    	base.showLoadingSpin();
    	$("#wallet-top .eth").addClass("on");
		$("#addWAddressMobile").val(base.getUserMobile())
		if(base.getGoogleAuthFlag()=="true"&&base.getGoogleAuthFlag()){
			$(".googleAuthFlag").removeClass("hidden");
			addAddressWrapperRules["googleCaptcha"]={
        		required: true,
        		sms: true
			}
			sendOutWrapperRules["googleCaptcha"]={
        		required: true,
        		sms: true
			}
		}
		
		GeneralCtr.getDictList({"parentKey":"jour_biz_type"}).then((data)=>{
    		
    		data.forEach(function(item){
    			bizTypeValueList[item.dkey] = item.dvalue
    		})
    		getAccount();
    	},base.hideLoadingSpin)
		
        addListener();
        
        if(isWithdraw){
			$("#address-nav ul li.withdraw").click();
		}
    }
    
    //我的账户
    function getAccount(){
    	return AccountCtr.getAccount().then((data)=>{
    		
    		data.accountList.forEach(function(item){
    			if(item.currency=="ETH"){
    				$(".wallet-account-wrap .amount").text(base.formatMoneySubtract(item.amountString,item.frozenAmountString));
		    		$(".wallet-account-wrap .frozenAmountString").text(base.formatMoney(item.frozenAmountString));
		    		$(".wallet-account-wrap .amountString").text(base.formatMoney(item.amountString));
		    		config.accountNumber=item.accountNumber;
		    		accountNumber=item.accountNumber;
		    		$("#myCoinAddress").text(item.coinAddress);
			    	var qrcode = new QRCode('qrcode',item.coinAddress);
				 	qrcode.makeCode(item.coinAddress);
    			}
    			
    		})
    		getPageFlow(config);
    		base.hideLoadingSpin();
    	},base.hideLoadingSpin)
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
    
    //分页查询地址
    function getPageCoinAddress(params){
    	return AccountCtr.getPageCoinAddress(params, true).then((data)=>{
    		var lists = data.list;
    		if(data.list.length){
                var html = "";
                lists.forEach((item, i) => {
                    html += buildHtmlAddress(item, i);
                });
    			$("#wAddressDialog .list").html(html)
            	config.start == 1 && initPaginationAddress(data);
            }else{
            	config.start == 1 && $(".tradeRecord-list-wrap .list-wrap").empty()
    			config.start == 1 && $("#wAddressDialog .list").html("<div class='tc ptb30 fs13'>暂无地址</div>")
            }
            base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    function buildHtmlAddress(item,i){
    	return `<li data-address="${item.address}" class="${i=='0'?'on':''}">${item.address}</li>`
    }
    
    // 初始化地址分页器
    function initPaginationAddress(data){
        $("#paginationAddress .pagination").pagination({
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
                    getPageCoinAddress(config);
                }
            }
        });
    }
    
    //添加地址
    function addETHCoinAddress(params){
    	return AccountCtr.addETHCoinAddress(params).then((data)=>{
            base.hideLoadingSpin();
    		base.showMsg("操作成功");
    	},base.hideLoadingSpin)
    }
    
    //提现 / 发送
    function withDraw(params){
    	return AccountCtr.withDraw(params).then((data)=>{
            base.hideLoadingSpin();
    		base.showMsg("操作成功");
    	},base.hideLoadingSpin)
    }
    
    function addListener() {
	    smsCaptcha.init({
			bizType: "625203",
			id: "getVerification",
			mobile: "addWAddressMobile",
			errorFn: function(){
			}
		});
    	
    	var _addAddressWrapper = $("#addAddress-form");
	    _addAddressWrapper.validate({
	    	'rules': addAddressWrapperRules,
	    	onkeyup: false
	    });
	    
    	var _sendOutWrapper = $("#sendOut-form");
	    _sendOutWrapper.validate({
	    	'rules': sendOutWrapperRules,
	    	onkeyup: false
	    });
    	
    	$("#address-nav ul li").click(function(){
    		if(!$(this).hasClass("on")){
    			var _this = $(this)
    			//提币/发送 需要验证是否有资金密码 和实名
    			if($(this).hasClass("withdraw")){
    				UserCtr.getUser(true).then((data)=>{
		    			if(data.tradepwdFlag&&data.realName){
                        var index = _this.index()
			    			_this.addClass("on").siblings("li").removeClass("on");
			    			$(".wallet-address .address-Wrap").eq(index).removeClass("hidden").siblings(".address-Wrap").addClass("hidden")
		    			}else if(!data.tradepwdFlag){
		    				base.showMsg("請先設置資金密碼")
		    				setTimeout(function(){
		    					base.gohref("../user/setTradePwd.html?type=1")
		    				},1800)
		    			}else if(!data.realName){
                            base.showMsg("請先进行身份验证")
		    				setTimeout(function(){
		    					base.gohref("../user/identity.html")
		    				},1800)
		    			}
		    		},base.hideLoadingSpin)
    			}else{
    				var index = _this.index()
	    			_this.addClass("on").siblings("li").removeClass("on");
	    			$(".wallet-address .address-Wrap").eq(index).removeClass("hidden").siblings(".address-Wrap").addClass("hidden")
    			}
    			
    		}
    	})
    	
    	$(".tradeRecord-top ul li").click(function(){
    		// if(!$(this).hasClass("on")){
    			var index = $(this).index();
    			$(this).addClass("on").siblings("li").removeClass("on");
    			
    			base.showLoadingSpin();
    			config.bizType = bizTypeList[index];
    			config.start = 1;
    			getPageFlow(config);
    		// }
    	})
    	
    	$("#wAddressDialog .am-modal-body ul").on("click","li",function(){
    		if(!$(this).hasClass("on")){
    			$(this).addClass("on").siblings("li").removeClass("on");
    		}
    	})
    	
    	$("#addWAddressDialog .setSecurityAccount .icon-switch").click(function(){
    		if($(this).hasClass("on")){
    			$(this).removeClass("on");
    			$("#addWAddressDialog .tradePwdFlag").addClass("hidden");
    			addAddressWrapperRules["tradePwd"]={};
    			_addAddressWrapper.validate({
			    	'rules': addAddressWrapperRules,
			    	onkeyup: false
			    });
    		}else{
    			$(this).addClass("on");
    			$("#addWAddressDialog .tradePwdFlag").removeClass("hidden")
    			addAddressWrapperRules["tradePwd"]={
        			required: true,
    			};
    			_addAddressWrapper.validate({
			    	'rules': addAddressWrapperRules,
			    	onkeyup: false
			    });
    		}
    	})
    	
    	$(".dialog .closeBtn").click(function(){
    		$(this).parents(".dialog").addClass("hidden")
    	})
    	
    	//管理地址點擊
    	$("#sendOut-form .addressBtn").click(function(){
    		base.showLoadingSpin();
    		configAddress.start = 1;
    		getPageCoinAddress(configAddress).then(()=>{
    			$("#wAddressDialog").removeClass("hidden")
    		})
    		
    	})
    	
    	//管理地址彈窗-新增地址點擊
    	$("#wAddressDialog .addBtn").click(function(){
    		$("#addWAddressDialog").removeClass("hidden")
    	})
    	
	    //添加地址弹窗-确定点击
	    $("#addWAddressDialog .subBtn").click(function(){
	    	if(_addAddressWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params=_addAddressWrapper.serializeObject();
	    		if($("#addWAddressDialog .setSecurityAccount .icon-switch").hasClass("on")){
	    			params.isCerti = "1"
	    		}else{
	    			params.isCerti = "0"
	    		}
	    		
	    		addETHCoinAddress(params).then(()=>{
			    	_addAddressWrapper.reset();
		    		$("#addWAddressDialog").addClass("hidden")
	    		})
	    	}

    	})
    	
    	//管理地址弹窗-确定点击
	    $("#wAddressDialog .subBtn").click(function(){
			var address= $("#wAddressDialog .am-modal-body ul li.on").attr("data-address")
			$("#sendOut-form .payCardNo").val(address);
			$("#wAddressDialog").addClass("hidden")
    	})
	    
	    // 发送-确定
	    $("#sendOut-form .subBtn").click(function(){
	    	if(_sendOutWrapper.valid()){
	    		base.showLoadingSpin();
	    		var params=_sendOutWrapper.serializeObject();
	    		params.amount = base.formatMoneyParse(params.amount);
	    		params.accountNumber = accountNumber;
	    		params.payCardInfo = 'ETH'
	    		withDraw(params).then(()=>{
			    	_sendOutWrapper.reset();
		    		$("#addWAddressDialog").addClass("hidden")
	    		})
	    	}
    	})
	    
	    $("#head-user-wrap .isTradePwdFlag").click(function(){
    		UserCtr.getUser().then((data)=>{
    			if(data.tradepwdFlag){
    				base.gohref("../wallet/wallet-eth.html?isWithdraw=1")
    			}else{
    				base.showMsg("請先設置資金密碼")
    				setTimeout(function(){
    					base.gohref("../user/setTradePwd.html?type=1")
    				},1800)
    			}
    		},base.hideLoadingSpin)
    	})
    }
});
