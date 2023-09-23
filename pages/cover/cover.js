Page({
    onLoad() {
        setTimeout(() => {
            wx.navigateTo({
              url: '../guide/guide'
            })
        }, 2000)
    }
})