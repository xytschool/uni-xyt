function jsPay(params) {
    if (!WeixinJSBridge) {
        uni.showToast({
            title: "请在微信中打开下单"
        })
        return
    }

    return new Promise(function (resolve, reject) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": params.appId,     //公众号名称，由商户传入
                "timeStamp": params.timestamp,         //时间戳，自1970年以来的秒数
                "nonceStr": params.nonceStr, //随机串
                "package":  params.package,
                "signType": params.signType,         //微信签名方式：
                "paySign": params.paySign, //微信签名
            },
            function (res) {
                resolve(res)
            });
    })
}

function miniPay(res) {
    uni.requestPayment({
        provider: 'wxpay',
        timeStamp: String(Date.now()),
        nonceStr: res.nonce_str,
        package: 'prepay_id=' + res.prepay_id,
        signType: 'MD5',
        paySign: res.sign,
        success: function (res) {
            console.log('success:' + JSON.stringify(res));
        },
        fail: function (err) {
            console.log('fail:' + JSON.stringify(err));
        }
    })
}

module.exports = {
     jsPay, miniPay
}
