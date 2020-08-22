import wx from 'weixin-js-sdk'



function share(title, desc, link, imageUrl) {

}

function updateShareMenu(title, desc, link, imageUrl) {
    //#ifdef H5
    console.log(title, desc, link, imageUrl)
    wx.updateTimelineShareData({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl, // 分享图标
        success: function (res) {
            console.log("updateTimelineShareData", res)
            // 设置成功
        }
    })
    wx.updateAppMessageShareData({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl, // 分享图标
        success: function (res) {
            console.log("updateAppMessageShareData", res)
            // 设置成功
        }
    })

    //endif

    // wx.onMenuShareTimeline({
    //     title: title, // 分享标题
    //     desc: desc, // 分享描述
    //     link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: imageUrl, // 分享图标
    //     success: function (res) {
    //         console.log("updateTimelineShareData", res)
    //         // 设置成功
    //     }
    // })
    //
    // wx.onMenuShareAppMessage({
    //     title: title, // 分享标题
    //     desc: desc, // 分享描述
    //     link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    //     imgUrl: imageUrl, // 分享图标
    //     success: function (res) {
    //         console.log("updateAppMessageShareData", res)
    //         // 设置成功
    //     }
    // })




}

module.exports = {
    share, updateShareMenu
}
