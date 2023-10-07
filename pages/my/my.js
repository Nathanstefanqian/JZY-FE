// pages/my/my.js
Page({
  data: {
    isLogin: wx.getStorageSync('isLogin')
  },

  onLoad() {

  },

  onEdit() {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },

  onTap() {
    wx.navigateTo({
      url: '../star/star',
    })
  },

  onExit() {
    wx.clearStorageSync()
    wx.setStorageSync('isLogin', false)
    wx.showToast({title: '退出成功'})
  },

  onLogin(e) {
    wx.cloud.callFunction({
      name: 'test',
      success: res => {
        const data = res.result[0]
        if(data) {
          for(const key in data) {
            wx.setStorageSync(key, data[key])
            wx.setStorageSync('isLogin', true)
          }
        }
        else {
          wx.showModal({ title: '快去注册！', content: '当前账号没有注册，是否注册？',
          success: res => {
            if(res.confirm) {
              wx.navigateTo({
                url: '../edit/edit',
              })
            }
            else {
              console.log('用户取消注册')
            }
          }
        })
        }
      },
      fail: err => {
        console.error(err)
      }
    })
  }
})