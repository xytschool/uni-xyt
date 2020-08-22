import wx from 'weixin-js-sdk'

function jsPay(params) {
    return new Promise(function (resolve, reject) {
        console.log('jsPay', params)
        var cfg = {
            timestamp: String(parseInt(Date.now() / 1000)), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: params.nonce_str, // 支付签名随机串，不长于 32 位
            package: 'prepay_id=' + params.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
            signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: params.sign, // 支付签名
            success: function (res) {
                // 支付成功后的回调函数
                resolve(res)
            },
            fail: function (res) {
                console.log(res)
                reject(res)
            }
        }
        console.log('wxPay', cfg)
        wx.chooseWXPay(cfg);
    })
}

function h5Pay(params) {
    console.log(WeixinJSBridge)
    if (!WeixinJSBridge) {
        uni.showToast({
            title: "请在微信中打开下单"
        })
        return
    }

    return new Promise(function (resolve, reject) {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": params.appid,     //公众号名称，由商户传入
                "timeStamp": String(parseInt(Date.now() / 1000)),         //时间戳，自1970年以来的秒数
                "nonceStr": params.nonce_str, //随机串
                "package": 'prepay_id=' + params.prepay_id,
                "signType": "MD5",         //微信签名方式：
                "paySign": params.sign, //微信签名
            },
            function (res) {
                console.log("getbrandWcpayRequest", res)
                resolve(res)
                // if (res.err_msg == "get_brand_wcpay_request:ok") {
                //     // 使用以上方式判断前端返回,微信团队郑重提示：
                //     //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                //     resolve(res)
                // } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                //     reject(res)
                // } else {
                //     reject(res)
                // }
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
    jsPay, h5Pay, miniPay
}
