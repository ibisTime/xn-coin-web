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
            return Ajax.get("625227",{
                ...config,
                refresh,
                });
        },

        reportAdvertise(adsCode,refresh) {
            return Ajax.get("625220",{
                adsCode:adsCode,
                refresh,
                });
        },
    };
})


