// pages/my/my.js
const user = wx.cloud.database().collection('user')
const user_job = wx.cloud.database().collection('user_job')
const job = wx.cloud.database().collection('job')
const { imageUrl } = require('../../config/index')
Page({
  data: {
    imageUrl,
    isLogin: wx.getStorageSync('isLogin'),
    avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
    name: wx.getStorageSync('name'),
    major: wx.getStorageSync('major'),
    grade: wx.getStorageSync('grade'),
    state: [0, 0, 0, 0],
    isTeacher: 0,
    school: '',
    schoolId: ''
  },

  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    // 获取该用户的任务情况
    const res = await user_job.where({ _openid: openid }).get()
    let list = res.data
    let { state } = this.data
    state = [0, 0, 0, 0]
    list.map(item => {
      state[parseInt(item.state)] += 1
    })
    this.setData({
      state,
      isLogin: wx.getStorageSync('isLogin'),
      avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
      name: wx.getStorageSync('name'),
      major: wx.getStorageSync('major'),
      grade: wx.getStorageSync('grade'),
      school: wx.getStorageSync('school'),
      isTeacher: wx.getStorageSync('isTeacher') || 0
    }, () => wx.hideLoading())
  },

  onShow() {
    this.onLoad()
  },

  onExit() {
    wx.clearStorageSync()
    wx.setStorageSync('isLogin', false)
    wx.showToast({ title: '退出成功' })
  },

  async onLogin(e) {
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: async ress => {
        console.log(ress)
        const { openid } = ress.result
        const res = await user.where({
          _openid: openid
        }).get()
        if (!res.data.length) { // 如果没找到则引导注册
          wx.navigateTo({
            url: '../edit/edit'
          })
        } else { // 如果找到则立即登录
        const data = res.data[0]
        for (const key in data) {
          wx.setStorageSync(key, data[key])
        }
        wx.setStorageSync('openid', openid)
        wx.setStorageSync('isLogin', true)
        wx.showToast({ title: '登录成功' })
        setTimeout(() => this.onLoad(), 2000)
        }
      }
    })
  },

  onEdit() {
    wx.navigateTo({
      url: '../edit/edit'
    })
  },

  onStar() {
    if(wx.getStorageSync('isLogin')) { // 如果已经登录
      wx.navigateTo({
        url: '../star/star',
      })
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
  },

  onSetting(e) {
    wx.clearStorageSync()
    wx.showToast({ title: '退出成功' })
    setTimeout(() => this.onLoad(), 1000)
  },

  onResume(e) {
    if(wx.getStorageSync('isLogin')) { // 如果已经登录
      wx.navigateTo({
        url: '../resume/resume',
      })
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
  },

  onBasic(e) {
    if(wx.getStorageSync('isLogin')) { // 如果已经登录
      wx.navigateTo({
        url: '../edit/edit?id=1',
      })
    }
    else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }

  },

  onProxy(e) {
    wx.navigateTo({
      url: '../proxy/proxy'
    })
  },

  onState() {    
  if(wx.getStorageSync('isLogin')) { // 如果已经登录
    wx.navigateTo({
      url: '../state/state',
    })
  }
  else {
    wx.showToast({
      title: '请先登录',
      icon: 'error'
    })
  }

  }
})