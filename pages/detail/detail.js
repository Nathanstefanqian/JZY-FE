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
    isStared: false
  },
  async onLoad(e) {
    const { id } = e
    // 载入详情
    let res = await job.where({ _id: id}).get()
    const data = res.data[0]
    res = await user.where({ _openid: data._openid }).get()
    const buser = res.data[0]

    // 查询是否已报名
    res = await user_job.where({ jobId: id, _openid: data._openid }).get()
    if(res.data.length) {
      this.setData({
        isRegistered: true
      })
    }

    // 查询是否已收藏
    res = await user_star.where({ jobId: id}).get()
    this.setData({
      jobTitle: data.jobTitle,
      salary: data.salaryEnd + data.select.selectTime,
      work: data.work,
      workPlace: data.workPlace,
      demand: data.demand,
      desc: data.desc,
      user: buser,
      id
    })
  },
  onAssign() {
    wx.navigateTo({
      url: '../assign/assign',
    })
  },
  async onSignup() {
    const { id } = this.data
    console.log('123')
    const res  = await user_job.add({
      data:  { jobId: id }
    })
    console.log(res)
  },
  async onStar() {
    const { id, isStared} = this.data
    const openid = wx.getStorageSync("openid")
    if(isStared) { // 取消收藏
      const res = await user_star.where({
        _openid: openid,
        jobId: id
      }).remove()
      console.log(res)
      this.setData({
        isStared: false
      })
    }
    else { // 确认收藏
      const res = await user_star.add({
        data: { jobId: id }
      })
      console.log(res)
      this.setData({
        isStared: true
      })
    }
  }
});
