define([
    'jquery',
    'app/util/cookie',
    'app/util/dialog',
    'app/module/loading',
    'app/util/ajax',
    'BigDecimal',
], function($, CookieUtil, dialog, loading, Ajax, BigDecimal) {
	var userMobile;

    if (Number.prototype.toFixed) {
        var ori_toFixed = Number.prototype.toFixed;
        Number.prototype.toFixed = function() {
            var num = ori_toFixed.apply(this, arguments);
            if (num == 0 && num.indexOf('-') == 0) { // -0 and 0
                num = num.slice(1);
            }
            return num;
        }
    }
    
    $("body").on("click",".goHref", function(){
    	var thishref = $(this).attr("data-href");
    	if(thishref!=""&&thishref){
			Base.gohref(thishref)
    	}
    })

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    $.prototype.serializeObject = function() {
        var a, o, h, i, e;
        a = this.serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = e.value;
            }
        }
        return o;
    };

    var Base = {
        formatDate: function(date, format){
        	var format = format|| 'yyyy-MM-dd';
            return date ? new Date(date).format(format) : "--";
        },
        formateDatetime: function(date){
	        return date ? new Date(date).format("yyyy-MM-dd hh:mm:ss") : "--";
	    },
        getUrlParam: function(name, locat) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var locat = locat?"?"+locat.split("?")[1]:'';
            var r = (locat?locat:window.location.search).substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return '';
        },
        findObj: function(array, key, value, key2, value2) {
            var i = 0,
                len = array.length,
                res;
            for (i; i < len; i++) {
                if (array[i][key] == value && !key2) {
                    return array[i];
                } else if (key2 && array[i][key] == value && array[i][key2] == value2) {
                    return array[i];
                }
            }
        },
        formatMoney: function(s, t) {
            if(!$.isNumeric(s))
                return "-";
		    if (t == '' || t == null || t == undefined || typeof t == 'object') {
		        t = 8;
		    }
		    //保留8位小数
		    s = new BigDecimal.BigDecimal(s);
		    s = s.divide(new BigDecimal.BigDecimal("1e18"), t||8, BigDecimal.MathContext.ROUND_DOWN).toString();
		    return s;
        },
        //减法 s1-s2
        formatMoneySubtract: function(s1, s2) {
            if(!$.isNumeric(s1)||!$.isNumeric(s2))
                return "-";
		    var s1 = new BigDecimal.BigDecimal(s1);
            var s2 = new BigDecimal.BigDecimal(s2);
            return Base.formatMoney(s1.subtract(s2).toString());
        },
        //金额放大
        formatMoneyParse: function(m, r) {
            var r = r || new BigDecimal.BigDecimal("1e18");
			m = new BigDecimal.BigDecimal(m);
			m = m.multiply(r).toString();
		    return m;
        },
        calculateSecurityLevel: function(password) {
            var strength_L = 0;
            var strength_M = 0;
            var strength_H = 0;

            for (var i = 0; i < password.length; i++) {
                var code = password.charCodeAt(i);
                // 数字
                if (code >= 48 && code <= 57) {
                    strength_L++;
                    // 小写字母 大写字母
                } else if ((code >= 65 && code <= 90) ||
                    (code >= 97 && code <= 122)) {
                    strength_M++;
                    // 特殊符号
                } else if ((code >= 32 && code <= 47) ||
                    (code >= 58 && code <= 64) ||
                    (code >= 94 && code <= 96) ||
                    (code >= 123 && code <= 126)) {
                    strength_H++;
                }
            }
            // 弱
            if ((strength_L == 0 && strength_M == 0) ||
                (strength_L == 0 && strength_H == 0) ||
                (strength_M == 0 && strength_H == 0)) {
                return "1";
            }
            // 强
            if (0 != strength_L && 0 != strength_M && 0 != strength_H) {
                return "3";
            }
            // 中
            return "2";
        },
        calculateDays: function(start, end){
            if(!start || !end)
                return 0;
            start = new Date(start);
            end = new Date(end);
            return (end - start) / (3600 * 24 * 1000);
        },
        getPic: function(pic, suffix){
            if(!pic){
                return "";
            }
            pic = pic.split(/\|\|/)[0];
            if(!/^http|^data:image/i.test(pic)){
            	suffix = suffix||"?imageMogr2/auto-orient/interlace/1"
                pic = PIC_PREFIX + pic + suffix;
            }
            return pic;
        },
        getPicArr: function(pic, suffix){
            if(!pic){
                return [];
            }
            return pic.split(/\|\|/).map(function(p) {
                return Base.getPic(p, suffix);
            });
        },
        getAvatar: function(pic,suffix){
            var defaultAvatar = __inline("../images/default-avatar.png");
            var suffix = suffix||PHOTO_SUFFIX;
            if(!pic){
                pic = defaultAvatar;
            }
            return Base.getPic(pic, suffix);
        },
        getPicList: function(pic){
	        if(!pic)
	            return "";
	        pic = pic.split(/\|\|/)[0];
	        return (PIC_PREFIX + pic + '?imageMogr2/auto-orient/thumbnail/!123x100r');
	    },
        getDomain: function() {
            return location.origin;
        },
        isNotFace: function(value) {
            var pattern = /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]*$/;
            return pattern.test(value)
        },
        showMsg: function(msg, time) {
            var d = dialog({
                content: msg,
                quickClose: true
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, time || 1500);
        },
        makeReturnUrl: function(param) {
            var url = location.pathname + location.search;
            if(param){
                var str = "";
                for(var n in param){
                    str += "&" + n + "=" + param[n];
                }
                if(/\?/i.test(url)){
                    url = url + str;
                }else{
                    url = url + "?" + str.substr(1, str.length);
                }
            }
            return encodeURIComponent(url);
        },
        goBack: function() {
            window.history.back();
        },
        goReturn: function() {
            var returnUrl = sessionStorage.getItem("l-return");
            sessionStorage.removeItem("l-return");
        	Base.gohref(returnUrl || "../index.html");
        },
        isLogin: function() {
            return !!sessionStorage.getItem("userId");
        },
        goLogin: function(flag){
        	Base.clearSessionUser();
        	if(flag){
        		sessionStorage.removeItem("l-return");
        	}else{
            	sessionStorage.setItem("l-return", location.pathname + location.search);
        	}
            Base.gohref("../user/login.html");
        },
        getUserId: function() {
            return sessionStorage.getItem("userId");
        },
        getUserMobile: function() {
            return sessionStorage.getItem("mobile");
        },
        getToken: function() {
            return sessionStorage.getItem("token");
        },
        //谷歌验证
        getGoogleAuthFlag: function() {
            return sessionStorage.getItem("googleAuthFlag");
        },
        setSessionUser: function(data) {
            sessionStorage.setItem("userId", data.userId);
            sessionStorage.setItem("token", data.token);
        },
        clearSessionUser: function() {
            sessionStorage.removeItem("userId"); //userId
            sessionStorage.removeItem("token"); //token
            sessionStorage.removeItem("googleAuthFlag"); //token
            sessionStorage.removeItem("mobile"); //token
            sessionStorage.removeItem("nickname"); //token
        },
        //登出
        logout: function() {
            Base.clearSessionUser();
            Base.gohref("../user/login.html");
        },
        confirm: function(msg) {
            return (new Promise(function (resolve, reject) {
                var d = dialog({
                    content: msg,
                    ok: function () {
                        var that = this;
                        setTimeout(function () {
                            that.close().remove();
                        }, 1000);
                        resolve();
                        return true;
                    },
                    cancel: function () {
                        reject();
                        return true;
                    },
                    cancelValue: '取消',
                    okValue: '确定'
                });
                d.showModal();
            }));

        },
        showLoading: function(msg){
            loading.createLoading(msg);
        },
        hideLoading: function(){
            loading.hideLoading();
        },
        showLoadingSpin: function(){
            $("#loadingSpin").removeClass("hidden");
        },
        hideLoadingSpin: function(){
            $("#loadingSpin").addClass("hidden");
        },
        getDictList: function(code,type){
            return Ajax.get(code, {
                parentKey: type
            });
        },
        getDictListValue: function(dkey,arrayData){//类型
			for(var i = 0 ; i < arrayData.length; i++ ){
				if(dkey == arrayData[i].dkey){
					return arrayData[i].dvalue;
				}
			}
		},
		format2line: function(num,cont){//超过num个字符多余"..."显示
	        return cont
	            ? cont.length > num
	                ? cont.substring(0, num) + "..."
	                : cont
	            : "";
	    },
	    emptyFun: function () {

        },
        //获取地址json
        getAddress: function() {
            var addr = localStorage.getItem("addr");
            if (addr) {
                var defer = jQuery.Deferred();
                addr = $.parseJSON(addr);
                if (!addr.citylist) {
                    addr = $.parseJSON(addr);
                }
                defer.resolve(addr);
                return defer.promise();
            } else {
                return $.get("/static/js/lib/city.min.json")
                    .then(function(res) {
                        if (res.citylist) {
                            localStorage.setItem("addr", JSON.stringify(res));
                            return res;
                        }
                        localStorage.setItem("addr", JSON.stringify(res));
                        return $.parseJSON(res);
                    });
            }
        },
        /* 
		* url 目标url 
		* arg 需要替换的参数名称 
		* arg_val 替换后的参数的值 
		* return url 参数替换后的url 
		*/ 
        changeURLArg: function(url,arg,arg_val){ 
		    var pattern=arg+'=([^&]*)'; 
		    var replaceText=arg+'='+arg_val; 
		    if(url.match(pattern)){ 
		        var tmp='/('+ arg+'=)([^&]*)/gi'; 
		        tmp=url.replace(eval(tmp),replaceText); 
		        return tmp; 
		    }else{ 
		        if(url.match('[\?]')){ 
		            return url+'&'+replaceText; 
		        }else{ 
		            return url+'?'+replaceText; 
		        } 
		    } 
		    return url+'\n'+arg+'\n'+arg_val; 
		},
        //跳转 location.href
        gohref: function(href){
        	var timestamp = new Date().getTime();
        	//判断链接后是否有带参数
        	if(href.split("?")[1]){
        		//判断是否有带v的参数，有则替换v的参数
        		if(Base.getUrlParam("v",href)!=""&&Base.getUrlParam("v",href)){
	        		location.href = Base.changeURLArg(href,"v",timestamp)
	        	}else{
	        		location.href = href+"&v="+timestamp
	        	}
    		}else{
        		location.href = href+"?v="+timestamp
    		}
        },
        //跳转 location.replace
        gohrefReplace: function(href){
        	var timestamp = new Date().getTime();
        	//判断链接后是否有带参数
        	if(href.split("?")[1]){
        		//判断是否有带v的参数，有则替换v的参数
        		if(Base.getUrlParam("v",href)!=""&&Base.getUrlParam("v",href)){
	        		location.replace(Base.changeURLArg(href,"v",timestamp))
	        	}else{
	        		location.replace(href+"&v="+timestamp)
	        	}
    		}else{
        		location.replace(href+"?v="+timestamp)
    		}
        },
        //隐藏手机号中间4位
        hideMobile: function(mobile){
        	var mobile = mobile.substring(0, 3) + "****" + mobile.substring(7, 11)
        	return mobile;
        }
    };
    return Base;
});