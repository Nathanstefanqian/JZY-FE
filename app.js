// app.js
App({
  onLaunch() {
    wx.cloud.init({
        env: 'cloud1-1ghsd84v3284f24b',
        traceUser: true
    })
  },
  globalData: {
    userInfo: null
  }
})
