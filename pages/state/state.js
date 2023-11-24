const user_job = wx.cloud.database().collection("user_job")
const job = wx.cloud.database().collection("job")
Page({
  data: {
    stateList: [],
    state: [0, 0, 0, 0],
    contactShow: false,
    method: '',
    contact: ''
  },
  async onLoad() {
    const openid = wx.getStorageSync('openid')
    const res = await user_job.where({ _openid: openid }).get()
    let stateList = await Promise.all(res.data.map(async item => {
      const { jobId } = item
      const jobRes = await job.where({ _id: jobId }).get()
      item.job = jobRes.data[0]
      return item
    }))
    let { state } = this.data
    stateList.map(item => {
      state[parseInt(item.state)] += 1
    })
    console.log('状态统计', state)
    console.log('状态列表', stateList)
    this.setData({
      stateList, state
    })
  },
  onCardClick(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`,
    })
  },
  onContact(e) {
    console.log(e.currentTarget.dataset)
    const { select, contactValue } = e.currentTarget.dataset.item
    this.setData({ contactShow: true, method: select.selectContact, contact: contactValue })
  },
  onClipboard() {
    const { contact } = this.data
    const that = this
    wx.setClipboardData({
      data: contact,
      success: function (res) {
        wx.showToast({
          title: '联系方式已复制',
          duration: 2000
        })
        that.setData({ contactShow: false })
      }
    })
  },
  onClose() {
    this.setData({ contactShow: false })
  }
})