define([
    'app/util/ajax'
], function(Ajax) {
    return {
		//更新登录时间
    	updateLoginTime(){
    		return Ajax.get("805083", {
				userId: sessionStorage.getItem("userId")
			}, true)
    	},
    };
})
