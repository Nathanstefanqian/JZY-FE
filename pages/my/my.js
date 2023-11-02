// pages/my/my.js
const user = wx.cloud.database().collection('user')
Page({
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
    name: wx.getStorageSync('name'),
    major: wx.getStorageSync('major'),
    grade: wx.getStorageSync('grade'),
    data: [1,2,3,4]
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
    wx.showToast({ title: '退出成功' })
  },

  async onLogin(e) {
    const res = await user.where({ _openid: 'oGJPU5X4rWM6geXlgV3C9WRAazf4' }).get()
    if (res.data.length === 0) {
      wx.showModal({
        title: '快去注册！', content: '当前账号没有注册，是否注册？',
        success: res => {
          if (res.confirm) {
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
    else {
      console.log(res.data)
      const data= res.data[0]
      for(const key in data) {
        wx.setStorageSync(key, data[key])
      }
      wx.setStorageSync('isLogin', true)
    }
  },

  onPersonal(e) {
    wx.navigateTo({
      url: '../personal/personal',
    })
  },

  onResume(e) {
    wx.navigateTo({
      url: '../resume/resume'
    })
  },

  onBasic(e) {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },

  onState() {
    wx.navigateTo({
      url: '../state/state',
    })
  }
})