// app.js
App({
  onLaunch() {
    wx.cloud.init({
        env: 'cloud1-1ghsd84v3284f24b',
        traceUser: true
    })
    wx.cloud.callFunction({
      name: 'getOpenId',
      complete: res => {
        console.log(res)
        const { openid } = res.result
        wx.setStorageSync('openid', openid)
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
