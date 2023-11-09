const job = wx.cloud.database().collection('job')
const user = wx.cloud.database().collection('buser')
Page({
  data: {
    job: []
  },
  async onLoad() {
    const res = await job.get()
    console.log(res)
    let jobList = []
    await Promise.all(res.data.map(async item => {
      const res = await user.where({ _openid: item._openid }).get()
      item['user'] = res.data[0]
      jobList.push(item)
      console.log(item)
    }))
    this.setData({
      job: jobList
    })
  },
  onDetail(e) {
    console.log(e)
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  }
})