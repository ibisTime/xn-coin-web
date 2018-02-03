define([
    'app/controller/base',
    'app/interface/GeneralCtr'
], function(base,GeneralCtr) {
	
	init();
    
    function init() {
    	
        base.hideLoadingSpin();
        addListener();
    }
    
    function addListener() {
    }
});
