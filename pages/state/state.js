const user_job = wx.cloud.database().collection("user_job")
const job = wx.cloud.database().collection("job")
Page({
  data: {
    stateList: [],
    state: [0, 0, 0, 0]
  },
  async onLoad() {
    const openid = wx.getStorageSync('openid')
    const res = await user_job.where({ _openid: openid }).get()
    console.log(res)
    let stateList = await Promise.all(res.data.map(async item => {
      const { jobId } = item
      const jobRes = await job.where({ _id: jobId }).get()
      return jobRes.data[0]
    }))
    let { state } = this.data
    stateList.map(item => {
      state[parseInt(item.state)] += 1
    })
    this.setData({
      stateList, state
    })
  },
  onCardClick(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`,
    })
  }
})