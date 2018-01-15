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

        reportAdvertise(config) {
            return Ajax.post("625227", {
                userId: base.getUserId(),
                // coin: 'ETH',
                ...config
        },true);
        },
    };
})


