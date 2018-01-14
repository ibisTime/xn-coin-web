define([
    'app/controller/base',
    'pagination',
	'app/module/validate',
	'app/module/smsCaptcha',
    'app/interface/AccountCtr',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr'
], function(base, pagination, Validate, smsCaptcha, AccountCtr, GeneralCtr, UserCtr) {
	var config={
	    start:1,
        limit:10,
        tradeTppe:0
    }
	init();
    
    function init() {
        $('.titleStatus.over-hide li:nth-child(2)').click(function () {
            $('.titleStatus.over-hide li:first-child').removeClass('on');
            $('.titleStatus.over-hide li:nth-child(2)').addClass('on');
            config.tradeTppe = 1;
            getPageAdvertise();
        })
        $('.titleStatus.over-hide li:first-child').click(function () {
            $('.titleStatus.over-hide li:nth-child(2)').removeClass('on');
            $('.titleStatus.over-hide li:first-child').addClass('on');
            config.tradeTppe = 1;
            getPageAdvertise();
        })
        getUserDetail();
        getPageAdvertise();
        addListener();
    }


    // 获取用户详情
    function getUserDetail() {
        UserCtr.getUser().then((data) => {
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
							<p>${(data.userStatistics.beiHaoPingCount/data.userStatistics.jiaoYiCount*100).toFixed(2)}%</p>
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
            // if(!data.email) {
            //     $('.item.identity').append('<samp>郵箱已驗證</samp>');
            // }else {
            //     $('.item.identity').append('<samp>郵箱未驗證</samp>');
            // }

        $('.nickname.fl.ml20.mr40').append(`${data.nickname}`);
        $('.noPhoto').append(`${data.nickname.substring(0,1)}`);
        });
    }

    function getPageAdvertise() {
        AccountCtr.getPageAdvertise(config).then((data)=> {
            var list = data.list;
            if(data.list.length) {
                var html = '';
                lists.forEach((item, i) => {
                    html+= buildHtmlFlow(item);
                });
                $('.no-data').css('display','none');
                $('#content').append(html);
            }
        })
    }

    function buildHtmlFlow(item){
            return `<tr>
									<td class="currency">ETH</td>
									<td class="payType">銀行轉賬</td>
									<td class="limit">${item.minTrade}-${item.maxTrade}CNY</td>
									<td class="price">5879.98CNY/ETH</td>
									<td class="operation">
										<div class="am-button goHref" data-href="../trade/sell-detail.html">出售</div>
									</td>
								</tr>`
        }


    function addListener() {
    	
    	
    }
});
