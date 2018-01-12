define([
    'app/controller/base',
    'pagination',
], function(base, pagination) {
	var type = base.getUrlParam("type");// buy: 购买，sell:出售
	
	init();
    
    function init() {
    	if(type=='buy'){
			$("#left-wrap .buy-eth").addClass("on")
    	}else if(type=='sell'){
			$("#left-wrap .sell-eth").addClass("on")
    	}
        addListener();
    }
    
    function addListener() {
    	
    }
});
