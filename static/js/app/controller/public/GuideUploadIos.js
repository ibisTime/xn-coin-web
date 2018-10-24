define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/controller/Top',
], function(base,GeneralCtr, Top) {
	
	init();
    
    function init() {
    	
        setTimeout(function(){
        	base.hideLoadingSpin();
        },100)
        
        addListener();
    }
    
    function addListener() {
    }
});
