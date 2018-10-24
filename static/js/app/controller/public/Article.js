define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/controller/Top',
], function(base,GeneralCtr, Top) {
	var key = base.getUrlParam("key");
	
	init();
    
    function init() {
    	base.showLoadingSpin();
    	getSysConfig();
        addListener();
    }
    
    function getSysConfig(){
    	return GeneralCtr.getSysConfig(key).then((data)=>{
    		$("title").html(data.remark+"-KKKOTC");
    		$("#content").html(data.cvalue);
    		base.hideLoadingSpin();
		},base.hideLoadingSpin)
    }
    
    function addListener() {
    }
});
