const job = wx.cloud.database().collection("job")
const takeaway = wx.cloud.database().collection("takeaway")
const user = wx.cloud.database().collection("buser")
const user_job = wx.cloud.database().collection("user_job")
const user_take = wx.cloud.database().collection("user_take")
const user_star = wx.cloud.database().collection("user_star")
const verify = wx.cloud.database().collection("verify")
const userLocation = wx.cloud.database().collection("userLocation")
Page({
  data: {
    active: 0,
    jobTitle: '',
    salary: '',
    work: [],
    demand: '',
    desc: '',
    user,
    id: '',
    isRegistered: false,
    isStared: false,
    show: false,
    contactShow: false,
    contact: '',
    method: '',
    jobDetail: '',
    verifyType: '',
    destPlace: '',
    workPlace: '',
    destTime: ''
  },
  async onLoad(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let id
    if(e && e.id) {
      id = e.id
      this.setData({ id })
    } else {
      id = this.data.id
    }

    // 载入详情
    let res = await takeaway.where({ _id: id }).get()
    const data = res.data[0] // 代表拿到的职位详情信息
    res = await user.where({ _openid: data._openid }).get() // 拿到商家信息
    const buser = res.data[0]
    const jobDetail = data

    // 查询是否已接过单
    const openid = wx.getStorageSync('openid')
    res = await user_take.where({ _openid: openid }).get()
    res.data.map(item => {
      if(item.state == 0 || item.state == 1) {
        this.setData({ isRegistered: true })
      }
    })

    // 查询是否已收藏
    res = await user_star.where({ jobId: id, _openid: openid }).get()
    console.log('收藏', res)
    let isStared = res.data.length ? true: false

    // 查询是否已认证
    res = await verify.where({ _openid: data._openid }).get()
    console.log('认证详情', res)
    let verifyType = res.data[0].type ? '企业' : '个人'

    this.setData({
      jobTitle: data.jobTitle,
      salary: data.salaryEnd,
      workPlace: data.workPlace,
      destPlace: data.destPlace,
      destTime: data.destTime,
      desc: data.desc,
      user: buser,
      jobDetail,
      isStared,
      verifyType
    }, () => wx.hideLoading())
  },

  onAssign() {
    wx.navigateTo({
      url: '../assign/assign',
    })
  },

  async onStar() {
    const { id, isStared } = this.data
    const openid = wx.getStorageSync("openid")
    const currentTime = new Date()
    if (isStared) { // 取消收藏
      const res = await user_star.where({
        _openid: openid,
        jobId: id,
      }).remove()
      console.log(res)
      this.setData({
        isStared: false
      })
      wx.showToast({ title: '已取消收藏' })
    }
    else { // 确认收藏
      await user_star.add({
        data: { jobId: id, time: currentTime, type: 1 }
      })
      this.setData({
        isStared: true
      })
      wx.showToast({ title: '已收藏' })
    }
  },

  onBuserDetail() {
    this.setData({ show: true })
  },

  onClose() {
    this.setData({ show: false, contactShow: false })
  },

  async onContact(e) {
    const { jobDetail } = this.data
    const { _id } = jobDetail
    const currentTime = new Date()
    // 修改数据库 该记录更新骑手对订单的进度汇报
    await user_take.add({
      data: { jobId: _id, state: 0, time: currentTime,  progress: 1  } // state分为四个状态 0代表已接单，1代表已拿到货，2代表已交付待结束
    })
    // 标记该订单已接单的状态  state分为 3个状态，0 待接单  1 已接单   2 已完成
    await takeaway.where({ _id }).update({
      data: { state: 1 }
    })

    // 接单时，创建当前骑手的位置信息
    const openid = wx.getStorageSync('openid')
    const location = await userLocation.where({ _openid: openid }).get()
    if(!location.data.length) {
      userLocation.add({ data: { jobId: jobDetail._id }})
    }

    // 进行消息通知，通知到发布者该订单已被接单 todo等待union id
    // wx.cloud.callFunction({
    //   name: 'IhaveTakenOrder',
    //   data: {
    //     openid: jobDetail._openid, // 接收消息的用户openid
    //   },
    //   complete: res => {
    //     console.log(res)
    //   }
    // })

    wx.showToast({
      title: '接单成功'
    })
    // 修改后及时刷新页面
    setTimeout(() => this.onLoad(),2000)
  },

  async onClipboard() {
    const { contact } = this.data
    const that = this
    wx.setClipboardData({
      data: contactValue,
      success: function (res) {
        wx.showToast({
          title: '联系方式已复制',
          duration: 2000
        })
        that.setData({ contactShow: false })
      }
    })
    this.setData({ contactShow: true, method: select.selectContact, contact: contactValue })
  },
});
