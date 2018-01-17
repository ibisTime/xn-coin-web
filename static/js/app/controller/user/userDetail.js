define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
    'app/interface/TradeCtr'
], function(base, pagination, Validate, smsCaptcha, AccountCtr, GeneralCtr, UserCtr, TradeCtr) {
	
    var userId = base.getUrlParam('userId');
    var coinList = {},payType = {};
	var config={
	    start:1,
        limit:10,
        tradeType:0,
        userId:userId
    }
    var relationConfig = {
    	toUser: userId
    }
	init();
    
    function init() {
        base.showLoadingSpin();
        
		// 查询币种和付款方式
		$.when(
			GeneralCtr.getDictList({"parentKey":"coin"}),
			GeneralCtr.getDictList({"parentKey": "pay_type"}),
			getUserRelation(),
       		getUserDetail()
		).then((data1,data2)=>{
			data1.forEach(function (item) {
                coinList[item.dkey] = item.dvalue;
            })
			data2.forEach(function (item) {
            	payType[item.dkey] = item.dvalue;
            })
			getPageAdvertise();
			
		},base.hideLoadingSpin)
        addListener();
    }


    // 查询用户的信任关系
    function getUserRelation(){
        return UserCtr.getUserRelation(userId).then((data)=> {

            $('.infoWrap .trust').attr('data-isTrust',data.isTrust);
            $('.infoWrap .trust').append($('.infoWrap .trust').attr('data-isTrust')!='0'?'已信任':'信任');

            $('.infoWrap .black').attr('data-isAddBlackList',data.isAddBlackList);
            $('.infoWrap .black').append($('.infoWrap .black').attr('data-isAddBlackList')!='0'?'已拉黑':'屏蔽');

    	},()=>{})
    }
    // 获取用户详情
    function getUserDetail() {
		return UserCtr.getUser1(userId).then((data) => {
            var html = `<div class="item">
							<p>${data.userStatistics.jiaoYiCount}</p>
							<samp>交易次數</samp>
						</div>
						<div class="item">
							<p>${data.userStatistics.beiXinRenCount}</p>
							<samp>信任人數</samp>
						</div>
                        <div class="item">
                            <p>${base.getPercentum(data.userStatistics.beiHaoPingCount,data.userStatistics.beiHaoPingCount)}</p>
                             <samp>好評度</samp>
                        </div>`;



        var photoHtml = ""
        // 头像
        if(data.photo){
            photoHtml = `<div class="photo" style="background-image:url('${base.getAvatar(data.photo)}')"></div>`
        }else{
            var tmpl = data.nickname.substring(0,1).toUpperCase();
            photoHtml = `<div class="photo"><div class="noPhoto">${tmpl}</div></div>`
        }

        $('.statistics').append(html);

// 邮箱验证，手机验证，身份验证
        $('.item.email').append(data.email?'<samp>郵箱已驗證</samp>':'<samp>郵箱未驗證</samp>');

        $('.item.mobile').append(data.mobile?'<samp>手機已驗證</samp>':'<samp>手機未驗證</samp>');

        $('.item.identity').append(data.googleAuthFlag?'<samp>身份已驗證</samp>':'<samp>身份未驗證</samp>');

        // 昵称
        $('.nickname.fl.ml20.mr40').append(`${data.nickname}`);
        // ___发布的广告
        $('.fl.tc_red_i').append(`${data.nickname}`);
        // 头像
        $('.photoWrap').append(`${photoHtml}`);
        
    	},()=>{});
    }
    
	// 分页查广告
    function getPageAdvertise() {
        TradeCtr.getPageAdvertiseUserStatus(config, true).then((data)=> {
            $('#content').empty();
            $('.no-data').css('display','block');
            var list = data.list;
            if(data.list.length) {
                var html = '';
                list.forEach((item, i) => {
                    html+= buildHtmlFlow(item);
                });
                $('.no-data').css('display','none');
                $('#content').append(html);
            }
	        config.start == 1 && initPagination(data);
        },base.hideLoadingSpin)
    }

    function buildHtmlFlow(item){
        if(config.tradeType == 1){
            return `<tr>
						<td class="currency">${coinList[item.tradeCoin]}</td>
						<td class="payType">${payType[item.payType]}</td>
						<td class="limit">${item.minTrade}-${item.maxTrade}CNY</td>
						<td class="price">${item.truePrice}CNY/ETH</td>
						<td class="operation">
							<div class="am-button goHref" data-href="../trade/buy-detail.html?code=${item.code}">購買</div>
						</td>
					</tr>`
        }else {
            return `<tr>
						<td class="currency">${coinList[item.tradeCoin]}</td>
						<td class="payType">${payType[item.payType]}</td>
						<td class="limit">${item.minTrade}-${item.maxTrade}CNY</td>
						<td class="price">${item.truePrice}CNY/ETH</td>
						<td class="operation">
							<div class="am-button goHref" data-href="../trade/sell-detail.html?code=${item.code}">出售</div>
						</td>
					</tr>`
        }

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
                    getPageAdvertise();
                }
            }
        });
    }
    function addListener() {
        // 切换在线购买和在线出售
        $('.titleStatus.over-hide li').click(function () {
            var _this = $(this)
            _this.addClass("on").siblings('li').removeClass("on");
            if(_this.hasClass("sell")) {
                config.tradeType = 1;
            }else if(_this.hasClass("buy")) {
                config.tradeType = 0;
            }
            getPageAdvertise();
        })
        
        // 信任按钮的点击事件
        $('.infoWrap .trust').click(function () {
            if(base.getUserId()){
                relationConfig.type = '1';
                var _this = $(this);
                if(_this.attr("data-isTrust")=='1') {
                    base.showLoadingSpin();
                    UserCtr.removeUserRelation(relationConfig,true).then((data)=>{
                        _this.empty().append('信任');
                        base.showMsg('已取消信任');
                    },base.hideLoadingSpin())
                } else {
                    base.showLoadingSpin();
                    UserCtr.addUserRelation(relationConfig,true).then((data)=>{
                        _this.empty().append('已信任');
                        if($('.infoWrap .black').attr("data-isAddBlackList")=='1') {
                            $('.infoWrap .black').empty().append('屏蔽');
                            $('.infoWrap .black').attr("data-isAddBlackList",!_this.attr("data-isAddBlackList"))
                        }
                        base.showMsg('已信任');
                    },base.hideLoadingSpin())
                }
                _this.attr("data-isTrust",_this.attr("data-isTrust")=='1'?'0':'1');
            }else {
                base.showMsg('您未登錄');
                setTimeout(function () {
                    base.gohref("../user/login.html")
                },500)
            }
        })
        // 屏蔽按钮的点击事件
        $('.infoWrap .black').click(function () {
            if(base.getUserId()){
                relationConfig.type = '0';
                var _this = $(this);
                if(_this.attr("data-isAddBlackList")=='1') {
                    base.showLoadingSpin();
                    UserCtr.removeUserRelation(relationConfig,true).then((data)=>{
                        _this.empty().append('屏蔽');
                    base.showMsg('已取消拉黑');

                },base.hideLoadingSpin())
                }else {
                    base.showLoadingSpin();
                    UserCtr.addUserRelation(relationConfig,true).then((data)=>{
                        _this.empty().append('已拉黑');
                        if($('.infoWrap .trust').attr("data-isTrust")=='1') {
                            $('.infoWrap .trust').empty().append('信任');
                            $('.infoWrap .trust').attr("data-isTrust",!_this.attr("data-isTrust"))
                        }
                        base.showMsg('已拉黑');
                    },base.hideLoadingSpin())
                }
                _this.attr("data-isAddBlackList",_this.attr("data-isAddBlackList")=='1'?'0':'1');
            }else {
                base.showMsg('您未登錄');
                setTimeout(function () {
                    base.gohref("../user/login.html")
                },500)
            }
        })
    }
});
