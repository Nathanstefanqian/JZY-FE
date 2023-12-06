const app = getApp()
const { imageCdn } = app.globalData
const db = wx.cloud.database()
const user = wx.cloud.database().collection('buser')

Page({
  data: {
    keyword: '',
    imageCdn: imageCdn,
    jobList: []
  },

  async onLoad(query) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const { keyword } = query
    const res = await await db.collection('job')
      .where({
        jobTitle: db.RegExp({
          regexp: '.*' + keyword + '.*', // 使用正则表达式进行模糊搜索
          options: 'i' // 设置为不区分大小写
        }),
        state: 0
      })
      .get()
    const jobList = await Promise.all(res.data.map(async item => {
      console.log(item)
      const { _openid } = item
      let result = await user.where({ _openid }).get()
      console.log(result)
      item.user = result.data[0]
      return item
    }))
    console.log(jobList)
    this.setData({ jobList: res.data, keyword }, () => wx.hideLoading())
  },

  handleSearch(e) {
    const { value } = e.detail
    wx.navigateTo({
      url: `../result/index?keyword=${value}`,
    })
  },

  onDetail(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `../detail/detail?id=${id}`
    })
  }
})