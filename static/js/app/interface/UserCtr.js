define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /**
         * 登录
         * @param config {loginName, loginPwd}
         */
        login(config) {
            return Ajax.post("805050", {
                kind: "C",
                ...config
            });
        },
        /**
         * 注册
         * @param config {loginName, loginPwd, nickname, smsCaptcha}
         */
        register(config) {
            return Ajax.post("805041", {
                kind: "C",
                userRefereeKind: "C",
                ...config
            });
        },
        // 获取用户详情
        getUser(refresh, userId) {
            return Ajax.get("805121", {
                "userId": userId || base.getUserId()
            }, refresh);
        },
        // 获取用户详情
        getUser1(userId) {
            return Ajax.get("805121", {
                userId: userId || base.getUserId()
            });
        },
        // 修改密码
        changePwd(oldLoginPwd, newLoginPwd) {
            return Ajax.post('805064', {
                oldLoginPwd,
                newLoginPwd,
                userId: base.getUserId()
            });
        },
        /**
         * 忘記密码/重置密码
         * @param config {mobile, newLoginPwd, smsCaptcha}
         */
        resetPwd(config) {
            return Ajax.post('805063', {
                kind:'C',
            	...config
            });
        },
        //修改/綁定郵箱
        setEmail(email,captcha) {
            return Ajax.post('805081', {
            	email,
            	captcha,
                userId: base.getUserId()
            });
        },
        
        // 设置资金密码
        setTradePwd(tradePwd, smsCaptcha) {
            return Ajax.post('805066', {
                tradePwd,
                smsCaptcha,
                userId: base.getUserId()
            });
        },
        // 重置支付密码
        changeTradePwd(newTradePwd, smsCaptcha) {
            return Ajax.post("805067", {
                newTradePwd,
                smsCaptcha,
                userId: base.getUserId()
            });
        },
        //獲取谷歌密鑰
        getGooglePwd(){
            return Ajax.get("805070");
        },
        /**
         * 開啟谷歌驗證
         * @param config {googleCaptcha, secret, smsCaptcha}
         */
        openGoogle(config) {
            return Ajax.post("805071", {
                userId: base.getUserId(),
            	...config
            });
        },
        /**
         * 關閉谷歌驗證
         */
        closeGoogle(googleCaptcha,smsCaptcha) {
            return Ajax.post("805072", {
                googleCaptcha,
                smsCaptcha,
                userId: base.getUserId()
            });
        },
        // 修改头像
        changePhoto(photo) {
            return Ajax.post("805080", {
                photo,
                userId: base.getUserId()
            });
        },
        /**
         * 分页查询关系
         * @param config {limit, start, userId, type}
         * type=1 信任，type=0，屏蔽
         */
        getPageTrust(config) {
            return Ajax.get("805115", {
                userId: base.getUserId(),
            	...config
            });
        },
    };
})
