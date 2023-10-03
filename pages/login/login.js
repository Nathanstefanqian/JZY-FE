Page({
    register() {
        wx.navigateTo({
          url: '../register/register',
        })
    },
    onLogin() {
      wx.switchTab({
        url: '../home/home',
      })
    }
})