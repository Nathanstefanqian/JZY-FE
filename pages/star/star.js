const user_star = wx.cloud.database().collection('user_star')
const user = wx.cloud.database().collection('user')
const job = wx.cloud.database().collection('job')
const formatTime = (timeString) => {
  const date = new Date(timeString);
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, ''); // 将小数点及 'Z' 删除
  return formattedTime;
};
/**
 * 兼职 0
 * 跑腿 1
 * 家教 2
 */
Page({
  data: {
    starList: [],
    countList: [0,0,0]
  },
  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    const res = await user_star.where({ _openid: openid }).get()
    let countList = [0,0,0]
    const starList = await Promise.all(res.data.map(async item => {
      const jobItem = await job.where({ _id: item.jobId }).get()
      const userItem = await user.where({ _id: item.openid }).get()
      item.job = jobItem.data[0]
      item.user = userItem.data[0]
      item.time = formatTime(item.time)
      countList[item.type] += 1
      return item
    }))
    this.setData({ starList, countList },() => wx.hideLoading())
  },
  async onCancel(e) {
    wx.showModal({
      title: '提示',
      content: '确认取消收藏该职位吗？',
      success: async result => {
        if(result.confirm) {
          const { openid, id } = e.currentTarget.dataset
          const res = await user_star.where({
            _openid: openid,
            jobId: id
          }).remove()
          console.log(res)
          this.onLoad()
          wx.showToast({ title: '取消收藏成功' })
        }
      }
    })
  },
  onDetail(e) {
    const { index } = e.currentTarget.dataset
    console.log(index)
    wx.navigateTo({
      url: `../detail/detail?id=${index}`
    })
  }
})