define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        // 获取微信sdk初始化的参数
        getInitWXSDKConfig() {
            return Ajax.get("805952", {
                url: location.href.split('#')[0]
            }, true);
        },
        // 获取appId
        getAppId() {
            return Ajax.get("805918", {
                type: "wx_h5"
            }, true);
        },
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
        getBanner(refresh) {
            return Ajax.get("805806", {
                type: "2"
            }, refresh);
        },
        // 分页查询资讯
        getPageInformation(config, refresh) {
            return Ajax.get("801005", {
                status: 1,
            	userId: base.getUserId(),
                ...config
            }, refresh);
        },
        // 分页查询资讯
        getInformationDetail(code) {
            return Ajax.get("801006", {
            	code,
            	userId: base.getUserId()
            }, true);
        },
        /**
         * 收藏
         * @type：类型(P 产品 RP租赁 N 资讯)
         */
        addCollecte(code,type){
        	return Ajax.get("801030", {
        		entityCode:code,
        		interacter: base.getUserId(),
        		type: type,
        		kind:'cl'
        	}, true);
        },
        // 取消收藏
        cancelCollecte(code,type){
        	return Ajax.get("801031", {
        		entityCode:code,
        		interacter: base.getUserId(),
        		type: type,
        		kind:'cl'
        	}, true);
        },
        // 分页查询评论(租赁，商品)
        getPageComment(config, refresh){
            return Ajax.get("801028", config, refresh);
        },
        /**
         * 评论/留言(活动留言)
         * @config：{content,entityCode,parentCode,type}
         */
        comment(config, refresh) {
            return Ajax.get("801020", {
            	userId: base.getUserId(),
                ...config
            }, refresh);
        },
        // 分页查询评论(活动留言)
        getPageActComment(config, refresh){
            return Ajax.get("801029", config, refresh);
        },
    };
})
