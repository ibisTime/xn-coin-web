define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /**
         * 分页查询广告
         * @param config: {start, limit, maxPrice, minPrice,payType,tradeType(0买、1卖)}
         */
        getPageAdvertise(config,refresh) {
            return Ajax.get("625228", config, refresh);
        },
        /**
         * 分页查询广告 带userId
         * @param config: {start, limit, maxPrice, minPrice,payType,tradeType(0买、1卖),userId}
         */
        getPageAdvertiseUser(config,refresh) {
            return Ajax.get("625227",config, refresh);
        },
        /**
         * 发布/编辑广告
         * @param adsCode
         */
        editorAdvertise(config,refresh) {
            return Ajax.get("625220",{
            	userId: base.getUserId(),
                ...config
                });
        },
        // 获取广告详情
        getAdvertiseDetail(adsCode) {
            return Ajax.get("625226", {
            	adsCode
            });
        },
        // 获取广告价格
        getAdvertisePrice() {
            return Ajax.get("625292", {
            	coin:'ETH'
            });
        },
        
    };
})


