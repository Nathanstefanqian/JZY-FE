// pages/my/my.js
const user = wx.cloud.database().collection('user')
const user_job = wx.cloud.database().collection('user_job')
const job = wx.cloud.database().collection('job')

const refresh = () => {
  var currentPages = getCurrentPages();
  var currentPage = currentPages[currentPages.length - 1];
  currentPage.onLoad(); // 触发页面的 onLoad 方法
}
Page({
  data: {
    isLogin: wx.getStorageSync('isLogin'),
    avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
    name: wx.getStorageSync('name'),
    major: wx.getStorageSync('major'),
    grade: wx.getStorageSync('grade'),
    data: [1, 2, 3, 4],
    stateList: [],
    state: [0, 0, 0, 0]
  },

  async onLoad() {
    const openid = wx.getStorageSync('openid')
    const res = await user_job.where({ _openid: openid }).get()
    let stateList = await Promise.all(res.data.map(async item => {
      const { jobId } = item
      const jobRes = await job.where({ _id: jobId }).get()
      return jobRes.data[0]
    }))
    let { state } = this.data
    state = [0, 0, 0, 0]
    stateList.map(item => {
      state[parseInt(item.state)] += 1
    })
    console.log(state)
    this.setData({
      stateList, state
    })
    this.setData({
      isLogin: wx.getStorageSync('isLogin'),
      avatarUrl: wx.getStorageSync('avatarUrl') || '../../assets/boy.svg',
      name: wx.getStorageSync('name'),
      major: wx.getStorageSync('major'),
      grade: wx.getStorageSync('grade'),
    })
  },

  onShow() {
    this.onLoad()
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
      const data = res.data[0]
      for (const key in data) {
        wx.setStorageSync(key, data[key])
      }
      wx.setStorageSync('isLogin', true)
      this.onLoad()
    }
  },

  onPersonal(e) {
    wx.navigateTo({
      url: '../personal/personal',
    })
  },

  onSetting(e) {
    wx.navigateTo({
      url: '../setting/setting',
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

  onProxy(e) {
    wx.navigateTo({
      url: '../proxy/proxy'
    })
  },

  onState() {
    wx.navigateTo({
      url: '../state/state',
    })
  },

  onStar() {
    wx.navigateTo({
      url: '../star/star',
    })
  }
})