define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 发送短信
        sendCaptcha(bizType, mobile, sendCode) {
    		var param={
        		bizType,
        		sendCode
        	}
        	if(sendCode=="805952"){
        		param.email=mobile
        	}else{
        		param.mobile=mobile
        	}
            return Ajax.post(sendCode, param);
        },
        // 获取转化汇率
        getTransRate(fromCurrency, toCurrency) {
            return Ajax.get("002051", {
                fromCurrency,
                toCurrency
            });
        },
        /**
         * 分页查询系统公告
         * @param config {start, limit}
         */
        getPageSysNotice(config, refresh) {
            return Ajax.get("804040", {
                "pushType": 41,
                "toKind": 'C',
                "channelType": 4,
                "status": 1,
                "fromSystemCode": SYSTEM_CODE,
                ...config
            }, refresh);
        },
        // 查询数据字典列表
        getDictList(config,code) {
            return Ajax.get(code||"625907", config);
        },
        // 查询系统参数
        getSysConfig(key, refresh) {
            return Ajax.get("625917", {key}, refresh);
        },
        // 分页查询user系统参数
        getPageSysConfig(config, refresh) {
            return Ajax.get("625915", {
            	start: 1,
            	limit: 100,
            	orderColumn:'id',
            	orderDir:'asc',
                ...config
            }, refresh);
        },
        // 查询banner列表
        getBanner(config, refresh) {
            return Ajax.get("805806", {
                type: "2",
                ...config
            }, refresh);
        }
    };
})
