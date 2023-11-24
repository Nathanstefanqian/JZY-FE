const job = wx.cloud.database().collection("job")
const user = wx.cloud.database().collection("buser")
const user_job = wx.cloud.database().collection("user_job")
const user_star = wx.cloud.database().collection("user_star")
const verify = wx.cloud.database().collection("verify")
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
    verifyType: ''
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
    console.log(id)
    const JobId = id
    // 载入详情
    let res = await job.where({ _id: id }).get()
    const data = res.data[0] // 代表拿到的职位详情信息
    console.log('职位', res)
    res = await user.where({ _openid: data._openid }).get() // 拿到商家信息
    const buser = res.data[0]
    const jobDetail = data
    // 查询是否已报名
    const openid = wx.getStorageSync('openid')
    res = await user_job.where({ jobId: id, _openid: openid }).get()
    if (res.data.length) {
      this.setData({
        isRegistered: true
      })
    }

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
      salary: data.salaryEnd + data.select.selectTime,
      work: data.work,
      workPlace: data.workPlace,
      demand: data.demand,
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
  async onSignup() {
    const { id } = this.data
    console.log(id)
    const currentTime = new Date()
    // 修改数据库
    // const res = await user_job.add({
    //   data: { jobId: id, state: 0, time: currentTime } // state分为四个状态 0代表待录取，1代表已录取，2代表已结束
    // })
    // 修改后及时刷新页面
    // this.onLoad()
    // console.log(res)
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
    wx.showToast({
      title: '报名成功'
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
