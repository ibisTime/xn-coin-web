define([
    'jquery',
    'app/util/dialog',
    'app/interface/GeneralCtr'
], function ($, dialog, GeneralCtr) {
    function _showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    }
    function initSms(opt){
        this.options = $.extend({}, this.defaultOptions, opt);
        var _self = this;
        var verification = $("#" + _self.options.id);
        verification.text("獲取驗證碼").prop("disabled",false);
        clearInterval(_self.timer);
        $("#" + this.options.id).off("click")
            .on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                mobileValid() && _self.handleSendVerifiy();
            });
        
        function mobileValid() {
        	return $("#" + opt.mobile).valid();
        }
    }
    initSms.prototype.defaultOptions = {
        id: "getVerification",
        mobile: "mobile",
        checkInfo: function () {
            return $("#" + this.mobile).valid();
        }
    };
    initSms.prototype.handleSendVerifiy = function() {
    	var _this = this;
        var verification = $("#" + _this.options.id);
        verification.prop("disabled", true);
        GeneralCtr.sendCaptcha(_this.options.bizType, $("#" + _this.options.mobile).val())
            .then(() => {
                var i = 60;
                _this.timer = window.setInterval(() => {
                    if(i > 0 && verification.attr("disabled")){
                        verification.text("重新發送("+ i-- + "s)");
                    }else {
                        verification.text("獲取驗證碼").prop("disabled",false);
                        clearInterval(_this.timer);
                    }
                }, 1000);
            }, function() {
                _this.options.errorFn && _this.options.errorFn();
                verification.text("獲取驗證碼").prop("disabled",false);
            });
    };
    return {
        init: function (options) {
            new initSms(options);
        }
    }
});
