const user_take = wx.cloud.database().collection('user_take')
const takeaway = wx.cloud.database().collection('takeaway')
const user = wx.cloud.database().collection('user')
const buser = wx.cloud.database().collection('buser')
const formatTime = (timeString) => {
  const date = new Date(timeString)
  const formattedTime = date.toISOString()
    .replace('T', ' ') // 将 'T' 替换为空格
    .replace(/\.\d+Z$/, '') // 将小数点及 'Z' 删除
  return formattedTime
}

Page({
  data:{
    list: []
  },
  async onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = wx.getStorageSync('openid')
    const res  = await user_take.where({ _openid: openid}).get()
    let list = []
    await Promise.all(res.data.map(async item => {
      if(item.state == 2) {
        let result = await takeaway.where({ _id: item.jobId }).get()
        item.job = result.data[0]
        result = await buser.where({ _openid: item.job._openid }).get()
        item.buser = result.data[0]
        item.cTime = formatTime(item.cTime)
        item.time = formatTime(item.time)
        list.push(item)
      }
    }))
    console.log(list)
    this.setData({ list }, ()=> wx.hideLoading())
  }
})