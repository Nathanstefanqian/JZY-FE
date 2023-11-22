// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'jzy-1gjdmixbb2d05e5f',
      traceUser: true
    })
    // openid挂载到全局
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
