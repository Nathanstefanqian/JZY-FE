// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env: 'jzy-2gzzv7vae99329fb',
      traceUser: true
    })
    // openid挂载到全局
    wx.cloud.callFunction({
      name: 'getOpenid',
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
