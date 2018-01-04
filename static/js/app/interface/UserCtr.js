define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
        /**
         * 微信登录
         * @param config: {code,mobile?,smsCaptcha?,userReferee?}
         */
        wxLogin(config) {
            return Ajax.post("805170",{ 
                type: 'wx_h5',
                kind: 'C',
                isNeedMobile: '0',
                isLoginStatus: '1',
                ...config
            });
        },
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
        // 获取用户详情
        getUser(refresh, userId) {
            return Ajax.get("805121", {
                "userId": userId || base.getUserId()
            }, refresh);
        },
        /**
         * 分页查询获客
         * @param config: {code,mobile?,smsCaptcha?,userReferee}
         */
        getPageChildren(config, refresh) {
            return Ajax.get("805120", { 
                userReferee: base.getUserId(),
                ...config
            }, refresh);
        },
        //查询一级和二级推荐人接口
        getPageChildrenLevel(refresh) {
            return Ajax.get("805122", { 
                userId: base.getUserId()
            }, refresh);
        },
        // 绑定手机号
        bindMobile(mobile, smsCaptcha) {
            return Ajax.post("805060", {
                mobile,
                smsCaptcha,
                isSendSms: '0',
                userId: base.getUserId()
            });
        },
        // 设置支付密码
        setTradePwd(tradePwd, smsCaptcha) {
            return Ajax.post('805066', {
                tradePwd,
                smsCaptcha,
                tradePwdStrength: base.calculateSecurityLevel(tradePwd),
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
        // 修改手机号
        changeMobile(newMobile, smsCaptcha) {
            return Ajax.post("805061", {
                newMobile,
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
        // 详情查询银行卡
        getBankCard(code) {
            return Ajax.get("802017", {code});
        },
        // 列表查询银行的数据字典
        getBankList(){
            return Ajax.get("802116");
        },
        // 新增或修改银行卡
        addOrEditBankCard(config) {
            return config.code ? this.editBankCard(config) : this.addBankCard(config);
        },
        // 修改银行卡
        editBankCard(config) {
            return Ajax.post("802012", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 新增银行卡
        addBankCard(config) {
            return Ajax.post("802010", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 列表查询银行卡
        getBankCardList(refresh) {
            return Ajax.get("802016", {
                userId: base.getUserId(),
                status: "1"
            }, refresh);
        },
        /**
         * 分页查询银行卡
         * @param config: {start, limit}
         */
        getPageBankCard(config, refresh) {
            return Ajax.get("802015", {
                userId: base.getUserId(),
                status: "1",
                ...config
            }, refresh);
        },
        // 获取未完成的订单数量
        getUnfinishedOrders() {
            return Ajax.get("622920", {
                applyUser: base.getUserId()
            });
        },
        // 列表查询收货地址
        getAddressList(refresh,config){
            return Ajax.get("805165",{
            	userId: base.getUserId(),
                ...config
            },refresh);
        },
        // 详情收货地址
        getAddressDetail(code){
            return Ajax.get("805166",{code},true);
        },
        // 新增收货地址
        addAddress(config) {
            return Ajax.post("805160", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 修改收货地址
        editAddress(config) {
            return Ajax.post("805162", {
                userId: base.getUserId(),
                ...config
            });
        },
        // 设置默认收货地址
        setDefaultAddress(code) {
            return Ajax.get("805163",{code},true);
        },
        // 删除默认收货地址
        deleteAddress(code) {
            return Ajax.get("805161",{code},true);
        },
        // 获取自提点
        getPagePartner() {
            return Ajax.get("805120", {
            	limit: 1000,
            	start: 1,
            	kind:'PA',
            	status: '0'
            }, true);
        },
        // 分页获取签到记录
        getPageSignIn() {
            return Ajax.get("805145", {
            	limit: 31,
            	start: 1,
            	type:2,
                userId: base.getUserId(),
            }, true);
        },
        //连续签到列表查询
        getSeriesDailyAttendance(dateStart){
            return Ajax.get("805148",{
                userId: base.getUserId(),
                dateStart
            },true);
        },
        //签到
        dailyAttendance(addr){
            return Ajax.get("805140",{
                userId: base.getUserId(),
                location:addr
            },true);
        },
        //签到统计
        getDailyAttendanceSta(accountNumber){
            return Ajax.get("802900",{
                userId: base.getUserId(),
                bizType:'02',
                accountNumber
            },true);
        },
        // 分页查询我的收藏商品
        getPageMallCollect(config,refresh){
            return Ajax.get("808950",{
            	userId: base.getUserId(),
                ...config
            },refresh);
        },
        // 分页查询我的收藏租赁商品
        getPageLeaseCollect(config,refresh){
            return Ajax.get("810950",{
            	userId: base.getUserId(),
                ...config
            },refresh);
        },
        // 分页查询我的收藏资讯
        getPageNewCollect(config,refresh){
            return Ajax.get("801008",{
            	userId: base.getUserId(),
                ...config
            },refresh);
        },
        //分页查询我的收藏活动
        getPageActivityCollect(config,refresh){
            return Ajax.get("808951",{
            	userId: base.getUserId(),
                ...config
            },refresh);
        },
        /**
         * 查询用户芝麻信用
         */
        getZhiMaCredit(){
            return Ajax.get("805196",{
            	userId: base.getUserId()
            },true);
        },
        /**
         * 获取授权芝麻信用链接
         * @param config: {idNo,realName}
         */
        getZhiMaCreditAccreditUrl(config){
            return Ajax.get("805195",{
            	userId: base.getUserId(),
                ...config
            },true);
        },
        //学信网图片上传
        getStuCreditImg(url){
            return Ajax.get("805210",{
            	userId: base.getUserId(),
            	xuexinPic: url
            },true);
        },
        //根据用户编号查询认证记录
        getCreditDetail(type){
            return Ajax.get("805218",{
            	type: type,
            	userId: base.getUserId()
            },true);
        },
        //查询用户免押额度
        getUserJmAmount(){
            return Ajax.get("810059",{
            	userId: base.getUserId()
            },true);
        },
        //设置推荐人
        setUserReferee(mobile){
            return Ajax.get("805083",{
            	refKind: 'C',
            	userId: base.getUserId(),
            	refMobile:mobile
            },true);
        },
    };
})
