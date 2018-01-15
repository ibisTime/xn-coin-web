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
    var coinList = {},payType = {};
	var config={
	    start:1,
        limit:10,
        tradeType:0
    }
	init();
    
    function init() {
        var userId = base.getUrlParam('userId');
        config.userId = userId;
        base.showLoadingSpin();
        $('.titleStatus.over-hide li:nth-child(2)').click(function () {
            $('.titleStatus.over-hide li:first-child').removeClass('on');
            $('.titleStatus.over-hide li:nth-child(2)').addClass('on');
            config.tradeType = 1;
            getPageAdvertise();
        })
        $('.titleStatus.over-hide li:first-child').click(function () {
            $('.titleStatus.over-hide li:nth-child(2)').removeClass('on');
            $('.titleStatus.over-hide li:first-child').addClass('on');
            config.tradeType = 0;
            getPageAdvertise();
        })
        GeneralCtr.getDictList({"parentKey":"coin"}).then((data)=> {
            data.forEach(function (item) {
                coinList[item.dkey] = item.dvalue;
                GeneralCtr.getDictList({"parentKey": "pay_type"}).then((data1) => {
                    data1.forEach(function (item) {
                    payType[item.dkey] = item.dvalue;
                    getPageAdvertise();
                    })
                });
            })
        }, base.hideLoadingSpin);
        getUserDetail(userId);
        addListener();
    }


    // 获取用户详情
    function getUserDetail(userId) {
        UserCtr.getUser1(userId).then((data) => {
            var html = `<div class="item">
							<p>${data.userStatistics.jiaoYiCount}</p>
							<samp>交易次數</samp>
						</div>
						<div class="item">
							<p>${data.userStatistics.beiXinRenCount}</p>
							<samp>信任人數</samp>
						</div>`;


            if(data.userStatistics.beiHaoPingCount && data.userStatistics.jiaoYiCount) {
                var haopingdu = `<div class="item">
							<p>${base.data.userStatistics.beiHaoPingCount}</p>
							<samp>好評度</samp>
						</div>`
            } else {
                var haopingdu = `<div class="item">
							<p>0%</p>
							<samp>好評度</samp>
						</div>`
            }
            $('.statistics').append(html);
            $('.statistics').append(haopingdu);

            if(data.email) {
                $('.item.email').append('<samp>郵箱已驗證</samp>');
            } else {
                $('.item.email').append('<samp>郵箱未驗證</samp>');
            }
            if(data.mobile) {
                $('.item.mobile').append('<samp>手機已驗證</samp>');
            }else {
                $('.item.mobile').append('<samp>手機未驗證</samp>');
            }
            if(data.googleAuthFlag) {
                $('.item.identity').append('<samp>身份已驗證</samp>');
            }else {
                $('.item.identity').append('<samp>身份未驗證</samp>');
            }

        $('.nickname.fl.ml20.mr40').append(`${data.nickname}`);
        $('.fl.tc_red_i').append(`${data.nickname}`);
        $('.noPhoto').append(`${data.nickname.substring(0,1)}`);
        });
    }

    function getPageAdvertise() {
        TradeCtr.getPageAdvertiseUser(config).then((data)=> {
            $('#content').empty();
            var list = data.list;
            if(data.list.length) {
                var html = '';
                list.forEach((item, i) => {
                    html+= buildHtmlFlow(item);
                });
                $('.no-data').css('display','none');
                $('#content').append(html);
            }
        })
    }

    function buildHtmlFlow(item){
            return `<tr>
									<td class="currency">${coinList[item.tradeCoin]}</td>
									<td class="payType">${payType[item.payType]}</td>
									<td class="limit">${item.minTrade}-${item.maxTrade}CNY</td>
									<td class="price">${item.truePrice}CNY/ETH</td>
									<td class="operation">
										<div class="am-button goHref" data-href="../trade/sell-detail.html">出售</div>
									</td>
								</tr>`
        }


    function addListener() {
    	
    	
    }
});
