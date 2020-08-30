import wx from 'weixin-js-sdk'



function share(title, desc, link, imageUrl) {

}

function updateShareMenu(title, desc, link, imageUrl) {
    //#ifdef H5
    wx.checkJsApi({
        jsApiList: ['updateTimelineShareData','updateAppMessageShareData', 'onMenuShareAppMessage', 'onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            console.log(res)
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });


    console.log('share 1 ', title, desc, link, imageUrl)
    wx.onMenuShareTimeline({
            title: 'v2'+title, // 分享标题
            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imageUrl, // 分享图标
            success: function () {
                console.log("updateTimelineShareData", res)
                // 用户点击了分享后执行的回调函数
            },
        complete: function (e){
         console.log('complete', e)
         },
        fail: function (e){
          console.log('fail ' ,e)
        }
    })
    wx.onMenuShareTimeline({
        title: 'xx'+title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl, // 分享图标
        success: function (res) {
            console.log("updateAppMessageShareData", res)
            // 设置成功
        },
        complete: function (e){
            console.log('complete', e)
        },
        fail: function (e){
            console.log('fail ' ,e)
        }
    })
    // wx.updateTimelineShareData({
    //     title: 'abc'+title, // 分享标题
    //     link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: imageUrl, // 分享图标
    //     success: function (res) {
    //         console.log("updateTimelineShareData", res)
    //         // 设置成功
    //     },
    //     complete: function (e){
    //        console.log('complete', e)
    //     },
    //     fail: function (e){
    //        console.log('fail ' ,e)
    //     }
    // })
    // wx.updateAppMessageShareData({
    //     title: 'xx'+title, // 分享标题
    //     desc: desc, // 分享描述
    //     link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: imageUrl, // 分享图标
    //     success: function (res) {
    //         console.log("updateAppMessageShareData", res)
    //         // 设置成功
    //     },
    //     complete: function (e){
    //         console.log('complete', e)
    //     },
    //     fail: function (e){
    //         console.log('fail ' ,e)
    //     }
    // })

    //endif
}

module.exports = {
    share, updateShareMenu
}
