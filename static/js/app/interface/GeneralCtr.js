define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 发送短信
        sendCaptcha(bizType, mobile, sendCode = '805950') {
            return Ajax.post(sendCode, {
                bizType,
                mobile,
                "kind": "C"
            });
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
            return Ajax.get(code, config);
        },
        // 查询user系统参数
        getUserSysConfig(ckey, refresh) {
            return Ajax.get("805917", {ckey}, refresh);
        },
        // 分页查询user系统参数
        getPageUserSysConfig(config, refresh) {
            return Ajax.get("805915", {
            	start: 1,
            	limit: 100,
            	orderColumn:'id',
            	orderDir:'asc',
                ...config
            }, refresh);
        },
        // 查询account系统参数
        getAccountSysConfig(key, refresh) {
            return Ajax.get("802027", {key}, refresh);
        },
        // 分页查询account系统参数
        getPageAccountSysConfig(config = {start: 1, limit: 100}, refresh) {
            return Ajax.get("802025", config, refresh);
        },
        // 查询业务系统参数
        getBizSysConfig(ckey, refresh) {
            return Ajax.get("622917", {ckey}, refresh);
        },
        // 查询banner列表
        getBanner(config, refresh) {
            return Ajax.get("805806", {
                type: "2",
                ...config
            }, refresh);
        },
    };
})
