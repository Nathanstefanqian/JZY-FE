const job = wx.cloud.database().collection("job")
const user = wx.cloud.database().collection("buser")
const user_job = wx.cloud.database().collection("user_job")
const user_star = wx.cloud.database().collection("user_star")
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
    jobDetail: ''
  },
  async onLoad(e) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const { id } = e
    if (id) this.setData({ id })
    const JobId = id ? id : this.data.id
    // 载入详情
    let res = await job.where({ _id: id }).get()
    const data = res.data[0]
    res = await user.where({ _openid: data._openid }).get()
    const buser = res.data[0]
    const jobDetail = data
    // 查询是否已报名
    res = await user_job.where({ jobId: id, _openid: data._openid }).get()
    if (res.data.length) {
      this.setData({
        isRegistered: true
      })
    }

    // 查询是否已收藏
    res = await user_star.where({ jobId: id }).get()
    
    this.setData({
      jobTitle: data.jobTitle,
      salary: data.salaryEnd + data.select.selectTime,
      work: data.work,
      workPlace: data.workPlace,
      demand: data.demand,
      desc: data.desc,
      user: buser,
      id,
      jobDetail
    }, () => wx.hideLoading())
  },
  onAssign() {
    wx.navigateTo({
      url: '../assign/assign',
    })
  },
  async onSignup() {
    const { id } = this.data
    const currentTime = new Date()
    // 修改数据库
    const res = await user_job.add({
      data: { jobId: id, state: 0, time: currentTime } // state分为四个状态 0代表待录取，1代表已录取，2代表已结束
    })
    // 修改后及时刷新页面
    this.onLoad()
    console.log(res)
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
      const res = await user_star.add({
        data: { jobId: id, time: currentTime }
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
    const { select, contactValue } = jobDetail
    console.log(jobDetail)
    const { _id } = jobDetail
    const currentTime = new Date()
    // 修改数据库
    await user_job.add({
      data: { jobId: _id, state: 0, time: currentTime } // state分为四个状态 0代表待录取，1代表已录取，2代表已结束
    })
    // 修改后及时刷新页面
    this.onLoad()

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
