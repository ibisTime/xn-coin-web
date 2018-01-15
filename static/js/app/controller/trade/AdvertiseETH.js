define([
    'app/controller/base',
	'app/module/validate',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, Validate, GeneralCtr, UserCtr, TradeCtr) {
	var code = base.getUrlParam("code")||'';
	
	var mid=0;
	
	init();
    
    function init() {
    	base.showLoadingSpin();
    	
    	$.when(
    		GeneralCtr.getSysConfig("trade_remind"),
    		GeneralCtr.getDictList({"parentKey":"trade_time_out"}),
    		TradeCtr.getAdvertisePrice(),
    		getExplain('sell')
    	).then((data1, data2, data3)=>{
    		//说明
    		$("#tradeWarn").html(data1.cvalue.replace(/\n/g,'<br>'));
    		
    		//付款时限
    		var html = ''
    		data2.forEach((item)=>{
    			html+=`<option value="${item.dvalue}">${item.dvalue}</option>`
    		});
    		$("#payLimit").html(html);
    		//价格
    		$("#price").val(data3.mid);
    		mid = data3.mid;
    		
    		base.hideLoadingSpin()
    	},base.hideLoadingSpin)
    	
        addListener();
    }
    
    //获取广告说明 type = buy ,sell
    function getExplain(type){
    	var param = ''
    	if(type=='buy'){
    		param = 'buy_ads_hint'
    	}else if(type=='sell'){
    		param = 'sell_ads_hint'
    	}
    	return GeneralCtr.getSysConfigType(param, true).then((data)=>{
    		$("#displayTimeExp").html(data.displayTime)
    		$("#maxTradeExp").html(data.maxTrade)
    		$("#minTradeExp").html(data.minTrade)
    		$("#payLimitExp").html(data.payLimit)
    		$("#payTypeExp").html(data.payType)
    		$("#premiumRateExp").html(data.premiumRate)
    		$("#priceExp").html(data.price)
    		if(type=='buy'){
	    		$("#protectPriceExp").siblings('.txt').text('最高價格：')
	    	}else if(type=='sell'){
	    		$("#protectPriceExp").siblings('.txt').text('最低價格：')
	    	}
    		$("#protectPriceExp").html(data.protectPrice)
    		$("#trustExp").html(data.trust);
    		base.hideLoadingSpin();
    	},base.hideLoadingSpin)
    }
    
    function addListener() {
    	
    	//立即下单点击
	    $("#buyBtn").click(function(){
			$("#submitDialog").removeClass("hidden")
    	})
    	
    	//下单确认弹窗-放弃点击
	    $("#submitDialog .closeBtn").click(function(){
			$("#submitDialog").addClass("hidden")
    	})
    	
    	//下单确认弹窗-确认点击
	    $("#submitDialog .subBtn").click(function(){
			$("#submitDialog").addClass("hidden")
    	})
	    
    	//選擇切換-点击
	    $(".trade-type .icon-check").click(function(){
	    	var _this = $(this);
	    	base.showLoadingSpin();
	    	//在线出售
	    	if(_this.parent(".item").index()=='0'){
	    		getExplain('sell')
	    		
	    	//在线购买
	    	}else if(_this.parent(".item").index()=='1'){
	    		getExplain('buy')
	    	}
	    	_this.parent(".item").addClass("on").siblings(".item").removeClass("on");
    	})
	    
	    //受信任-点击
    	$(".advertise-set .set-wrap .icon-only").click(function(){
    		if($(this).hasClass("on")){
	    		$(this).removeClass("on");
    		}else{
	    		$(this).addClass("on");
    		}
    	})
    	
    	//開放時間選擇-点击
	    $(".time-type .icon-check").click(function(){
	    	var _this = $(this)
	    	_this.parent(".item").addClass("on").siblings(".item").removeClass("on")
    		if(_this.parent(".item").hasClass("all")){
    			$("#timeWrap").addClass("hide")
    		}else{
    			$("#timeWrap").removeClass("hide")
    		}
	    })
    	
    	//显示高级设置 - 点击
    	$(".advertise-hidden").click(function(){
	    	var _this = $(this)
    		if(_this.hasClass("hide")){
    			$(".advertise-set .set-wrap").removeClass("hidden")
    			_this.removeClass("hide")
    			_this.text("隱藏高級設置...")
    		}else{
    			$(".advertise-set .set-wrap").addClass("hidden")
    			_this.text("顯示高級設置...")
    			_this.addClass("hide")
    		}
	    })
    	
		
		var _formWrapper = $("#form-wrapper");
		_formWrapper.validate({
			'rules': {
	        	"premiumRate": {
	        		required: true,
	        		number: true
	        	},
	        	"protectPrice": {
	        		required: true,
	        		number: true
	        	},
	        	"minTrade": {
	        		required: true,
	        		number: true
	        	},
	        	"maxTrade": {
	        		required: true,
	        		number: true
	        	},
	        	"totalCount": {
	        		required: true,
	        		number: true
	        	},
	        	"payType": {
	        		required: true,
	        	},
	        	"payLimit": {
	        		required: true,
	        	},
	        	"leaveMessage": {
	        		required: true,
	        	},
	    	},
	    	onkeyup: false
		})
		
		//溢价
		$("#premiumRate").keyup(function(){
			if($("#premiumRate").val()==''||!$("#premiumRate").val()){
				$("#price").val(mid);
			}else{
				$("#price").val((mid+mid*($("#premiumRate").val()/100)).toFixed(2));
			}
		})
		
		$("#submitBtn").click(function(){
			if(_formWrapper.valid()){
				
			}
		})
		
    }
});
